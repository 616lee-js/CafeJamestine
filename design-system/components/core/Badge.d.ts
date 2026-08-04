/** Pill-shaped state marker. Three colour vocabularies, never mixed. */
export interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  /** Bag lifecycle / session state — indigo, lavender, mint, slate. */
  status?: "frozen" | "resting" | "active" | "finished" | "complete";
  /** Session workflow phase — the coffee-lifecycle ramp. Only the stepper uses these. */
  phase?: "plan" | "brew" | "postbrew" | "make" | "tasting";
  /** Leading dot in the current colour — used on bag statuses in list rails. */
  dot?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export function Badge(props: BadgeProps): JSX.Element;
