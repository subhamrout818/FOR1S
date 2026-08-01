export interface CaseStudy {
  id: string;
  index: string;
  client: string;
  industry: string;
  year: string;
  headline: string;
  challenge: string;
  solution: string;
  results: { value: string; label: string }[];
  services: string[];
  detail: {
    overview: string;
    sections: { heading: string; body: string[] }[];
  };
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "finflow",
    index: "01",
    client: "Finflow",
    industry: "Fintech SaaS",
    year: "2026",
    headline: "From napkin sketch to 1K users in 8 weeks.",
    challenge:
      "Finflow's founders had a sharp product thesis but no technical team. They'd interviewed three agencies and heard the same story — months of discovery, bloated scope, no launch date.",
    solution:
      "We compressed discovery into two weeks, locked a milestone-based build, and shipped a production-grade platform: auth, onboarding, dashboards, Stripe billing, and analytics. Weekly demo cycles kept the founders in the loop and the scope honest.",
    results: [
      { value: "8 wks", label: "to launch" },
      { value: "1K+", label: "users in month one" },
      { value: "0", label: "rewrites needed" },
    ],
    services: ["Strategy", "Product design", "Full-stack engineering", "Payments"],
    detail: {
      overview:
        "Finflow helps small teams get paid faster with automated invoicing and cash-flow analytics. When they came to us they had a product thesis and a waitlist — no code, no team.",
      sections: [
        {
          heading: "Finding the wedge",
          body: [
            "We started with two weeks of discovery: user interviews with the waitlist, a competitive teardown, and a ruthless prioritization session. The founders had ten features in mind; we cut the scope to a single job-to-be-done — get paid faster. Everything else went to the backlog to be revisited with real user data.",
          ],
        },
        {
          heading: "Design that earns trust",
          body: [
            "Fintech lives and dies on trust. We built a calm, bank-grade visual system — restrained color, clear hierarchy, and a laser focus on the numbers that matter. Every screen was designed around one decision, so users never felt lost in their own money.",
          ],
        },
        {
          heading: "Engineering for the first 100 days",
          body: [
            "A Next.js + Postgres + Stripe stack, with a staging environment live by day 14. Weekly demo cycles kept the founders watching real progress instead of reading status decks. By week six the core loop — connect bank, send invoice, track payment — was running end to end.",
          ],
        },
        {
          heading: "Launch and the first 1,000 users",
          body: [
            "We launched in week eight and hit 1,000 users in the first month. The architecture absorbed it without a single rewrite, and the analytics we built in gave the team a clear view of where users got stuck next.",
          ],
        },
      ],
    },
  },
  {
    id: "taskhive",
    index: "02",
    client: "TaskHive",
    industry: "Productivity SaaS",
    year: "2025",
    headline: "On time, on budget, zero redo.",
    challenge:
      "TaskHive had burned two budgets on agencies that delivered designs that couldn't be built. They needed a partner that owned the whole stack and shipped working software, not decks.",
    solution:
      "One team handled strategy, UI/UX, and engineering end to end. We built a component-driven design system, real-time collaboration over WebSockets, and a deployment pipeline that made daily releases boring.",
    results: [
      { value: "100%", label: "on-time milestones" },
      { value: "3.2s", label: "median load time" },
      { value: "14", label: "days to first deploy" },
    ],
    services: ["Product design", "Real-time engineering", "Infrastructure", "Post-launch sprints"],
    detail: {
      overview:
        "TaskHive is a real-time team task manager built to replace the status meeting with a living list. After two agencies failed to ship, they needed one team that could own the entire stack.",
      sections: [
        {
          heading: "Starting over, the right way",
          body: [
            "The previous agencies had delivered decks and designs that couldn't be built. We threw out the scope and rebuilt around a single principle: the list is the source of truth. Real-time sync, keyboard-first interactions, and zero features that didn't serve the daily flow.",
          ],
        },
        {
          heading: "Real-time without the headaches",
          body: [
            "Collaboration over WebSockets with optimistic updates — typing feels instant, even on flaky connections. The sync layer degrades gracefully: if a client drops, edits queue locally and reconcile when the connection returns.",
          ],
        },
        {
          heading: "A design system that ships",
          body: [
            "A component-driven system meant the marketing site, the app, and future features all shared the same DNA. Design tokens, primitives, and a small set of interaction patterns kept the product coherent as it grew.",
          ],
        },
        {
          heading: "Daily deploys, boring releases",
          body: [
            "By handover, deploying was a non-event. CI ran tests, preview environments spun up per pull request, and production shipped daily. The team stopped fearing releases and started shipping features.",
          ],
        },
      ],
    },
  },
  {
    id: "clouddesk",
    index: "03",
    client: "CloudDesk",
    industry: "Support Operations SaaS",
    year: "2025",
    headline: "Scaling to 50K users without a rewrite.",
    challenge:
      "CloudDesk's MVP was built on a tight deadline with shortcuts that were already creaking at 5K users. They needed to scale past 50K without starting over.",
    solution:
      "We refactored the data layer onto Postgres with read replicas, introduced caching and queue-based background jobs, and hardened observability. Uptime held at 99.9% through a 10× user surge.",
    results: [
      { value: "50K+", label: "users served" },
      { value: "99.9%", label: "uptime" },
      { value: "10×", label: "growth, no rewrite" },
    ],
    services: ["Architecture", "Performance tuning", "DevOps", "Reliability"],
    detail: {
      overview:
        "CloudDesk helps support teams triage and resolve tickets at scale. Their MVP was creaking at 5K users; they needed to reach 50K without a rewrite.",
      sections: [
        {
          heading: "Finding the bottlenecks",
          body: [
            "The first step was measurement. We profiled the data layer and found the MVP's shortcuts — N+1 queries, a single Postgres instance, and background jobs that blocked the request cycle. We mapped each bottleneck to a fix with an owner and a deadline.",
          ],
        },
        {
          heading: "A data layer that scales",
          body: [
            "Read replicas took the pressure off the primary. Caching kept hot queries in memory. Queue-based background jobs moved slow work out of the request path. Each change shipped behind a flag and was measured before the next.",
          ],
        },
        {
          heading: "Reliability as a feature",
          body: [
            "Observability went from 'we'd find out from users' to dashboards that caught problems before they were reported. Alerting, structured logs, and a runbook for every failure mode we knew about. Uptime held at 99.9% through the surge.",
          ],
        },
        {
          heading: "10× growth, zero rewrite",
          body: [
            "When usage jumped tenfold, the platform absorbed it. The refactor cost a fraction of a rewrite, and every improvement compounded — the team kept shipping new features on top of the hardened foundation for months after.",
          ],
        },
      ],
    },
  },
];
