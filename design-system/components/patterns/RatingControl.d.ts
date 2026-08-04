/** 1–5 prominence picker for tasting categories. Intensity, not enjoyment. */
export interface RatingControlProps { value?: number | null; readOnly?: boolean; max?: number; onChange?: (v: number | null) => void; style?: React.CSSProperties }
export function RatingControl(props: RatingControlProps): JSX.Element;
