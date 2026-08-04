import React from "react";

const VARIANTS = {
  default:{background:"var(--primary)",color:"var(--primary-foreground)"},
  secondary:{background:"var(--secondary)",color:"var(--secondary-foreground)"},
  destructive:{background:"var(--destructive)",color:"#fff"},
  outline:{background:"transparent",color:"var(--text-body)",borderColor:"var(--border)"},
  ghost:{background:"transparent",color:"var(--text-muted)"},
};
/* Bag + session state. Indigo/lavender/mint family — never the coffee ramp. */
const STATUS = {
  frozen:{background:"var(--bag-frozen-soft)",color:"var(--bag-frozen)"},
  resting:{background:"var(--bag-resting-soft)",color:"var(--bag-resting)"},
  active:{background:"var(--bag-active-soft)",color:"var(--bag-active)"},
  finished:{background:"var(--bag-finished-soft)",color:"var(--bag-finished)"},
  complete:{background:"var(--session-complete-soft)",color:"var(--session-complete)"},
};
/* Session workflow phases — the coffee-lifecycle ramp, used only here. */
const PHASE = {
  plan:{background:"var(--phase-plan-soft)",color:"var(--phase-plan)"},
  brew:{background:"var(--phase-brew-soft)",color:"var(--phase-brew)"},
  make:{background:"var(--phase-brew-soft)",color:"var(--phase-brew)"},
  postbrew:{background:"var(--phase-post-soft)",color:"var(--phase-post)"},
  tasting:{background:"var(--phase-taste-soft)",color:"var(--phase-taste)"},
};

export function Badge({variant="default",status,phase,dot=false,style,children,...rest}){
  const tone = phase?PHASE[phase]:status?STATUS[status]:VARIANTS[variant];
  return <span style={{
    display:"inline-flex",width:"fit-content",flexShrink:0,alignItems:"center",justifyContent:"center",
    gap:"var(--space-1-5)",borderRadius:"var(--radius-full)",
    border:"1px solid transparent",padding:"0.1875rem 0.625rem",
    fontFamily:"var(--font-sans)",fontSize:"var(--text-xs)",lineHeight:"var(--leading-xs)",
    fontWeight:"var(--weight-medium)",whiteSpace:"nowrap",...tone,...style,
  }} {...rest}>
    {dot?<span style={{width:6,height:6,borderRadius:"var(--radius-full)",background:"currentColor"}} />:null}
    {children}
  </span>;
}
