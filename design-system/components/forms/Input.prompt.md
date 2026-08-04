Text/number entry. Commits on blur, never on keystroke — the whole app autosaves that way.

```jsx
<Input size="touch" placeholder="e.g. 18" inputMode="decimal" />
<Input size="touch" prefix="$" placeholder="0.00" inputMode="decimal" />
```

- Measurements allow 1 decimal; money always 2; ratings clamp 1–10 in 0.5 steps.
- Times are masked `m:ss` inputs (`inputMode="numeric"`, digits fill from the right) — never a typed colon.
