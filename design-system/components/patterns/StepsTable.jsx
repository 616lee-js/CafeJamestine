import React from "react";

/* Read-mode brew steps. Brewed coffee → structured table; specialty → numbered prose list. */
export function StepsTable({steps=[],mode="brewed_coffee",style}){
  if(steps.length===0) return <p style={{margin:0,fontSize:"var(--text-sm)",color:"var(--text-muted)",...style}}>None.</p>;
  if(mode==="specialty_drink") return <ol style={{display:"flex",flexDirection:"column",gap:"var(--space-2)",margin:0,padding:0,listStyle:"none",...style}}>
    {steps.map((s,i)=><li key={i} style={{borderRadius:"var(--radius)",border:"1px solid var(--border)",
      padding:"var(--space-2) var(--space-3)",fontSize:"var(--text-sm)",color:"var(--text-body)"}}>
      <span style={{marginRight:"var(--space-2)",fontWeight:"var(--weight-medium)",color:"var(--text-muted)"}}>{i+1}.</span>{s.description}
    </li>)}
  </ol>;
  const th={padding:"var(--space-2) var(--space-3)",fontWeight:"var(--weight-medium)",textAlign:"left"};
  const td={padding:"var(--space-2) var(--space-3)",fontVariantNumeric:"tabular-nums"};
  return <div style={{overflowX:"auto",borderRadius:"var(--radius)",border:"1px solid var(--border)",...style}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:"var(--text-sm)"}}>
      <thead><tr style={{borderBottom:"1px solid var(--border)",fontSize:"var(--text-xs)",
        textTransform:"uppercase",letterSpacing:"var(--tracking-wide)",color:"var(--text-muted)"}}>
        <th style={th}>Time</th><th style={th}>Description</th><th style={th}>Total weight</th><th style={th}>Flow rate</th>
      </tr></thead>
      <tbody>{steps.map((s,i)=><tr key={i} style={{borderBottom:i===steps.length-1?"none":"1px solid var(--border)"}}>
        <td style={td}>{s.time||"—"}</td>
        <td style={{...td,fontVariantNumeric:"normal"}}>{s.description||"—"}</td>
        <td style={td}>{s.weight!=null?`${s.weight} g`:"—"}</td>
        <td style={td}>{s.flow!=null?`${s.flow} ml/s`:"—"}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}
