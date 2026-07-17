type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        inline-flex
        items-center
        justify-center

        rounded-full

        bg-red-500
        text-white

        px-8
        py-4

        text-base
        font-medium

        transition-all
        duration-300
        ease-out

        hover:bg-red-400
        hover:scale-105

        active:scale-95
      "
    >
      {children}
    </button>
  );
}