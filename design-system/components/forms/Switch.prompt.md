The only translating animation in the system (thumb slide, 150ms).

```jsx
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--space-4)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"var(--space-3)"}}>
  <Label>Iced</Label><Switch checked={iced} onChange={setIced} />
</div>
```

Standalone booleans are wrapped in a bordered row with the label pushed left — see `SwitchRow` usage above.
