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
    slug: "local-business-needs-website-not-just-instagram",
    index: "01",
    title: "Your local business needs a website — not just Instagram",
    excerpt:
      "Instagram is rented land; your website is your own. Why a site still matters for local businesses, even when your social pages are busy.",
    date: "Jul 2026",
    tag: "Strategy",
    readTime: "5 min",
    author: "Subham Rout",
    body: [
      "A question many small business owners ask is: 'My customers are on Instagram, why do I need a website?' It's a fair question, and the answer isn't 'because websites are cool' — it's about having a useful online destination you control.",
      "Social platforms can change their rules, reach, and features, and an account depends on a third-party service. A website gives your business a separate destination you control, although its domain, hosting, and software still need ongoing care.",
      "Some customers look for a website when comparing a business, while others rely on maps, reviews, social pages, or recommendations. A clear site can answer practical questions and make it easier to decide whether to visit or get in touch.",
      "Your site doesn't need to be complicated. Hours, menu, location, contact details, a booking link, and a way to call can cover many common needs. Social media can help people discover you; a useful website gives them another place to check details and take the next step.",
      "A website can make key information available outside business hours, but it isn't a set-and-forget sales machine. Keep details accurate, check forms and links, maintain the software, and review performance to see what is actually helping.",
    ],
  },
  {
    slug: "how-much-does-a-website-cost",
    index: "02",
    title: "How much does a website cost? A plain-English guide",
    excerpt:
      "The honest range for personal, business, and custom websites in 2026 — and what actually drives the price up or down.",
    date: "Jun 2026",
    tag: "Pricing",
    readTime: "6 min",
    author: "Subham Rout",
    body: [
      "'How much does a website cost?' is the question every business owner asks, and the honest answer is: it depends — but you deserve a real range, not a sales pitch.",
      "For a personal website — a portfolio, a freelancer's page, a creator's home base — expect roughly $700 to $1,500. One to three pages, custom design, a contact form, mobile-friendly, launched in about a week.",
      "For a business website — a café, salon, clinic, or shop with several pages, booking or contact options, and SEO foundations — a custom build can cost roughly $1,900 to $4,500 in this illustrative pricing range. The right quote depends on the market, scope, content, integrations, and ongoing support.",
      "For custom builds — online stores, booking systems, brand identity work, or video — prices start around $4,500 and can go much higher. These aren't 'more expensive websites'; they're genuinely bigger projects with more moving parts.",
      "What actually drives the price? Page count, custom features (booking, payments, membership), whether you need copywriting or brand design, and how much care you want after launch. Templates are cheaper because they're reused; custom design costs more because it's built for you alone.",
      "Two things worth asking any designer before you commit: what's included (domain, hosting, setup, revisions), and what happens after launch. A low upfront price that disappears after launch is the most expensive option in the long run.",
    ],
  },
  {
    slug: "get-found-on-google-local-business",
    index: "03",
    title: "How to get found on Google as a local business",
    excerpt:
      "SEO isn't magic and it isn't a paid service you can only get from an agency. The basics that actually move the needle for local businesses.",
    date: "May 2026",
    tag: "SEO",
    readTime: "6 min",
    author: "Subham Rout",
    body: [
      "When someone near you searches 'best coffee near me' or 'salon open Sunday', Google shows a short list. Being on that list is the difference between a steady stream of new customers and being invisible. The good news: for local businesses, the fundamentals are simple and honest.",
      "First, the free stuff that matters most: a Google Business Profile. Claim it, keep your hours and address accurate, add real photos, and respond to reviews. A complete, accurate profile helps customers find key details and may improve your visibility in relevant local searches; results depend on your market and competitors.",
      "Second, your website needs to say what you do and where you are — clearly. A page that says 'We're a family bakery in Westport, open 7am daily, here's our menu' tells Google exactly who you are and who to show you to. Vague, generic homepage copy does the opposite.",
      "Third, speed and mobile. Most local searches happen on a phone, often on a patchy connection. Slow pages and difficult mobile interactions can frustrate visitors. Performance and usability matter, but search rankings depend on many factors, so avoid treating any single metric as a guarantee.",
      "Fourth, real reviews and real content. Encourage happy customers to leave reviews (a QR code at the counter works wonders), and update your site as your menu or services change. Accurate, useful information helps customers and search engines understand your business; reviews and content are only part of local visibility.",
      "You don't need to become an SEO expert to start. Keep your business profile accurate, make your site useful and accessible, and monitor how people find you. These are sensible foundations, not a guarantee of outranking competitors.",
    ],
  },
  {
    slug: "how-long-does-it-take-to-build-a-website",
    index: "04",
    title: "How long does it really take to build a website?",
    excerpt:
      "A realistic week-by-week breakdown for personal, business, and custom sites — and what you can do to keep your project on schedule.",
    date: "Apr 2026",
    tag: "Process",
    readTime: "5 min",
    author: "Subham Rout",
    body: [
      "The most common question after 'how much' is 'how long'. Here's the honest breakdown, and it's probably faster than you fear.",
      "A small personal website may fit into a one-week build window when the scope is clear and content is ready. The timeline can change with design revisions, integrations, accessibility needs, and feedback.",
      "A focused business website may take two to three weeks when scope and content are agreed early. Booking integrations, custom functionality, delayed feedback, and content production can extend the schedule; the timeline should be confirmed in the proposal.",
      "Custom builds — online stores, booking systems, or complex integrations — can take four to eight weeks or more. The timeline depends on requirements, third-party services, content, testing, and review cycles.",
      "What slows projects down? Almost always the same three things: waiting on photos and content, late changes to the scope ('let's add a booking system' in week three), and slow feedback on design revisions. The fastest clients send their material early and answer one or two questions per week.",
      "A good designer keeps you moving: clear deadlines, a small number of decisions per week, and a launch date that's real. If a quote can't give you a rough timeline, that's a red flag.",
    ],
  },
];
