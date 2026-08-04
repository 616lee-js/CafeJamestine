Destructive-only. Title is the question, ending in "?"; the confirm button is `variant="destructive"` and labelled with the verb.

```jsx
<Dialog title="Delete coffee “Ethiopia Guji”?"
  footer={<><Button variant="ghost">Cancel</Button><Button variant="destructive">Delete</Button></>} />
```

Enters with fade + 95%→100% zoom over 200ms. Nothing else in the system zooms.
