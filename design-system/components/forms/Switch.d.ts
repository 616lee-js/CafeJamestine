/** Boolean toggle. Commits immediately on change — no confirm step. */
export interface SwitchProps { checked?: boolean; size?: "sm" | "default"; disabled?: boolean; onChange?: (v: boolean) => void; style?: React.CSSProperties }
export function Switch(props: SwitchProps): JSX.Element;
