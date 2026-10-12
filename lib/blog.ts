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
    title: "How much does a website cost in India? A plain-English guide",
    excerpt:
      "Indicative FOR1S price ranges for personal, small-business, and custom websites in India — plus what drives the final quote.",
    date: "Oct 2026",
    tag: "Pricing",
    readTime: "6 min",
    author: "Subham Rout",
    body: [
      "'How much does a website cost?' depends on scope, content, integrations, and support. These are FOR1S's indicative starting ranges for India-based projects, not a universal market survey or a fixed quote.",
      "For a personal website — a portfolio, freelancer page, or personal brand — our current indicative range is ₹12,000–₹18,000 for a focused 1–3 page build with responsive layouts and a contact form.",
      "For a small-business website — such as a café, salon, clinic, or shop — our indicative range is ₹18,000–₹25,000 for a scoped multi-page site with contact/location information and SEO fundamentals. Booking or ordering integrations may cost extra.",
      "Custom builds start around ₹25,000 and are quoted after discovery. E-commerce, online payments, account systems, complex booking/order flows, brand identity, and photo/video production can change the cost substantially.",
      "What drives the price? Page count, custom features, content preparation, integrations, accessibility needs, testing, and ongoing support. A clear scope makes quotes easier to compare; don't compare prices without comparing deliverables.",
      "Before committing, ask what's included, how many revision rounds you get, who pays for domain/hosting and other third-party services, and what maintenance covers. FOR1S includes three months of defined post-launch maintenance in its packages; exact coverage is written into the proposal. Domain, hosting, paid tools, and third-party fees are separate unless the proposal says otherwise.",
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
      "Second, your website needs to say what you do and where you are — clearly. For example, clear copy such as 'a bakery in Chandrasekharpur, Bhubaneswar, open from 7 AM' tells visitors where the business is and what to expect. Use only accurate opening hours, location, and service information.",
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
