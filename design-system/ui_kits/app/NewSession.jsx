const { Button, Icon, ListRow, SectionHeading, EmptyState } = window.CafJamestineDesignSystem_188632;

/* Three steps, each its own screen. Committing lands you in the workflow at Plan. */
function NewSession({ go, coffees, recipes, sessions }){
  const [step,setStep]=React.useState(1);
  const [type,setType]=React.useState(null);
  const [coffee,setCoffee]=React.useState(null);
  const activeCoffees=coffees.filter(c=>c.bags.some(b=>b.status==="active"));
  const typeRecipes=recipes.filter(r=>r.type===type);
  const prior=sessions.filter(s=>s.type===type).slice(0,4);
  const back=()=>setStep(step===3&&type==="brewed_coffee"?2:1);

  return <div style={{maxWidth:"var(--detail-measure)",display:"flex",flexDirection:"column",gap:"var(--space-8)"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <a onClick={()=>go("sessions")} style={{display:"flex",alignItems:"center",gap:"var(--space-1)",
        fontSize:"var(--text-sm)",color:"var(--text-muted)",cursor:"pointer"}}>
        <Icon name="arrow-left" size={16} />Sessions</a>
      <span style={{display:"flex",alignItems:"center",gap:"var(--space-3)"}}>
        <span className="eyebrow">Step {step} of 3</span>
        {step>1?<Button variant="ghost" size="sm" onClick={back}>Back</Button>:null}
      </span>
    </div>

    {step===1?<div style={{display:"flex",flexDirection:"column",gap:"var(--space-5)"}}>
      <SectionHeading level="page">Start a session</SectionHeading>
      <p style={{margin:0,fontSize:"var(--text-base)",color:"var(--text-muted)"}}>
        What are you making? (This sets the type — permanent.)</p>
      <div style={{display:"grid",gap:"var(--space-4)",gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}>
        {[["brewed_coffee","coffee","Brewed coffee","Pour-over and similar: a coffee, a recipe, timed pours."],
          ["specialty_drink","glass-water","Specialty drink","Lattes and signature drinks: ingredients and prose steps."]].map(([v,g,l,d])=>
          <TypeTile key={v} glyph={g} label={l} desc={d}
            onClick={()=>{setType(v);setStep(v==="brewed_coffee"?2:3)}} />)}
      </div>
    </div>:null}

    {step===2?<div style={{display:"flex",flexDirection:"column",gap:"var(--space-5)"}}>
      <SectionHeading level="page">Select coffee</SectionHeading>
      <p style={{margin:0,fontSize:"var(--text-base)",color:"var(--text-muted)"}}>
        Only coffees with an active bag can be brewed.</p>
      {activeCoffees.length===0?<EmptyState>No coffees have an active bag. Set a bag to active on a coffee first.</EmptyState>:
        <ul style={{display:"flex",flexDirection:"column",gap:"var(--space-2)",margin:0,padding:0,listStyle:"none"}}>
          {activeCoffees.map(c=><li key={c.id}><ListRow as="div" title={c.name} meta={c.roaster}
            trailing={<Icon name="arrow-right" size={16} color="var(--text-muted)" />}
            onClick={()=>{setCoffee(c);setStep(3)}} /></li>)}
        </ul>}
    </div>:null}

    {step===3?<div style={{display:"flex",flexDirection:"column",gap:"var(--space-8)"}}>
      <div style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
        <SectionHeading level="page">Parameter source</SectionHeading>
        <p style={{margin:0,fontSize:"var(--text-base)",color:"var(--text-muted)"}}>
          {type==="brewed_coffee"?"Brewed coffee"+(coffee?" · "+coffee.name:""):"Specialty drink"}</p>
      </div>
      <Button size="hero" fullWidth style={{justifyContent:"flex-start",fontSize:"var(--text-lg)"}}
        onClick={()=>go("session")}>Build new (blank)</Button>
      <section style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
        <SectionHeading level="eyebrow">Clone a recipe</SectionHeading>
        {typeRecipes.length===0?<EmptyState>No recipes of this type.</EmptyState>:
          <ul style={{display:"flex",flexDirection:"column",gap:"var(--space-2)",margin:0,padding:0,listStyle:"none"}}>
            {typeRecipes.map(r=><li key={r.id}><ListRow as="div" title={r.name} meta={r.method}
              trailing={<span style={{fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>{r.scope}</span>}
              onClick={()=>go("session")} /></li>)}
          </ul>}
      </section>
      <section style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
        <SectionHeading level="eyebrow">Clone a prior session</SectionHeading>
        {prior.length===0?<EmptyState>No prior sessions.</EmptyState>:
          <ul style={{display:"flex",flexDirection:"column",gap:"var(--space-2)",margin:0,padding:0,listStyle:"none"}}>
            {prior.map(s=><li key={s.id}><ListRow as="div"
              title={new Date(s.date+"T12:00:00").toLocaleDateString()+" · "+s.title}
              meta={s.method} onClick={()=>go("session")} /></li>)}
          </ul>}
      </section>
    </div>:null}
  </div>;
}

function TypeTile({glyph,label,desc,onClick}){
  const [h,setH]=React.useState(false);
  return <button type="button" onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:"var(--space-3)",
      borderRadius:"var(--radius-2xl)",border:"1px solid "+(h?"var(--ring)":"var(--border)"),
      background:h?"var(--surface-selected)":"var(--surface-card)",boxShadow:"var(--shadow-sm)",
      padding:"var(--space-6)",cursor:"pointer",textAlign:"left",fontFamily:"var(--font-sans)",
      transition:"var(--transition-colors)"}}>
    <Icon name={glyph} size={32} color="var(--primary)" />
    <span style={{fontFamily:"var(--font-display)",fontSize:"var(--text-xl)",
      fontWeight:"var(--weight-semibold)",letterSpacing:"var(--tracking-snug)",color:"var(--text-heading)"}}>{label}</span>
    <span style={{fontSize:"var(--text-sm)",lineHeight:1.45,color:"var(--text-muted)"}}>{desc}</span>
  </button>;
}
Object.assign(window,{ NewSession });
