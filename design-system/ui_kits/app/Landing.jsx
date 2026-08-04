const { Button, Icon, SectionHeading } = window.CafJamestineDesignSystem_188632;

/* Pure launchpad: one dominant action, a conditional resume line, plain area cards,
   and a reserved (empty) insight region. Two-column act zone uses the width. */
function Landing({ go, resume }){
  return <div style={{display:"flex",flexDirection:"column",gap:"var(--space-12)"}}>
    <div style={{display:"grid",gap:"var(--space-10)",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",alignItems:"stretch"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:"var(--space-5)",
        paddingTop:"var(--space-6)"}}>
        <img src="../../assets/logo.svg" alt="" style={{width:60,display:"block"}} />
        <h1 style={{margin:0,fontFamily:"var(--font-display)",fontSize:"var(--text-4xl)",lineHeight:1.05,
          fontWeight:"var(--weight-semibold)",letterSpacing:"var(--tracking-tight)",color:"var(--text-heading)"}}>
          Café Jamestine</h1>
        <Button size="hero" onClick={()=>go("new-session")} style={{fontSize:"var(--text-lg)"}}>
          <Icon name="play" size={20} />Start a session</Button>
        {resume?<a onClick={()=>go("session")} style={{fontSize:"var(--text-sm)",color:"var(--text-muted)",
          cursor:"pointer"}}>Resume active session · {resume.title}</a>:null}
      </div>
      {/* Reserved insight region — visible placeholder, intentionally empty. */}
      <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",
        gap:"var(--space-2)",minHeight:"15rem",borderRadius:"var(--radius-2xl)",
        border:"1px dashed var(--slate-300)",background:"var(--surface-sunken)"}}>
        <span className="eyebrow">Insights</span>
        <span style={{fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>Reserved for a dashboard.</span>
      </div>
    </div>
    <div style={{display:"grid",gap:"var(--space-4)",gridTemplateColumns:"repeat(3,minmax(0,1fr))"}}>
      {[["coffees","Coffees","Beans, bags and their history"],
        ["sessions","Sessions","Every brew, planned and reflected on"],
        ["recipes","Recipes","Reusable parameter templates"]].map(([k,l,d])=>
        <AreaCard key={k} label={l} desc={d} onClick={()=>go(k)} />)}
    </div>
  </div>;
}

function AreaCard({label,desc,onClick}){
  const [h,setH]=React.useState(false);
  return <a onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--space-4)",
      borderRadius:"var(--radius-xl)",border:"1px solid var(--border)",
      background:h?"var(--surface-selected)":"var(--surface-card)",
      boxShadow:"var(--shadow-sm)",padding:"var(--space-5) var(--space-6)",cursor:"pointer",
      textDecoration:"none",transition:"var(--transition-colors)"}}>
    <span style={{display:"flex",flexDirection:"column",gap:"var(--space-1)"}}>
      <span style={{fontFamily:"var(--font-display)",fontSize:"var(--text-lg)",
        fontWeight:"var(--weight-semibold)",letterSpacing:"var(--tracking-snug)",color:"var(--text-heading)"}}>{label}</span>
      <span style={{fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>{desc}</span>
    </span>
    <Icon name="arrow-right" size={18} color="var(--text-muted)" />
  </a>;
}
Object.assign(window,{ Landing });
