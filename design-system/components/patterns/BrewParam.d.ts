/**
 * A single brew parameter at mount-reading scale (2.75rem value). Brew mode only.
 * Never use this scale in prep or reflection views.
 */
export interface BrewParamProps {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Rendered smaller and muted beside the value: "g", "°C", "ml/s". */
  unit?: React.ReactNode;
  style?: React.CSSProperties;
}
export function BrewParam(props: BrewParamProps): JSX.Element;
