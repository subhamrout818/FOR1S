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
  },
  {
    slug: "tanuj-joshi",
    name: "Tanuj Joshi",
    role: "Video Editor",
    image: "/tanuj.jpg",
  },
  {
    slug: "sidhi",
    name: "Sidhi Samantaray",
    role: "Video Editor",
    image: "/Sidhi.jpeg",
  },
];
