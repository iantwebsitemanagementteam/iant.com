# Development Guide

## Prerequisites
- Node.js 22.12.0 or later
- pnpm

## Install
Run from project root:

pnpm install

## Local Development
Start the app:

pnpm dev

Build and preview locally:

pnpm build
pnpm preview

## Type and Worker Types
Generate worker types when Cloudflare bindings change:

pnpm types

## Project Structure (high level)

Read more details here: https://docs.astro.build/en/basics/project-structure/

- src/pages: route entry points
    
    ```
        # Example: Static routes
        src/pages/index.astro        -> iant.com/
        src/pages/about.astro        -> iant.com/about
        src/pages/about/index.astro  -> iant.com/about
        src/pages/about/me.astro     -> iant.com/about/me
        src/pages/posts/1.md         -> iant.com/posts/1
        src/pages/authors/[author].astro -> iant.com/authors/author_id or author_name
    ```

- src/components: UI sections/components
- src/layouts: page layout wrappers
- public: static assets
- docs: project documentation



## Common Files
- astro.config.mjs: Astro + Cloudflare + Vite config
- tailwind.config.js: design tokens/theme config
- wrangler.jsonc: Worker settings, bindings, and compatibility
