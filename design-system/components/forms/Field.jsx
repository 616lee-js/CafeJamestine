import React from "react";
import { Label } from "./Label.jsx";

export function Field({label,hint,children,style,...rest}){
  return <div style={{display:"flex",flexDirection:"column",gap:"var(--space-1-5)",...style}} {...rest}>
    {label?<Label>{label}</Label>:null}
    {children}
    {hint?<p style={{margin:0,fontSize:"var(--text-xs)",lineHeight:"var(--leading-xs)",color:"var(--text-muted)"}}>{hint}</p>:null}
  </div>;
}
