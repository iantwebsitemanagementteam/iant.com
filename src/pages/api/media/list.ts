import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

const IMAGE_MIME_PREFIXES = ["image/"];

function isImageType(contentType: string | undefined): boolean {
    return IMAGE_MIME_PREFIXES.some((p) => contentType?.startsWith(p));
}

export const GET: APIRoute = async () => {
    try {
        // ── R2: list all objects with their metadata ──────────────────────
        const listed = await env.MEDIA_BUCKET.list({ limit: 1000 });
        const r2Items = await Promise.all(
            listed.objects.map(async (obj) => {
                const head = await env.MEDIA_BUCKET.head(obj.key);
                const contentType =
                    head?.httpMetadata?.contentType ?? "application/octet-stream";
                return {
                    id: `r2::${obj.key}`,
                    key: obj.key,
                    name: head?.customMetadata?.displayName ?? obj.key,
                    size: obj.size,
                    contentType,
                    contentDisposition: head?.httpMetadata?.contentDisposition ?? null,
                    cacheControl: head?.httpMetadata?.cacheControl ?? null,
                    uploaded: obj.uploaded?.toISOString() ?? null,
                    etag: obj.etag,
                    customMetadata: head?.customMetadata ?? {},
                    source: "r2" as const,
                    isImage: isImageType(contentType),
                    url: `/api/media/file?key=${encodeURIComponent(obj.key)}`,
                };
            })
        );

        // ── Cloudflare Images: list ────────────────────────────────────────
        let cfImages: object[] = [];
        if (env.CF_ACCOUNT_ID && env.CF_IMAGES_TOKEN) {
            const res = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v1?per_page=100`,
                { headers: { Authorization: `Bearer ${env.CF_IMAGES_TOKEN}` } }
            );
            if (res.ok) {
                const data = (await res.json()) as {
                    result: { images: Array<{ id: string; filename: string; uploaded: string; variants: string[]; meta?: Record<string, string> }> };
                };
                cfImages = (data.result?.images ?? []).map((img) => ({
                    id: `cf::${img.id}`,
                    cfId: img.id,
                    name: img.filename,
                    size: null,
                    contentType: "image/*",
                    uploaded: img.uploaded,
                    variants: img.variants,
                    url: img.variants?.[0] ?? null,
                    customMetadata: img.meta ?? {},
                    source: "cf-images" as const,
                    isImage: true,
                }));
            }
        }

        return Response.json({ r2: r2Items, cfImages, ok: true });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return Response.json({ ok: false, error: message }, { status: 500 });
    }
};
