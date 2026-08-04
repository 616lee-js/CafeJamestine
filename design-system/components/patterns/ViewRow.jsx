import React from "react";

/* Read-only label/value pair. Renders nothing when empty — read views show filled fields only. */
export function ViewRow({label,value,style,...rest}){
  if(value==null||value==="") return null;
  return <div style={{display:"flex",flexDirection:"column",gap:"0.125rem",padding:"var(--space-1-5) 0",...style}} {...rest}>
    <span style={{fontSize:"var(--text-xs)",lineHeight:"var(--leading-xs)",textTransform:"uppercase",
      letterSpacing:"var(--tracking-wide)",color:"var(--text-muted)"}}>{label}</span>
    <span style={{whiteSpace:"pre-wrap",fontSize:"var(--text-sm)",color:"var(--text-body)"}}>{value}</span>
  </div>;
}
