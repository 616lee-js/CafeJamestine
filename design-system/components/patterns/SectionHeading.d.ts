/** Heading row with an optional right-aligned action. Four fixed levels. */
export interface SectionHeadingProps {
  /** hero = landing 30px, page = view title 24px, section = 18px, eyebrow = 12px uppercase. */
  level?: "hero" | "page" | "section" | "eyebrow";
  action?: React.ReactNode;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export function SectionHeading(props: SectionHeadingProps): JSX.Element;
