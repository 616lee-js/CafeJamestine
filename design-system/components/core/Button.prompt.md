Café Jamestine's single action primitive — filled coffee by default, hairline-outline for choices, ghost for row toolbars.

```jsx
<Button size="hero"><Play size={20} />Start a session</Button>
<Button variant="outline" size="sm">Standards</Button>
<Button variant="ghost" size="sm" style={{color:"var(--destructive)"}}><Trash2 size={16} />Delete</Button>
```

- `size="hero"` is the landing CTA only (one per screen).
- `size="touch"` (2.75rem) for anything on a data-entry screen — the app raises controls to 44px there.
- `variant="outline"` doubles as the app's filter-chip: selected chips flip to `variant="default"`.
- `pill` is used only by the login/signup submit button.
