/** Fixed-list picker (method, roast level, measured-by). Always offers "— None —". */
export interface SelectOption { value: string; label: string }
export interface SelectProps {
  size?: "sm" | "md" | "touch";
  placeholder?: string;
  /** Supply `onChange` alongside for a controlled field; alone it seeds an uncontrolled one. */
  value?: string | null;
  options?: SelectOption[];
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  style?: React.CSSProperties;
}
export function Select(props: SelectProps): JSX.Element;
