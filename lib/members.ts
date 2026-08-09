export interface Member {
  slug: string;
  name: string;
  role: string;
  image: string;
  /** Life-story paragraphs shown on the member's profile page. */
  story: string[];
}

export const MEMBERS: Member[] = [
  {
    slug: "subham-rout",
    name: "Subham Rout",
    role: "Founder & Frontend",
    image: "/subham.jpg",
    story: [
      "I never planned to end up here — not that I'm complaining. It started in a small room with a borrowed laptop and a stubborn belief that a good website could change how a business is seen. My first build was for a family friend; watching them light up when it went live is still the feeling I chase.",
      "That first project pulled me in further than I expected. I taught myself design because the templates weren't good enough, then motion because static pages felt flat, then the engineering behind it all because I wanted what I built to actually ship. None of it came from a course — every skill arrived because a project demanded it.",
      "FOR1S is the honest result of that path: a studio that treats every website like it's the first one. Same hunger, same care, same obsession with the details other people skip. I still build things by hand at 2am sometimes — the things that make all of this worth it.",
    ],
  },
  {
    slug: "tanuj-joshi",
    name: "Tanuj Joshi",
    role: "Marketing",
    image: "/tanuj.jpg",
    story: [
      "I've always been the person who noticed how businesses present themselves — the sign that's crooked, the menu that's hard to read, the website that makes a great café look forgettable. Most small businesses have one thing working against them: they're busy running the business, so nobody tells their story online.",
      "That's where I fit at FOR1S. I listen to what makes each business special and make sure that's exactly what a visitor sees first. The right words, the right message, the right moment to ask for the booking — marketing isn't noise, it's clarity.",
      "The best part of this work is the phone call a week after launch: 'We got three new bookings from the site today.' That's the whole job, and it's worth every late night writing copy until it's right.",
    ],
  },
];
