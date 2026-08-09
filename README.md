<p align="center">
  <img src="assets/for1s-hero-1920x1080.png" alt="FOR1S Banner">
</p>

<div align="center">

# FOR1S

### Websites that win customers.

<p>
FOR1S is a motion-first web design studio for local businesses and personal brands. We design, write, build, and launch the website — one small team, one timeline, one price. No jargon, no templates, no handoff gaps.
</p>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
![Status](https://img.shields.io/badge/status-active_development-blue)

</div>

<p align="center">
  <svg width="180" height="56" viewBox="0 0 180 56" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="FOR1S — websites that win customers">
    <circle cx="20" cy="28" r="14" fill="none" stroke="#E63946" stroke-width="1.5">
      <animate attributeName="r" values="14;17;14" dur="2.4s" repeatCount="indefinite"/>
      <animate attributeName="stroke-opacity" values="0.9;0.25;0.9" dur="2.4s" repeatCount="indefinite"/>
    </circle>
    <path d="M20 20 C 25 25, 25 31, 20 36 C 15 31, 15 25, 20 20 Z" fill="#E63946">
      <animate attributeName="opacity" values="1;0.55;1" dur="2.4s" repeatCount="indefinite"/>
    </path>
    <text x="46" y="34" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22" font-weight="700" fill="#FFFFFF" letter-spacing="3">FOR1S</text>
    <circle cx="132" cy="28" r="3" fill="#E63946">
      <animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite"/>
    </circle>
  </svg>
</p>

---

# Overview

FOR1S builds premium websites for local businesses and personal brands — designed to look expensive, built to get found, and made to win you customers.

We didn't set out to build another agency. We set out to build the one we wish existed when we were starting out. Every decision — design, copy, layout, speed — exists to turn a visitor into a customer. We strip away what doesn't help your business, what doesn't load fast, and what doesn't get you found. What's left is a website that makes your business look as good as it is.

Most sites go live in **1–3 weeks** — a deliberately tight timeline built on a repeatable process, not on cutting corners. From cafés, salons, and photographers to freelancers and growing brands, every site is designed from scratch, mobile-first, and built to get found.

---

# Services

We do five things differently — not as buzzwords, but as engineering decisions that compound over time:

- 🧑‍🤝‍🧑 **End to end, one team** — Design, copy, build, and launch handled by the same small team. One person to talk to, one timeline, one price. No agencies juggling, no handoff gaps.
- 📱 **Fast on every phone** — Pages that load in a blink and feel premium everywhere, even on patchy mobile connections. Speed isn't a bonus, it's expected.
- 🔍 **Found on Google** — SEO is built in from day one, so your business shows up when people search for what you do.
- ✨ **Made to stand out** — No templates, no borrowed layouts. Your site is designed from scratch around your business, your customers, and your goals.
- 🛟 **We don't disappear** — Launch day isn't the finish line. Updates, fixes, and improvements — we stay with you.

---

# Features

## Motion & Experience

- 🎬 Cinematic scroll experiences
- ⚡ Smooth Lenis scrolling
- ✨ GSAP ScrollTrigger animations
- 🎭 SplitText text reveals
- 🎯 Reusable animation system
- 🖱️ Interactive cursor effects
- 📱 Fully responsive layouts
- 🎨 Premium UI transitions

## Interface

- Modern navigation
- Services showcase
- Vision section
- Interactive process (Discover → Design → Build → Launch & care)
- Animated pricing cards
- FAQ accordion
- Case-study "Work" section
- Conversion-focused call-to-actions
- Modular reusable components

## Engineering

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL support
- API-ready architecture
- Reusable React components
- Scalable project structure

## Performance & Accessibility

- Semantic HTML
- Keyboard-friendly navigation
- Reduced-motion support
- Responsive across all devices
- Performance-first animations
- Clean, maintainable architecture

---

# Tech Stack

| **Category** | **Technology** |
|-----------|------------|
| Framework | Next.js 14 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | GSAP, ScrollTrigger, SplitText, Lenis |
| Backend | Next.js API Routes |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |

---

# Project Structure

```text
.
├── app/
├── components/
│   ├── layout/
│   ├── sections/
│   └── ui/
├── hooks/
├── lib/
├── prisma/
├── public/
├── assets/
├── package.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

---

# Getting Started

## Clone the repository

```bash
git clone https://github.com/subhamrout818/FOR1S.git

cd FOR1S
```

---

## Install dependencies

```bash
npm install
```

---

## Configure environment variables

Create a `.env` file.

```env
DATABASE_URL="your_postgresql_connection_string"
```

---

## Initialize Prisma

```bash
npx prisma migrate dev

npx prisma generate
```

---

## Start the development server

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

---
# Design Philosophy

FOR1S is built around one simple idea:

> We build the website, you win customers.

Every project follows these principles:

- Motion should guide attention, never distract.
- Design should solve problems before adding aesthetics.
- Performance is a feature, not an afterthought.
- Components should be reusable and scalable.
- Accessibility should be built in from the beginning.
- Every interaction should feel intentional.
- Simplicity creates better user experiences.

---

# Roadmap

Shipped:

- [x] Contact form backend + lead pipeline (`/api/contact`, `Lead` model, admin leads page)
- [x] Client inquiry system (admin leads + pipeline)
- [x] Case studies / portfolio (home "Work" section + `/work/[slug]`)
- [x] Blog & insights (`/blog` + `/blog/[slug]`)
- [x] SEO optimization (sitemap, robots, canonicals, OG image, noindexed workspaces)
- [x] Client portal (projects, deliverables, files, billing, support, tickets)
- [x] Admin workspace (clients, projects, deliverables, leads, payments, tickets, team)

Still planned:

- [ ] Production deployment
- [ ] Analytics integration
- [ ] Multi-language support
- [ ] Online payment gateway (portal "Pay" is simulated until wired)

---

# Preview

<table>

<tr>
<td colspan="2" align="center">

### Vision

<img src="assets/vision.png" alt="Vision">

</td>
</tr>

<tr>
<td width="50%">

### Services

<img src="assets/services.png" alt="Services">

</td>

<td width="50%">

### Process

<img src="assets/process.png" alt="Process">

</td>
</tr>

<tr>
<td>

### Pricing

<img src="assets/pricing.png" alt="Pricing">

</td>

<td>

### Team

<img src="assets/members-section.png" alt="Team">

</td>
</tr>

<tr>
<td>

### Get Started

<img src="assets/getstarted.png" alt="Get Started">

</td>

<td>

### FAQ

<img src="assets/faq.png" alt="FAQ">

</td>
</tr>

<tr>
<td colspan="2">

### Benefits

<img src="assets/benefits.png" alt="Benefits">

</td>
</tr>

</table>

---

# Live Demo

The app is deployed at **[for1s.digital](https://for1s.digital)** (or your configured `SITE_URL`). Local dev: `npm run dev`.

---

# Why FOR1S Exists

FOR1S was created with a simple mission:

To help businesses establish an online presence that feels as premium as the products and services they offer.

Too many websites are slow, outdated, difficult to navigate, or fail to leave a lasting impression. FOR1S focuses on solving that problem by combining modern design, meaningful motion, and scalable engineering into websites that are visually engaging, performant, and built with long-term maintainability in mind.

Whether it's a café, a salon, a photographer, a freelancer, or a growing local brand, every project is approached with the same attention to detail and commitment to quality.

This repository showcases the frontend architecture, reusable component system, animation library, and development standards that power FOR1S and will continue to evolve as new client projects are built.

---

# Future Vision

The long-term goal of FOR1S is to become a modern digital studio delivering exceptional websites and digital experiences for businesses around the world.

Future projects will expand beyond websites into interactive experiences, advanced frontend systems, custom dashboards, and full-stack web applications while maintaining the same focus on performance, usability, and thoughtful design.

---

# Contributing

Feedback, suggestions, and improvements are always welcome.

If you'd like to contribute, report a bug, or suggest a feature, feel free to open an issue or submit a pull request.

---

<div align="center">

## Built with ❤️ by **Subham Rout**

**Founder of FOR1S**

Full-Stack Developer • Motion Designer • Creative Developer

*"Crafting digital experiences that people remember."*

</div>
