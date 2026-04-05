IANT Astro Site - Full LLM Context

Site Name
Islamic Association of North Texas (IANT)

Tech Stack
- Astro
- Tailwind CSS v4
- Astro layout + component composition

Entry Route
- / (home page)

Page Composition
- src/pages/index.astro uses src/layouts/Layout.astro
- src/components/Home.astro composes:
  - Nav
  - Hero
  - Prayer
  - Community
  - Donation
  - Footer

Brand and Positioning
- Organization: Islamic Association of North Texas
- Established: 1969
- Core message: Faith. Community. Worship.

Navigation (Top Bar)
- Home
- Prayer Times
- Services
- Events
- Donate
- Primary CTA: Join Community

Hero Section
- Large visual header with mosque interior background image
- Overlaid text:
  - Established 1969
  - Islamic Association of North Texas
  - Faith. Community. Worship.
- Hero actions:
  - Donate
  - Our Services

Prayer Times Section
- Title: Daily Prayer Times
- Date shown: Oct 24, 2023 | 9 Rabi' al-Thani 1445
- Status pill: Next: Asr in 45 mins
- Displayed times:
  - Fajr: 05:15 (Iqamah 05:35)
  - Sunrise: 06:42
  - Dhuhr: 12:30 (Iqamah 01:00)
  - Asr: 03:45 (Iqamah 04:00)
  - Maghrib: 06:10 (Iqamah +5 mins)
  - Isha: 07:45 (Iqamah 08:15)

Community Services Section
- Title: Community Services
- Subtitle: Empowering our community through dedicated programs, educational resources, and charitable support.
- Cards:
  - Quran Classes
    - Tailored learning programs for children and adults to master Quranic recitation and Tajweed.
  - Food Pantry
    - Weekly distribution of fresh groceries and essentials to families in need across our local area.
  - Youth Mentorship
    - Engaging youth through sports, workshops, and spiritual guidance to foster future leaders.

Donation Section
- Title: Support Your Community
- Supporting message: Donations maintain facilities, support educational programs, and provide local aid.
- Donation value props:
  - Secure and tax-deductible
  - Direct impact on local programs
  - Transparent financial reporting
- Donation form:
  - Preset amounts: $25, $50, $100
  - Custom amount input
  - Donation types:
    - General Fund
    - Zakat
    - Sadaqah
    - Education Fund
  - CTA: Complete Donation

Footer
- Brand: IANT
- Description: Serving spiritual and social community needs through faith, education, and service since 1969.
- Quick Links:
  - Prayer Times
  - Community Center
  - Donate Now
  - Volunteer Opportunities
- Services Links:
  - Religious Counseling
  - Marriage Services
  - Funeral Arrangements
  - Quran Studies
- Contact:
  - Address: 840 Abrams Road Richardson, TX 75081
  - Phone: 972-231-5698
  - Email: webadmin@iant.com
- Copyright text uses current year dynamically

Design Tokens (Tailwind v4 CSS Theme)
- primary: #11d483
- background-light: #f6f8f7
- background-dark: #10221a
- display font: Inter, sans-serif
- radius tokens:
  - default: 0.25rem
  - lg: 0.5rem
  - xl: 0.75rem
  - full: 9999px
- dark mode variant configured via CSS custom variant

Notes for LLM Consumers
- Site content is currently static placeholders for links/actions in most sections.
- Prayer times and date are example values in the current implementation.
- Main route is component-driven and can be extended by adding more Astro pages under src/pages.
