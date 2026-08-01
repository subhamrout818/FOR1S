export interface Post {
  slug: string;
  index: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  readTime: string;
  author: string;
  body: string[];
}

export const POSTS: Post[] = [
  {
    slug: "launch-saas-mvp-in-six-weeks",
    index: "01",
    title: "How to launch a SaaS MVP in 6 weeks",
    excerpt:
      "Speed isn't about cutting corners — it's about cutting scope with precision. The milestone system we use to go from idea to production in weeks, not quarters.",
    date: "Jul 2026",
    tag: "Strategy",
    readTime: "6 min",
    author: "Subham Rout",
    body: [
      "Every founder we talk to wants the same thing: a product that exists, users who use it, and revenue that proves it. The reason most MVPs stall isn't a lack of effort — it's a lack of discipline about scope. When everything is a priority, nothing ships.",
      "We plan in milestones, not months. A milestone is a vertical slice of the product that a user can actually touch end to end: sign up, log in, do the core task, get value. Milestone one is the thinnest version of that slice that a real customer would pay for.",
      "This changes every conversation. Instead of debating features, we debate which slice to cut next. The question isn't 'can we build this?' — it's 'does this belong in milestone one?' If it doesn't, it goes on the backlog and gets revisited when real user data justifies it.",
      "The other half of the speed equation is the stack. We use boring, battle-tested technology that our team has shipped before. Novelty is a tax on velocity. Next.js, PostgreSQL, and a managed cloud let us deploy daily without a dedicated DevOps hire.",
      "Six weeks is not a magic number — it's what falls out when you remove meetings about meetings, redesigns of redesigns, and features nobody asked for. If you want to ship fast, don't build more, faster. Build less, on time.",
    ],
  },
  {
    slug: "motion-design-that-converts",
    index: "02",
    title: "Motion design that converts: 7 principles",
    excerpt:
      "Animation should guide attention, never distract. The principles we apply to every screen so motion earns its keep and lifts conversion.",
    date: "Jun 2026",
    tag: "Design",
    readTime: "5 min",
    author: "Subham Rout",
    body: [
      "Motion is the cheapest way to make a product feel premium — and the fastest way to make it feel cheap. The difference is intent. Decorative animation is noise; purposeful animation is a handrail that guides the user's attention to where it matters.",
      "First principle: motion should have a reason. If an element isn't drawing attention, explaining hierarchy, or rewarding an action, it shouldn't move. We ask 'what is this animation doing?' before we build it, and if the answer is vague, we cut it.",
      "Second: keep durations short. Users perceive 200–300ms as snappy and 600ms+ as slow. The exception is large, cinematic moments — hero reveals, page transitions — which can breathe a little more.",
      "Third: easing is the secret. Linear motion feels robotic; the same move with a gentle ease-out feels natural. We standardize on a small set of curated easings so the whole product moves like one organism, not a zoo.",
      "The remaining principles are about restraint: respect reduced-motion preferences, animate transforms and opacity (never layout properties), and let the content settle before the next animation starts. Motion that converts is motion users barely notice — until it's gone, and everything feels slower.",
    ],
  },
  {
    slug: "choosing-your-saas-stack",
    index: "03",
    title: "Choosing the right stack for your SaaS",
    excerpt:
      "Stack-agnostic but opinionated: what we actually recommend for a new product, and why the boring choices usually win.",
    date: "May 2026",
    tag: "Engineering",
    readTime: "7 min",
    author: "Subham Rout",
    body: [
      "We're often asked which stack we'd pick for a new SaaS. The honest answer is boring: the one your team already knows, on infrastructure you can operate on a bad day. A stack is a long-term commitment — the cost of switching is paid in momentum, not just money.",
      "For most products we recommend Next.js on the frontend and a typed backend, PostgreSQL as the source of truth, and a managed cloud platform. This combination is boring for a reason: it's the most documented, most hireable, and most boringly reliable set of choices in the industry.",
      "The exciting technologies — new databases, edge runtimes, bleeding-edge frameworks — solve problems most products don't have yet. They also come with sharp edges you'll discover at 2am during an incident. Innovate where it differentiates your product, not where it doesn't.",
      "There are two places worth being deliberate. One is your data model: spend the extra week on the schema, because bad schema design compounds into every future feature. Two is your billing: choose a payments provider early and build to its API contract, because retrofitting payments is the most expensive refactor there is.",
      "A stack isn't a religion. It's a bet that the tools you pick will be around, hireable, and capable in five years. Make that bet boring, and spend your excitement budget on the product.",
    ],
  },
  {
    slug: "first-hundred-days-after-launch",
    index: "04",
    title: "Post-launch: your first 100 days",
    excerpt:
      "Launch day isn't the finish line. The monitoring, iteration, and feature-sprint cadence that separates products that survive from products that stall.",
    date: "Apr 2026",
    tag: "Growth",
    readTime: "8 min",
    author: "Subham Rout",
    body: [
      "Most teams treat launch as the end of a race. The teams that win treat it as the start of a different one. The first 100 days after launch decide whether a product compounds or stalls — and the difference is usually process, not luck.",
      "Days 1–14 are about listening. You should be watching activation, session depth, and the moment users churn. A single honest conversation with a frustrated early user is worth more than a thousand dashboard lines. We schedule a weekly 'one real customer' call for the first month.",
      "Days 15–45 are about tightening the core. Fix the three worst friction points you found, even if they're 'small.' Small friction is the compound interest of churn. Ship weekly, measure the delta on activation, and keep a kill list of features that looked good in the backlog but have no user evidence behind them.",
      "Days 46–100 are about finding the wedge. Watch which users come back without being reminded, and double down on the job they hired your product for. One feature that a segment uses daily is worth more than a dozen that get tried once.",
      "The through-line is cadence: a heartbeat of deploy, measure, decide, repeat. Products don't die from lack of ideas — they die from a rhythm that can't absorb them.",
    ],
  },
];
