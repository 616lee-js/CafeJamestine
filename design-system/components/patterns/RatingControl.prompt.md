Per-category tasting intensity, 1–5. Overall *enjoyment* is a separate 1–10 numeric Input, not this control.

```jsx
<RatingControl value={3} onChange={setAcidity} />
<RatingControl value={3} readOnly />
```

Read-only renders `3/5`, or an em dash when unset.
