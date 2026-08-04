/**
 * The app's only action element — every affordance is a Button variant.
 */
export interface ButtonProps {
  /** default = filled coffee. outline for secondary picks/filters, ghost for toolbar actions. */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /** hero = the 3.5rem "Start a session" CTA. touch = 2.75rem, for data-entry screens. */
  size?: "xs" | "sm" | "default" | "lg" | "hero" | "touch" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  disabled?: boolean;
  /** Fully rounded — reserved for the auth screens' primary submit. */
  pill?: boolean;
  fullWidth?: boolean;
  /** Render as "a" for navigation that looks like a button. */
  as?: "button" | "a";
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  type?: "button" | "submit";
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export function Button(props: ButtonProps): JSX.Element;
