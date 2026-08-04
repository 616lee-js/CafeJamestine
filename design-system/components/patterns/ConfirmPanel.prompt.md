Appears in place of the trigger button. Cancel is ghost and comes first; the commit button is filled.

```jsx
<ConfirmPanel confirmLabel="Mark complete" confirmIcon={<Icon name="check" />}
  message="Mark complete? This snapshots days-rested + brew date and marks the workflow done. You can still edit it afterward." />
```

Copy always says what is snapshotted and that the record stays editable. Destructive confirms use a Dialog instead.
