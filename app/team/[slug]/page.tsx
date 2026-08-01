import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MEMBERS } from "@/lib/members";
import MemberStory from "@/components/members/MemberStory";

export function generateStaticParams() {
  return MEMBERS.map((member) => ({ slug: member.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const member = MEMBERS.find((m) => m.slug === params.slug);
  return {
    title: member ? `${member.name} — FOR1S` : "Member — FOR1S",
    description: member ? `${member.role} at FOR1S.` : "FOR1S team member.",
    alternates: { canonical: `/team/${params.slug}` },
  };
}

export default function MemberPage({
  params,
}: {
  params: { slug: string };
}) {
  const member = MEMBERS.find((m) => m.slug === params.slug);
  if (!member) notFound();

  return <MemberStory member={member} />;
}
