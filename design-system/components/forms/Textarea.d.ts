/** Multi-line notes field. Grows with content; commits on blur. */
export interface TextareaProps {
  /** "2.5rem" for compact in-row descriptions, "5rem" for notes fields. */
  minHeight?: string;
  invalid?: boolean; disabled?: boolean; placeholder?: string;
  value?: string; defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void; style?: React.CSSProperties;
}
export function Textarea(props: TextareaProps): JSX.Element;
