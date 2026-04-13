# IANT Tech Stack

## Core Framework
- Astro 6.1.3
- TypeScript (strict Astro config)
- Node.js >= 22.12.0

## UI and Styling
- Tailwind CSS 4.2.2
- Tailwind Vite plugin (@tailwindcss/vite)
- Astro components (.astro files)

## Runtime and Deployment
- Cloudflare Workers runtime
- Astro Cloudflare adapter (@astrojs/cloudflare)
- Wrangler 4.80.0 for deploy and Cloudflare resource configuration

## Storage and Media
- Cloudflare R2 bucket binding: MEDIA_BUCKET
- Cloudflare Images credentials via secrets for media workflows

## Build and Tooling
- Package manager: pnpm (lockfile present)
- Vite 7 override
- Astro CLI scripts:
	- pnpm dev
	- pnpm build
	- pnpm preview
	- pnpm astro
	- pnpm types

## Configuration Files
- astro.config.mjs
- tailwind.config.js
- tsconfig.json
- wrangler.jsonc
- worker-configuration.d.ts

## Notes
- Cloudflare observability is enabled in wrangler.jsonc.
- Compatibility date is pinned in wrangler.jsonc and should be reviewed during upgrades.
