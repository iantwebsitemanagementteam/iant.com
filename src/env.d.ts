/// <reference types="astro/client" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

interface Env {
    ASSETS: Fetcher;
    MEDIA_BUCKET: R2Bucket;
    CF_ACCOUNT_ID: string;
    CF_IMAGES_TOKEN: string;
}

declare namespace App {
    interface Locals extends Runtime { }
}
