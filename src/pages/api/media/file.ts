import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const key = url.searchParams.get("key");

        if (!key) {
            return Response.json({ ok: false, error: "Missing key" }, { status: 400 });
        }

        const object = await env.MEDIA_BUCKET.get(key);
        if (!object) {
            return Response.json({ ok: false, error: "Not found" }, { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.etag);
        // Allow images/files to be embedded in pages by default.
        headers.set("cache-control", headers.get("cache-control") ?? "public, max-age=86400");

        return new Response(object.body, { headers });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return Response.json({ ok: false, error: message }, { status: 500 });
    }
};
