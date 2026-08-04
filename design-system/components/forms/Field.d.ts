/** Label + control + optional hint. The unit every edit form is built from. */
export interface FieldProps { label?: React.ReactNode; hint?: React.ReactNode; style?: React.CSSProperties; children?: React.ReactNode }
export function Field(props: FieldProps): JSX.Element;
