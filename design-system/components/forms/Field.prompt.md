Wraps any control with its label and a quiet hint. Forms are two-column grids of these (`sm:grid-cols-2`, 20px gap).

```jsx
<Field label="Overall enjoyment (1–10)" hint="1–10, 0.5 steps">
  <Input size="touch" inputMode="decimal" placeholder="e.g. 8.5" style={{width:"7rem"}} />
</Field>
```

Hints state the format or the rule, never encouragement.
