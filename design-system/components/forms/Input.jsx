import React from "react";

export function Input({size="md",prefix,invalid=false,disabled=false,align,style,...rest}){
  const [focus,setFocus]=React.useState(false);
  const height=size==="sm"?"var(--control-sm)":size==="lg"?"var(--control-lg)":size==="touch"?"var(--control-touch)":"var(--control-md)";
  const control=<input disabled={disabled} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} style={{
    height,width:"100%",minWidth:0,boxSizing:"border-box",
    borderRadius:"var(--radius-md)",
    border:`1px solid ${invalid?"var(--destructive)":focus?"var(--ring)":"var(--input)"}`,
    background:"transparent",color:"var(--text-body)",
    padding:prefix?"0 var(--space-3) 0 1.75rem":"0 var(--space-3)",
    fontFamily:"var(--font-sans)",fontSize:"var(--text-sm)",
    boxShadow:focus?`0 0 0 var(--ring-width) color-mix(in oklab,var(--ring) 50%,transparent)`:"var(--shadow-xs)",
    outline:"none",transition:"var(--transition-colors)",
    opacity:disabled?0.5:1,cursor:disabled?"not-allowed":"text",
    textAlign:align,...style}} {...rest} />;
  if(!prefix) return control;
  return <div style={{position:"relative",width:"100%"}}>
    <span style={{position:"absolute",left:"var(--space-3)",top:"50%",transform:"translateY(-50%)",
      pointerEvents:"none",color:"var(--text-muted)",fontSize:"var(--text-sm)"}}>{prefix}</span>
    {control}
  </div>;
}
