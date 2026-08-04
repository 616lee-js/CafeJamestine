/**
 * Read-mode brew steps — table for brewed coffee, numbered list for specialty drinks.
 */
export interface Step { time?: string; description?: string; weight?: number | null; flow?: number | null }
export interface StepsTableProps { steps?: Step[]; mode?: "brewed_coffee" | "specialty_drink"; style?: React.CSSProperties }
export function StepsTable(props: StepsTableProps): JSX.Element;
