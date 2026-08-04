/** Centred modal on a 50% ink scrim. Reserved for destructive confirmation. */
export interface DialogProps {
  open?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export function Dialog(props: DialogProps): JSX.Element | null;
