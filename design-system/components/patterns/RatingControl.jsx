import React from "react";
import { Button } from "../core/Button.jsx";

/* 1–5 prominence picker. Selected number flips to the filled variant; clicking it again clears. */
export function RatingControl({value=null,readOnly=false,max=5,onChange,style}){
  if(readOnly) return <span style={{fontSize:"var(--text-sm)",color:"var(--text-muted)",...style}}>{value!=null?`${value}/${max}`:"—"}</span>;
  return <div style={{display:"flex",gap:"var(--space-1)",...style}}>
    {Array.from({length:max},(_,i)=>i+1).map(n=>
      <Button key={n} size="icon-sm" variant={value===n?"default":"outline"}
        onClick={()=>onChange&&onChange(value===n?null:n)}>{n}</Button>)}
  </div>;
}
