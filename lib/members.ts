export interface Member {
  slug: string;
  name: string;
  role: string;
  /** Photo path under /public. Omit until the photo is added. */
  image?: string;
  /** Life-story paragraphs shown on the member's profile page. */
  story?: string[];
}

export const MEMBERS: Member[] = [
  {
    slug: "subham-rout",
    name: "Subham Rout",
    role: "Founder & Frontend",
    image: "/blurred.png",
   story: [
  "I'm a student. I'm still learning code. Still learning design. Still learning business. Still making mistakes that someone with ten years of experience probably wouldn't make. But I've never really liked waiting until I was ready.",
  
  "I started editing because I wanted to create. I started coding because I wanted to build. I started FOR1S because I wanted to see what would happen if I took both seriously. There was no investor, no fancy office, no big team. Just a laptop, a lot of late nights, countless things that didn't work, and the stupid belief that I could eventually figure them out.",
  
  "That's what FOR1S is to me. Not just a web studio. It's proof that you don't need to have everything figured out before you start building something worth believing in. I'm still at the beginning. And honestly, that's the exciting part."
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
  {
    slug: "sidhi",
    name: "Sidhi",
    role: "Co-founder & Marketing",
    image: "/Sidhi.jpeg",
    // story: [ ... ], // add her bio when available
  },
];
