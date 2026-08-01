import { cn } from "@/lib/utils";
import { DEFAULT_AVATAR } from "@/lib/avatars";

/**
 * Profile image. Falls back to the shared default avatar when the user
 * hasn't set a custom one (uploaded, captured, or a preset pick).
 */
export default function Avatar({
  src,
  size = 40,
  className,
}: {
  src?: string | null;
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || DEFAULT_AVATAR}
      alt="Profile"
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}
