import React from "react";

/* One parameter, sized to be read from an eye-level mount or an angled stand at 1–2 feet. */
export function BrewParam({label,value,unit,style,...rest}){
  return <div style={{display:"flex",flexDirection:"column",gap:"var(--space-2)",
    borderRadius:"var(--radius-3xl)",border:"1px solid var(--border)",background:"var(--surface-card)",
    padding:"var(--space-5) var(--space-6)",...style}} {...rest}>
    <span style={{fontSize:"var(--brew-label)",lineHeight:1,fontWeight:"var(--weight-semibold)",
      textTransform:"uppercase",letterSpacing:"var(--tracking-wide)",color:"var(--text-muted)"}}>{label}</span>
    <span style={{display:"flex",alignItems:"baseline",gap:"var(--space-2)",
      fontFamily:"var(--font-display)",fontSize:"var(--brew-value)",lineHeight:1,
      fontWeight:"var(--weight-semibold)",letterSpacing:"var(--tracking-tight)",
      fontVariantNumeric:"tabular-nums",color:"var(--text-heading)"}}>
      {value}
      {unit?<span style={{fontSize:"var(--text-xl)",fontWeight:"var(--weight-medium)",
        color:"var(--text-muted)"}}>{unit}</span>:null}
    </span>
  </div>;
}
