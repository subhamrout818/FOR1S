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
      "Almost every small business owner we talk to has the same instinct: 'My customers are on Instagram, why do I need a website?' It's a fair question, and the answer isn't 'because websites are cool' — it's about ownership.",
      "Instagram is rented land. The algorithm decides who sees you, the platform can change its rules overnight, and a page is one shadow-ban away from vanishing. Your website is the one address you fully own — every visitor, every click, every search result is yours, not a favor from an algorithm.",
      "And here's what most owners don't realize: customers still check for a website before they trust a business. When someone hears about your café, the first thing they do is Google your name. If the top result is an unfinished social page or nothing at all, they quietly move to the next option. A website is the handshake that happens before the visit.",
      "Your site doesn't need to be complicated. Hours, menu, location, contact, a booking link, and a way to call you — that's most of what a local business needs to convert a search into a customer. Instagram sends the excitement; the website closes the trust.",
      "Best of all, a website works 24/7 with no content calendar. It doesn't need daily posts to stay visible. Set it up once, keep it fresh, and it keeps earning while you run your business.",
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
      "For a personal website — a portfolio, a freelancer's page, a creator's home base — expect roughly $500 to $1,500. One to three pages, custom design, a contact form, mobile-friendly, launched in about a week.",
      "For a business website — a café, salon, clinic, or shop with several pages, booking or contact options, and SEO that gets you found on Google — the realistic range is $1,900 to $4,500. This is the sweet spot for most local businesses, and where most of our work sits.",
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
      "First, the free stuff that matters most: a Google Business Profile. Claim it, keep your hours and address accurate, add real photos, and respond to reviews. This single step does more for local visibility than most paid campaigns.",
      "Second, your website needs to say what you do and where you are — clearly. A page that says 'We're a family bakery in Westport, open 7am daily, here's our menu' tells Google exactly who you are and who to show you to. Vague, generic homepage copy does the opposite.",
      "Third, speed and mobile. Most local searches happen on a phone, often on a patchy connection. If your site takes five seconds to load or buttons are too small to tap, visitors leave — and so does your search ranking. Fast, mobile-first isn't a luxury; it's a requirement.",
      "Fourth, real reviews and real content. Encourage happy customers to leave reviews (a QR code at the counter works wonders), and update your site as your menu or services change. Fresh, accurate information is the signal Google trusts most.",
      "You don't need to become an SEO expert. Nail the profile, the basics on your site, and speed, and you'll be ahead of most local competitors already.",
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
      "A personal website — portfolio or freelancer page — typically launches in about a week. One to three pages, a clear design, a contact form. The bottleneck is rarely the build; it's gathering your photos and copy.",
      "A business website — several pages, booking or contact, SEO, custom design — usually takes two to three weeks. That includes a discovery call, design you get to review, revisions, and the final build. You see progress throughout; there's no two-week silence followed by a surprise.",
      "Custom builds — online stores, booking systems, brand work — take four to eight weeks or more, depending on how many moving parts you're adding. These aren't slower; they're bigger.",
      "What slows projects down? Almost always the same three things: waiting on photos and content, late changes to the scope ('let's add a booking system' in week three), and slow feedback on design revisions. The fastest clients send their material early and answer one or two questions per week.",
      "A good designer keeps you moving: clear deadlines, a small number of decisions per week, and a launch date that's real. If a quote can't give you a rough timeline, that's a red flag.",
    ],
  },
];
