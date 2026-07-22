# FOR1S — Your VISION, bought to life.

A cinematic, motion-first landing page built as a full Next.js production
project. Placeholder brand (**FOR1S**), placeholder product (a precision
computing platform) — swap the copy in `lib/data.ts` and the palette in
`tailwind.config.ts` for your own.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling, with the brand's design tokens in
  `tailwind.config.ts`
- **GSAP** (`ScrollTrigger`, `SplitText`, `@gsap/react`'s `useGSAP`) for
  scroll-driven timelines, masked text reveals, and the pinned horizontal
  testimonials track
- **Framer Motion** for UI-level interaction: the nav, cursor, tab switching,
  accordion, and magnetic buttons
- **Lenis** for smooth scrolling, synced to GSAP's ticker so `ScrollTrigger`
  stays perfectly in step

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
```

## Project structure

```
app/
  layout.tsx        Fonts, metadata, global chrome (nav, footer, cursor, spine)
  page.tsx           Assembles the nine sections in order
  globals.css        Tailwind layers, cursor hiding, focus rings, reduced motion

components/
  layout/            Providers (Lenis), Preloader, Navbar, Footer,
                      CustomCursor, GrainOverlay, ScrollSpine
  ui/                 MagneticButton, SplitReveal, RevealMask, GlowCard,
                      SectionLabel — the reusable motion primitives
  sections/           Hero, Vision, Features, ProductPreview, Benefits,
                      Testimonials, Pricing, FAQ, FinalCTA

lib/
  data.ts             All site copy — edit this to rebrand the page
  gsap.ts             Registers GSAP plugins once; exposes prefersReducedMotion()
  utils.ts            cn() class merger + scrollToHash() (drives Lenis)

hooks/
  useMagnetic.ts       Spring-driven magnetic-pull effect for buttons
```

## Design notes

- **Palette**: `#050505` background / `#101010` surface / `#FFFFFF` text /
  `#BEBEBE` muted / `#E63946` accent — used deliberately, never as a wash.
- **Type**: Bricolage Grotesque (display) + Geist (body) + Instrument Serif
  italic (rare emotional accents — the Vision statement, testimonials).
- **Signature element**: the crimson "FOR1S line" on the right edge of the
  viewport (desktop) — a scroll-progress spine that threads through the
  whole page (`components/layout/ScrollSpine.tsx`).
- **Motion**: every section uses a *different* reveal technique on purpose —
  masked line reveals in the hero, a morphing blob in Vision, cursor-reactive
  glow cards in Features, a cursor-tilt glass panel in the product preview,
  GSAP scroll-parallax numerals in Benefits, a pinned horizontal scroll in
  Testimonials, and Framer Motion height animation in the FAQ accordion.

## Accessibility

- `prefers-reduced-motion` is respected throughout: `lib/gsap.ts` exposes
  `prefersReducedMotion()`, which every scroll/parallax effect checks before
  running (falling back to a simple fade), and `globals.css` neutralizes any
  remaining CSS transitions/keyframes at the OS level.
- The custom cursor and `cursor: none` only apply on `(pointer: fine)`
  devices — touch devices keep their native cursor and tap targets.
- Focus rings are visible (`:focus-visible`) using the accent color.

## Content

All copy lives in `lib/data.ts` — brand name, nav links, feature copy,
product preview tabs, benefits, testimonials, pricing tiers, and FAQ. Nothing
is hardcoded into the section components, so a rebrand is mostly a
find-and-replace in one file.
