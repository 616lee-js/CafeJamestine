/** Lucide glyph wrapper. INTENTIONAL ADDITION — the app imports lucide-react directly. */
export interface IconProps {
  /** kebab-case Lucide name: "play", "arrow-right", "coffee", "glass-water", "star". */
  name: string;
  /** 16 inside sm controls, 14 for m:ss row buttons, 20 for the hero CTA, 28 for type pickers. */
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}
export function Icon(props: IconProps): JSX.Element;
