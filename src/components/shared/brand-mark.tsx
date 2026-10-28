import Image from "next/image";

interface BrandMarkProps {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
}

export function BrandMark({
  compact = false,
  inverse = false,
  className = "",
}: BrandMarkProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="fexpo"
    >
      <Image
        src="/img/landing/Fexpo-logo.svg"
        alt=""
        width={26}
        height={36}
        priority
        className={inverse ? "brightness-0 invert" : undefined}
      />
      {!compact && (
        <span
          className={`text-lg font-extrabold tracking-tight ${
            inverse ? "text-white" : "text-[var(--expo-navy)]"
          }`}
        >
          fexpo
        </span>
      )}
    </span>
  );
}
