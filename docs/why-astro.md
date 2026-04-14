# Why We Chose Astro (with Cloudflare)

This document compares Next.js, Hugo, and Astro for the IANT website, then explains why we selected Astro with Cloudflare as our hosting provider.

## Project Needs

- Fast page loads for content-heavy public pages
- Low hosting and maintenance cost
- Strong SEO and accessibility support
- Easy content updates and long-term maintainability
- Optional dynamic features (forms, media APIs, admin tooling) without forcing a full SPA architecture

## Quick Comparison

| Category | Next.js | Hugo | Astro |
| --- | --- | --- | --- |
| Core model | React framework (SSR/SSG/ISR, app runtime) | Static site generator (Go-based) | Content-first web framework with islands architecture |
| Performance baseline | Good, but can ship more JS depending on implementation | Excellent static output, near-zero JS by default | Excellent by default, ships minimal JS unless interactive islands are added |
| Developer experience | Strong ecosystem, but higher complexity and more moving parts | Very fast builds, simple for static pages, less flexible app patterns | Simple for content sites, flexible component model, good balance of static + dynamic |
| Dynamic features | First-class SSR/API routes/middleware | Limited (usually external services) | Supports server routes and adapters, good for selective dynamic features |
| Content workflows | Good with MD/MDX/CMS integrations | Great for Markdown-heavy docs/blogs | Great with Markdown + component-driven pages |
| Build/runtime complexity | Medium to high | Low | Low to medium |
| Best fit | App-like products and dashboards | Mostly static documentation/blog sites | Marketing/content sites with selective interactivity |

## Pros and Cons

### Next.js

Pros:
- Mature ecosystem and large talent pool
- Excellent for highly dynamic, app-like user experiences
- Strong integrations for React-heavy teams

Cons:
- Easy to over-ship JavaScript for content pages
- Higher architectural complexity than needed for our primary use case
- More runtime and deployment surface area to manage

### Hugo

Pros:
- Very fast build times and static output
- Minimal operational complexity
- Strong for straightforward content sites

Cons:
- Less flexible when adding interactive UI or app-like features
- Templating and component ergonomics are less modern for our workflow
- Dynamic features typically require external systems

### Astro

Pros:
- Excellent performance default (minimal client JS)
- Great for content sites with component-based UI
- Islands architecture allows adding interactivity only where needed
- Supports server endpoints and deployment adapters for dynamic needs

Cons:
- Smaller ecosystem than Next.js
- Some advanced React ecosystem patterns are less direct (when compared to all-in React frameworks)

## Why Astro Is the Best Fit

Astro matches our priorities most closely:

- It gives us static-first performance for public-facing pages.
- It avoids unnecessary JavaScript while still allowing interactive components where useful.
- It keeps the codebase approachable for a mixed team working on content and UI.
- It supports dynamic endpoints when needed (for example media workflows) without forcing a heavy runtime model everywhere.

## Why Cloudflare as Hosting Provider

Cloudflare is a strong deployment match for this Astro project:

- Global edge network improves latency and user experience.
- Strong static asset delivery and caching behavior.
- Built-in security controls (WAF, DDoS protection, TLS, bot protections).
- Cost-effective and scalable for traffic spikes.
- Cloudflare Workers + Astro adapter provide a clean path for server-side endpoints when required.

## Final Decision

We are selecting **Astro** as the web framework and **Cloudflare** as the hosting and edge platform.

This combination gives us the best balance of performance, simplicity, scalability, and future flexibility for the IANT website.
