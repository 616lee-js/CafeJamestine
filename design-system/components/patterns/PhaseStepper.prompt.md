Sits directly beneath the global top bar. Committing a phase advances you; the labels also work as tabs.

```jsx
<PhaseStepper value="brew" done={["plan"]} onChange={setPhase} phases={[
  {value:"plan",label:"Plan"},
  {value:"brew",label:"Brew"},
  {value:"postbrew",label:"Post-brew"},
  {value:"tasting",label:"Tasting"},
]} />
```

Brewed coffee: Plan · Brew · Post-brew · Tasting. Specialty drink: Plan · Make · Tasting (stages 1 · 2 · 4).
Each phase owns one stage of the ramp, so position is readable without reading the labels.
