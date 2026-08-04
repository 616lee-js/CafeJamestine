import React from "react";
import { Icon } from "./Icon.jsx";

const KIND = {
  error:{color:"var(--destructive)",glyph:"octagon-x"},
  success:{color:"var(--success)",glyph:"circle-check"},
  info:{color:"var(--text-muted)",glyph:"info"},
  loading:{color:"var(--text-muted)",glyph:"loader-2"},
};

export function Toast({kind="error",title,description,style,...rest}){
  const k=KIND[kind];
  return <div role="status" style={{display:"flex",alignItems:"flex-start",gap:"var(--space-3)",
    width:"22rem",maxWidth:"100%",borderRadius:"var(--radius)",border:"1px solid var(--border)",
    background:"var(--popover)",color:"var(--popover-foreground)",padding:"var(--space-4)",
    boxShadow:"var(--shadow-lg)",fontFamily:"var(--font-sans)",fontSize:"var(--text-sm)",...style}} {...rest}>
    <span style={{marginTop:"1px"}}><Icon name={k.glyph} size={16} color={k.color} /></span>
    <div style={{display:"flex",flexDirection:"column",gap:"var(--space-1)"}}>
      <span style={{fontWeight:"var(--weight-medium)"}}>{title}</span>
      {description?<span style={{color:"var(--text-muted)"}}>{description}</span>:null}
    </div>
  </div>;
}
