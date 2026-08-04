import Image from "next/image";

// The mark: indigo cup, lavender steam. `reversed` is the white-cup variant for indigo or
// ink grounds. There is no wordmark glyph — the name is always typeset beside it.
export function Logo({
  size = 22,
  reversed = false,
  className,
}: {
  size?: number;
  reversed?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={reversed ? "/logo-reversed.svg" : "/logo.svg"}
      alt=""
      aria-hidden
      width={Math.round(size * 0.805)}
      height={size}
      className={className}
      priority
    />
  );
}

// Mark + name. Gap is roughly 0.4× the mark's width, per the brand guidance.
export function Lockup({
  size = 22,
  textClassName = "text-lg",
  reversed = false,
}: {
  size?: number;
  textClassName?: string;
  reversed?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <Logo size={size} reversed={reversed} />
      <span
        className={`font-display font-semibold tracking-snug ${
          reversed ? "text-white" : "text-heading"
        } ${textClassName}`}
      >
        Café Jamestine
      </span>
    </span>
  );
}
