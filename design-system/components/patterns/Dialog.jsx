import React from "react";

export function Dialog({open=true,title,description,footer,onClose,style,children}){
  if(!open) return null;
  return <div style={{position:"absolute",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",
    background:"var(--overlay)",padding:"var(--space-4)"}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{position:"relative",display:"grid",gap:"var(--space-4)",
      width:"100%",maxWidth:"32rem",borderRadius:"var(--radius)",border:"1px solid var(--border)",
      background:"var(--background)",padding:"var(--space-6)",boxShadow:"var(--shadow-lg)",
      fontFamily:"var(--font-sans)",...style}}>
      <div style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
        {title?<h2 style={{fontSize:"var(--text-lg)",lineHeight:1,fontWeight:"var(--weight-semibold)",color:"var(--text-heading)"}}>{title}</h2>:null}
        {description?<p style={{margin:0,fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>{description}</p>:null}
      </div>
      {children}
      {footer?<div style={{display:"flex",justifyContent:"flex-end",gap:"var(--space-2)"}}>{footer}</div>:null}
    </div>
  </div>;
}
