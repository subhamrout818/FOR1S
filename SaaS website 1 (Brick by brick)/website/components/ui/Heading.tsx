interface HeadingProps {
  children: React.ReactNode;
}

export default function Heading({ children }: HeadingProps) {
  return (
    <h1
      className="
        text-5xl
        md:text-7xl
        font-semibold
        tracking-tight
        leading-none
        text-white
      "
    >
      {children}
    </h1>
  );
}