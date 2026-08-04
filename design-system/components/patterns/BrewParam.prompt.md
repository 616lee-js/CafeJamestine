Intentional addition — brew mode is read at 1–2 feet from a mount, which needs its own type scale.

```jsx
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"var(--space-4)"}}>
  <BrewParam label="Dose" value="18.0" unit="g" />
  <BrewParam label="Water" value="300" unit="g" />
  <BrewParam label="Temp" value="93" unit="°C" />
  <BrewParam label="Grind" value="4.2" />
</div>
```

No inputs in brew mode. Values are read-only; editing happens back in Plan.
