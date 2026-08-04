The read half of the app's read-first/edit-explicit pattern. Laid out in a two-column grid with a 32px column gap.

```jsx
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",columnGap:"var(--space-8)"}}>
  <ViewRow label="Method" value="V60" />
  <ViewRow label="Dose (g)" value={18} />
</div>
```

Empty means absent: a null value removes the row entirely.
