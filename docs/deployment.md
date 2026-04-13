# Deployment Guide

## Target Platform
Deployment uses Cloudflare Workers via Astro Cloudflare adapter.

## Build Output
- Astro server entry: @astrojs/cloudflare/entrypoints/server
- Static assets directory: ./dist
- Assets binding: ASSETS

## Wrangler Configuration
Defined in wrangler.jsonc:
- name: iant
- compatibility_date: 2026-04-05
- observability: enabled
- R2 binding: MEDIA_BUCKET -> iant-media

## Secrets
Set required secrets using Wrangler:
- CF_ACCOUNT_ID
- CF_IMAGES_TOKEN

For local development, use .dev.vars with matching keys.

## Deployment Flow
1. Build the app:
   pnpm build
2. Deploy with Wrangler (if configured in your environment):
   wrangler deploy

## Maintenance
- Review compatibility_date regularly when upgrading dependencies.
- Regenerate worker types after binding changes with pnpm types.
