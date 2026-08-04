/** Inline confirm for forward, non-destructive commitments (e.g. Mark complete). */
export interface ConfirmPanelProps {
  message: React.ReactNode;
  confirmLabel?: string;
  confirmIcon?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  style?: React.CSSProperties;
}
export function ConfirmPanel(props: ConfirmPanelProps): JSX.Element;
