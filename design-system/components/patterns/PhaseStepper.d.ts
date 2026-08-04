/** The session workflow's spine: numbered phases coloured by the coffee-lifecycle ramp. */
export interface Phase { value: "plan" | "brew" | "postbrew" | "make" | "tasting"; label: React.ReactNode }
export interface PhaseStepperProps {
  phases?: Phase[];
  /** Currently shown phase. */
  value?: string;
  /** Phases already committed — get a filled pip with a check. */
  done?: string[];
  onChange?: (v: string) => void;
  style?: React.CSSProperties;
}
export function PhaseStepper(props: PhaseStepperProps): JSX.Element;
