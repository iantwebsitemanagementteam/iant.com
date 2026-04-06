import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const DELETE: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const source = url.searchParams.get("source") as "r2" | "cf-images" | null;
    const id = url.searchParams.get("id");

    if (!source || !id) {
        return Response.json({ ok: false, error: "source and id query params required" }, { status: 400 });
    }

    try {
        if (source === "r2") {
            await env.MEDIA_BUCKET.delete(id);
            return Response.json({ ok: true, source: "r2", key: id });
        }

        if (source === "cf-images") {
            if (!env.CF_ACCOUNT_ID || !env.CF_IMAGES_TOKEN) {
                return Response.json(
                    { ok: false, error: "CF_ACCOUNT_ID / CF_IMAGES_TOKEN not configured" },
                    { status: 503 }
                );
            }
            const res = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v1/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${env.CF_IMAGES_TOKEN}` },
                }
            );
            const data = (await res.json()) as { errors?: Array<{ message: string }> };
            if (!res.ok) {
                return Response.json(
                    { ok: false, error: data.errors?.[0]?.message ?? "CF Images delete failed" },
                    { status: res.status }
                );
            }
            return Response.json({ ok: true, source: "cf-images", id });
        }

        return Response.json({ ok: false, error: "Unknown source" }, { status: 400 });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return Response.json({ ok: false, error: message }, { status: 500 });
    }
};
