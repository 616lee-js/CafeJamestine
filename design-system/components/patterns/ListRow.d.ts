/**
 * Bordered tappable row — the backbone of every list in the app.
 */
export interface ListRowProps {
  title: React.ReactNode;
  /** Quiet secondary text on the same line — a date, or "V60 · standard". */
  meta?: React.ReactNode;
  /** Right-aligned element, almost always a Badge or a chevron icon. */
  trailing?: React.ReactNode;
  /** Left-aligned glyph, e.g. a honey star for favourites. */
  leading?: React.ReactNode;
  selected?: boolean;
  as?: "a" | "button" | "li" | "div";
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export function ListRow(props: ListRowProps): JSX.Element;
