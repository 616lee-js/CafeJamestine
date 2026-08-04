import React from "react";
import { Button } from "../core/Button.jsx";

/* Inline commitment gate — the app confirms consequential actions in place, not in a modal,
   when the action is a forward step (Mark complete). Modals are for destructive actions. */
export function ConfirmPanel({message,confirmLabel="Confirm",confirmIcon,onConfirm,onCancel,style}){
  return <div style={{display:"flex",flexDirection:"column",gap:"var(--space-3)",
    borderRadius:"var(--radius)",border:"1px solid var(--border)",padding:"var(--space-4)",...style}}>
    <p style={{margin:0,fontSize:"var(--text-sm)",color:"var(--text-body)"}}>{message}</p>
    <div style={{display:"flex",gap:"var(--space-2)"}}>
      <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirm}>{confirmIcon}{confirmLabel}</Button>
    </div>
  </div>;
}
