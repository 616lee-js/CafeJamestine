/**
 * Persistent list beside a detail pane — the app's browsing layout on landscape.
 * The rail is sticky and scrolls independently; the detail pane caps at a readable measure.
 */
export interface SplitPaneProps {
  /** The rail content — grouped list, filters, a New button. */
  list: React.ReactNode;
  /** Width of the rail column. Defaults to var(--list-pane) = 20rem. */
  listWidth?: string;
  /** Force the stacked narrow-screen arrangement. */
  stacked?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export function SplitPane(props: SplitPaneProps): JSX.Element;
