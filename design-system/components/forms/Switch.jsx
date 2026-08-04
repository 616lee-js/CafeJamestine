import React from "react";

export function Switch({checked=false,size="default",disabled=false,onChange,style,...rest}){
  const w=size==="sm"?"1.5rem":"2rem", h=size==="sm"?"0.875rem":"1.15rem", t=size==="sm"?"0.75rem":"1rem";
  return <button type="button" role="switch" aria-checked={checked} disabled={disabled}
    onClick={()=>onChange&&onChange(!checked)}
    style={{display:"inline-flex",alignItems:"center",flexShrink:0,width:w,height:h,padding:0,
      border:"1px solid transparent",borderRadius:"var(--radius-full)",
      background:checked?"var(--primary)":"var(--input)",boxShadow:"var(--shadow-xs)",
      transition:"var(--transition-colors)",cursor:disabled?"not-allowed":"pointer",
      opacity:disabled?0.5:1,...style}} {...rest}>
    <span style={{display:"block",width:t,height:t,borderRadius:"var(--radius-full)",
      background:"var(--background)",transform:checked?`translateX(calc(${w} - ${t} - 2px))`:"translateX(0)",
      transition:`transform var(--duration-base) var(--ease-standard)`}} />
  </button>;
}
