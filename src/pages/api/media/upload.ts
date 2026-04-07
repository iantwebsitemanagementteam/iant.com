import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

const IMAGE_EXTENSIONS = new Set([
    "jpg", "jpeg", "png", "gif", "webp", "avif", "svg", "bmp", "tiff", "tif", "ico",
]);

function getExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() ?? "";
}

function isImageFile(filename: string, contentType: string): boolean {
    if (contentType.startsWith("image/")) return true;
    return IMAGE_EXTENSIONS.has(getExtension(filename));
}

async function uploadToR2(
    file: File,
    customMetadata: Record<string, string>,
    displayName: string | null,
) {
    const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    await env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type || "application/octet-stream" },
        customMetadata: { ...customMetadata, displayName: displayName ?? file.name },
    });
    return key;
}

export const POST: APIRoute = async ({ request }) => {

    try {
        const form = await request.formData();
        const file = form.get("file");
        const displayName = (form.get("displayName") as string | null) ?? null;
        const customMetadataRaw = form.get("customMetadata") as string | null;

        if (!(file instanceof File)) {
            return Response.json({ ok: false, error: "No file provided" }, { status: 400 });
        }

        const customMetadata: Record<string, string> = {};
        if (customMetadataRaw) {
            try {
                Object.assign(customMetadata, JSON.parse(customMetadataRaw));
            } catch {
                // ignore malformed metadata
            }
        }
        if (displayName) customMetadata.displayName = displayName;

        const useCloudflareImages =
            isImageFile(file.name, file.type) &&
            env.CF_ACCOUNT_ID &&
            env.CF_IMAGES_TOKEN;

        if (useCloudflareImages) {
            // ── Upload to Cloudflare Images ──────────────────────────────
            const uploadForm = new FormData();
            uploadForm.append("file", file, file.name);
            if (Object.keys(customMetadata).length > 0) {
                uploadForm.append("metadata", JSON.stringify(customMetadata));
            }

            try {
                const res = await fetch(
                    `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v1`,
                    {
                        method: "POST",
                        headers: { Authorization: `Bearer ${env.CF_IMAGES_TOKEN}` },
                        body: uploadForm,
                    }
                );
                const data = (await res.json()) as { result?: { id: string; filename: string }; errors?: Array<{ message: string }> };
                if (res.ok) {
                    return Response.json({ ok: true, source: "cf-images", result: data.result });
                }

                // If Images auth is misconfigured, gracefully fall back to R2.
                if (res.status === 401 || res.status === 403) {
                    const key = await uploadToR2(file, customMetadata, displayName);
                    return Response.json({
                        ok: true,
                        source: "r2",
                        key,
                        warning: data.errors?.[0]?.message ?? "CF Images rejected upload; stored in R2 instead",
                    });
                }

                return Response.json(
                    { ok: false, error: data.errors?.[0]?.message ?? "CF Images upload failed" },
                    { status: res.status }
                );
            } catch {
                const key = await uploadToR2(file, customMetadata, displayName);
                return Response.json({
                    ok: true,
                    source: "r2",
                    key,
                    warning: "CF Images request failed; stored in R2 instead",
                });
            }
        } else {
            // ── Upload to R2 ─────────────────────────────────────────────
            const key = await uploadToR2(file, customMetadata, displayName);
            return Response.json({ ok: true, source: "r2", key });
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return Response.json({ ok: false, error: message }, { status: 500 });
    }
};
