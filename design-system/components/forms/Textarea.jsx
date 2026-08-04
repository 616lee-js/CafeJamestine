import React from "react";

export function Textarea({minHeight="5rem",invalid=false,disabled=false,style,...rest}){
  const [focus,setFocus]=React.useState(false);
  return <textarea disabled={disabled} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} style={{
    display:"flex",width:"100%",minHeight,boxSizing:"border-box",resize:"vertical",
    borderRadius:"var(--radius-md)",
    border:`1px solid ${invalid?"var(--destructive)":focus?"var(--ring)":"var(--input)"}`,
    background:"transparent",color:"var(--text-body)",
    padding:"var(--space-2) var(--space-3)",
    fontFamily:"var(--font-sans)",fontSize:"var(--text-sm)",lineHeight:"var(--leading-sm)",
    boxShadow:focus?"0 0 0 var(--ring-width) color-mix(in oklab,var(--ring) 50%,transparent)":"var(--shadow-xs)",
    outline:"none",transition:"var(--transition-colors)",opacity:disabled?0.5:1,...style}} {...rest} />;
}
