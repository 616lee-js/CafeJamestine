/** Read-mode label/value. Returns null for empty values — never renders "—" or "N/A". */
export interface ViewRowProps { label: React.ReactNode; value?: React.ReactNode; style?: React.CSSProperties }
export function ViewRow(props: ViewRowProps): JSX.Element | null;
