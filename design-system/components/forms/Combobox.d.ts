/** Searchable reference picker with inline "Add “x”" create. Roasters, countries, units, coffees. */
export interface ComboboxOption { id: string; name: string }
export interface ComboboxProps {
  value?: string | null;
  valueName?: string | null;
  options?: ComboboxOption[];
  placeholder?: string;
  /** false for pickers that must not mint new rows (e.g. coffee picker). */
  allowCreate?: boolean;
  disabled?: boolean;
  onChange?: (id: string | null, name: string | null) => void;
  style?: React.CSSProperties;
}
export function Combobox(props: ComboboxProps): JSX.Element;
