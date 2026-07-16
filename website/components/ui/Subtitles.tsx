interface SubtitleProps {
  children: React.ReactNode;
}

export default function Subtitle({ children }: SubtitleProps) {
  return (
    <p
      className="
        mt-6
        max-w-2xl
        text-lg
        leading-relaxed
        text-zinc-400
      "
    >
      {children}
    </p>
  );
}