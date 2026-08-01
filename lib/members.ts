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
      "FOR1S is the honest result of that path: a studio that treats every product like it's the first one. Same hunger, same care, same obsession with the details other people skip. I still build things by hand at 2am sometimes — the things that make all of this worth it.",
      "This page is a placeholder I'll keep editing as the story keeps going. Thanks for reading this far.",
    ],
  },
  {
    slug: "tanuj-joshi",
    name: "Tanuj Joshi",
    role: "Marketing",
    image: "/tanuj.jpg",
    story: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    ],
  },
];
