/** Sonner-styled transient message. The app toasts failures only — never successes. */
export interface ToastProps {
  kind?: "error" | "success" | "info" | "loading";
  title: React.ReactNode;
  description?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Toast(props: ToastProps): JSX.Element;
