import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

interface UpdateBody {
    source: "r2" | "cf-images";
    /** R2 object key OR CF Images image ID */
    id: string;
    displayName?: string;
    contentType?: string;
    contentDisposition?: string;
    cacheControl?: string;
    /** Arbitrary key-value pairs merged with existing custom metadata */
    customMetadata?: Record<string, string>;
}

export const PATCH: APIRoute = async ({ request }) => {

    let body: UpdateBody;
    try {
        body = (await request.json()) as UpdateBody;
    } catch {
        return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const { source, id, displayName, contentType, contentDisposition, cacheControl, customMetadata } = body;

    if (!source || !id) {
        return Response.json({ ok: false, error: "source and id are required" }, { status: 400 });
    }

    try {
        if (source === "r2") {
            // ── R2: fetch existing object and re-put with updated metadata ──
            const existing = await env.MEDIA_BUCKET.get(id);
            if (!existing) {
                return Response.json({ ok: false, error: "Object not found" }, { status: 404 });
            }
            const mergedCustom: Record<string, string> = {
                ...(existing.customMetadata ?? {}),
                ...(customMetadata ?? {}),
            };
            if (displayName !== undefined) mergedCustom.displayName = displayName;

            await env.MEDIA_BUCKET.put(id, existing.body, {
                httpMetadata: {
                    contentType: contentType ?? existing.httpMetadata?.contentType,
                    contentDisposition: contentDisposition ?? existing.httpMetadata?.contentDisposition,
                    cacheControl: cacheControl ?? existing.httpMetadata?.cacheControl,
                },
                customMetadata: mergedCustom,
            });
            return Response.json({ ok: true, source: "r2", key: id });
        }

        if (source === "cf-images") {
            // ── Cloudflare Images: PATCH metadata ───────────────────────
            if (!env.CF_ACCOUNT_ID || !env.CF_IMAGES_TOKEN) {
                return Response.json(
                    { ok: false, error: "CF_ACCOUNT_ID / CF_IMAGES_TOKEN not configured" },
                    { status: 503 }
                );
            }
            const patchBody: Record<string, unknown> = {};
            if (displayName !== undefined) patchBody.filename = displayName;
            if (customMetadata !== undefined) patchBody.metadata = customMetadata;

            const res = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v1/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${env.CF_IMAGES_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(patchBody),
                }
            );
            const data = (await res.json()) as { result?: unknown; errors?: Array<{ message: string }> };
            if (!res.ok) {
                return Response.json(
                    { ok: false, error: data.errors?.[0]?.message ?? "CF Images update failed" },
                    { status: res.status }
                );
            }
            return Response.json({ ok: true, source: "cf-images", result: data.result });
        }

        return Response.json({ ok: false, error: "Unknown source" }, { status: 400 });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return Response.json({ ok: false, error: message }, { status: 500 });
    }
};
