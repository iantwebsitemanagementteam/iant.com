// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
    redirects: {
        "/donate": "https://donation.masjidal.com/IANT",
    },
    vite: {
        plugins: [tailwindcss()],
    },

    adapter: cloudflare({
        imageService: { build: 'compile', runtime: 'cloudflare-binding' }

    }),
});