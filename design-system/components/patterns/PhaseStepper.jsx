import React from "react";

const RAMP = {
  plan:{c:"var(--phase-plan)",soft:"var(--phase-plan-soft)"},
  brew:{c:"var(--phase-brew)",soft:"var(--phase-brew-soft)"},
  make:{c:"var(--phase-brew)",soft:"var(--phase-brew-soft)"},
  postbrew:{c:"var(--phase-post)",soft:"var(--phase-post-soft)"},
  tasting:{c:"var(--phase-taste)",soft:"var(--phase-taste-soft)"},
};

/* Session workflow spine. Phase labels double as tabs; the ramp shows progress at a glance. */
export function PhaseStepper({phases=[],value,done=[],onChange,style,...rest}){
  return <nav style={{display:"flex",alignItems:"center",flexWrap:"wrap",
    minHeight:"var(--subbar-height)",borderBottom:"1px solid var(--border)",...style}} {...rest}>
    {phases.map((p,i)=>{
      const ramp=RAMP[p.value]||RAMP.plan;
      const prev=i?(RAMP[phases[i-1].value]||ramp):ramp;
      return <React.Fragment key={p.value}>
        {i?<span aria-hidden="true" style={{width:"var(--space-8)",height:2,flexShrink:0,opacity:0.55,
          background:"linear-gradient(90deg,"+prev.c+","+ramp.c+")"}} />:null}
        <Tab tab={p} ramp={ramp} active={p.value===value} complete={done.includes(p.value)} index={i}
          onClick={()=>onChange&&onChange(p.value)} />
      </React.Fragment>;
    })}
  </nav>;
}

function Tab({tab,ramp,active,complete,index,onClick}){
  const [h,setH]=React.useState(false);
  return <button type="button" onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    aria-current={active?"step":undefined}
    style={{display:"inline-flex",alignItems:"center",gap:"var(--space-2)",marginBottom:-1,
      border:"none",borderBottom:"3px solid "+(active?ramp.c:"transparent"),background:"transparent",
      padding:"var(--space-3) var(--space-4)",fontFamily:"var(--font-sans)",
      fontSize:"var(--text-base)",fontWeight:active?"var(--weight-semibold)":"var(--weight-medium)",
      color:active||h?"var(--text-heading)":"var(--text-muted)",cursor:"pointer",
      transition:"var(--transition-colors)"}}>
    <span style={{display:"flex",alignItems:"center",justifyContent:"center",width:"1.5rem",height:"1.5rem",
      flexShrink:0,borderRadius:"var(--radius-full)",border:"2px solid "+ramp.c,
      background:active||complete?ramp.c:"transparent",color:active||complete?"#fff":ramp.c,
      fontSize:"var(--text-xs)",fontWeight:"var(--weight-semibold)",fontVariantNumeric:"tabular-nums"}}>
      {complete&&!active?"\u2713":index+1}
    </span>
    {tab.label}
  </button>;
}
