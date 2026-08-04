/** Single-line text/number input. Hairline border, 3px focus ring, no fill. */
export interface InputProps {
  /** touch = 2.75rem, the height every real data-entry field uses. */
  size?: "sm" | "md" | "lg" | "touch";
  /** Static leading glyph or symbol, e.g. "$" for money fields. */
  prefix?: React.ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  align?: "left" | "right" | "center";
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  inputMode?: "text" | "decimal" | "numeric";
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  style?: React.CSSProperties;
}
export function Input(props: InputProps): JSX.Element;
