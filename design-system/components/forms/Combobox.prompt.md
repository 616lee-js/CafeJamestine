Open-ended reference lists — the user's own roasters, producers, varietals, units. Selecting shows an X to clear.

```jsx
<Combobox placeholder="Select…" options={roasters} onChange={(id,name)=>…} />
<Combobox placeholder="Select coffee…" allowCreate={false} options={coffees} />
```

Search field copy is always "Search or type to add…"; the create row is `Add “{query}”` with curly quotes.
