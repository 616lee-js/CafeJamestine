import React from "react";
import { Icon } from "../core/Icon.jsx";

export function Select({size="md",placeholder="Select…",value,options=[],disabled=false,onChange,style,...rest}){
  const [focus,setFocus]=React.useState(false);
  const height=size==="sm"?"var(--control-sm)":size==="touch"?"var(--control-touch)":"var(--control-md)";
  const empty=value==null||value==="";
  return <div style={{position:"relative",width:"100%",...style}}>
    <select {...(onChange?{value:value??"",onChange}:{defaultValue:value??""})} disabled={disabled}
      onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
      style={{appearance:"none",height,width:"100%",boxSizing:"border-box",
        borderRadius:"var(--radius-md)",
        border:`1px solid ${focus?"var(--ring)":"var(--input)"}`,
        background:"transparent",color:empty?"var(--text-muted)":"var(--text-body)",
        padding:"0 2rem 0 var(--space-3)",fontFamily:"var(--font-sans)",fontSize:"var(--text-sm)",
        boxShadow:focus?"0 0 0 var(--ring-width) color-mix(in oklab,var(--ring) 50%,transparent)":"var(--shadow-xs)",
        outline:"none",transition:"var(--transition-colors)",
        opacity:disabled?0.5:1,cursor:disabled?"not-allowed":"pointer"}} {...rest}>
      <option value="">{placeholder}</option>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <span style={{position:"absolute",right:"var(--space-3)",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",opacity:0.5}}>
      <Icon name="chevron-down" size={16} />
    </span>
  </div>;
}
