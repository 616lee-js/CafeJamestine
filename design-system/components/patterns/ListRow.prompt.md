Every list in Café Jamestine is a stack of these, 8px apart, inside a plain `<ul>`. No cards, no shadows, no dividers.

```jsx
<ListRow title="Ethiopia Guji" meta="3/14/2026" trailing={<Badge status="active">active</Badge>} href="/sessions/1" />
<ListRow title="Coffees" trailing={<Icon name="arrow-right" />} />
```

Hover is a flat `var(--accent)` wash — no lift, no border colour change.
