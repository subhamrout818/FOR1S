export interface Member {
  slug: string;
  name: string;
  role: string;
  /** Photo path under /public. Omit until the photo is added. */
  image?: string;
  /** Optional biography provided for the member's profile page. */
  story?: string[];
}

export const MEMBERS: Member[] = [
  {
    slug: "subham-rout",
    name: "Subham Rout",
    role: "CEO",
    image: "/blurred.png",
    story: [
      "I'm Subham Rout, a developer and creative entrepreneur, and the founder of FOR1S. I started the studio with a clear belief: the best digital experiences happen when thoughtful engineering meets ambitious design.",
      "To me, a website should be more than a collection of pages. It should communicate a brand's character, make complex ideas feel effortless, and leave people with something worth remembering. At FOR1S, I'm bringing that belief to life through carefully crafted design, full-stack development, and motion-led experiences.",
      "I'm building FOR1S one project at a time, with a focus on curiosity, craft, and the conviction that the details make the difference.",
    ],
  },
  {
    slug: "tanuj-joshi",
    name: "Tanuj Joshi",
    role: "Co-Founder · Video Editor",
    image: "/tanuj.jpg",
  },
  {
    slug: "haze",
    name: "Haze",
    role: "Co-Founder",
    image: "/team/haze.svg",
  },
];
