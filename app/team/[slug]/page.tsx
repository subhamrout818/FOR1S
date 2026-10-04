import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MEMBERS } from "@/lib/members";
import MemberStory from "@/components/members/MemberStory";

export function generateStaticParams() {
  return MEMBERS.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = MEMBERS.find((m) => m.slug === slug);
  return {
    title: member ? `${member.name} — FOR1S` : "Member — FOR1S",
    description: member ? `${member.role} at FOR1S.` : "FOR1S team member.",
    alternates: { canonical: `/team/${slug}` },
  };
}

export default async function MemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = MEMBERS.find((m) => m.slug === slug);
  if (!member) notFound();

  return <MemberStory member={member} />;
}
