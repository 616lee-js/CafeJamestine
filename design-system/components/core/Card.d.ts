/** Bordered, barely-shadowed container. 14px radius, 24px padding, 24px internal gap. */
export interface CardProps { style?: React.CSSProperties; children?: React.ReactNode }
export interface CardHeaderProps extends CardProps { title?: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode }
export function Card(props: CardProps): JSX.Element;
export function CardHeader(props: CardHeaderProps): JSX.Element;
export function CardContent(props: CardProps): JSX.Element;
export function CardFooter(props: CardProps): JSX.Element;
