const { Button, Badge, Icon, Field, Input, Textarea, Select, Switch, Label, PhaseStepper,
        SectionHeading, ViewRow, RatingControl, StepsTable, ConfirmPanel, Dialog, BrewParam } = window.CafJamestineDesignSystem_188632;

const ORDER={brewed_coffee:["plan","brew","postbrew","tasting"],specialty_drink:["plan","make","tasting"]};
const LABEL={plan:"Plan",brew:"Brew",postbrew:"Post-brew",make:"Make",tasting:"Tasting"};

/* One session, one continuous surface, one phase at a time. Committing a phase advances. */
function SessionWorkflow({ go, session, ingredients, drinkSteps, onSubbar }){
  const brewed=session.type==="brewed_coffee";
  const order=ORDER[session.type];
  const [phase,setPhase]=React.useState("plan");
  const [done,setDone]=React.useState([]);
  const [editing,setEditing]=React.useState(false);
  const [confirming,setConfirming]=React.useState(false);
  const [deleting,setDeleting]=React.useState(false);
  const [iced,setIced]=React.useState(false);
  const [tasting,setTasting]=React.useState(session.tasting||[]);

  const advance=()=>{const i=order.indexOf(phase);
    setDone(d=>d.includes(phase)?d:d.concat(phase));
    if(i<order.length-1) setPhase(order[i+1]);};

  React.useEffect(()=>{
    onSubbar(<PhaseStepper value={phase} done={done} onChange={setPhase}
      phases={order.map(v=>({value:v,label:LABEL[v]}))} />);
  },[phase,done]);

  return <div style={{position:"relative",display:"flex",flexDirection:"column",gap:"var(--space-8)"}}>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"var(--space-4)"}}>
      <div style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
        <a onClick={()=>go("sessions")} style={{display:"flex",alignItems:"center",gap:"var(--space-1)",
          fontSize:"var(--text-sm)",color:"var(--text-muted)",cursor:"pointer"}}>
          <Icon name="arrow-left" size={16} />Sessions</a>
        <h1 style={{margin:0,fontFamily:"var(--font-display)",fontSize:"var(--text-3xl)",lineHeight:1.1,
          fontWeight:"var(--weight-semibold)",letterSpacing:"var(--tracking-tight)",color:"var(--text-heading)"}}>
          {session.title}</h1>
        <span style={{fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>
          roasted 2026-07-18 · {session.rested} days rested</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"var(--space-2)",flexShrink:0}}>
        <Badge variant="secondary">{brewed?"Brewed coffee":"Specialty drink"}</Badge>
        <Badge status={session.status} dot={session.status==="active"}>{session.status}</Badge>
        <Button variant="ghost" size="sm"><Icon name="copy" size={16} />Clone</Button>
        <Button variant="ghost" size="sm" style={{color:"var(--destructive)"}} onClick={()=>setDeleting(true)}>
          <Icon name="trash-2" size={16} />Delete</Button>
      </div>
    </div>

    {phase==="plan"?<Plan session={session} brewed={brewed} editing={editing} setEditing={setEditing}
      iced={iced} setIced={setIced} onCommit={()=>brewed?go("brew",session):advance()} />:null}
    {phase==="postbrew"?<PostBrew session={session} onCommit={advance} />:null}
    {phase==="make"?<Make ingredients={ingredients} steps={drinkSteps} onCommit={advance} />:null}
    {phase==="tasting"?<Tasting session={session} tasting={tasting} setTasting={setTasting}
      confirming={confirming} setConfirming={setConfirming} onDone={()=>go("sessions")} />:null}

    <Dialog open={deleting} onClose={()=>setDeleting(false)} title="Delete this session?"
      description="The session, its steps and its tasting notes go with it. This cannot be undone."
      footer={<><Button variant="ghost" onClick={()=>setDeleting(false)}>Cancel</Button>
        <Button variant="destructive" onClick={()=>{setDeleting(false);go("sessions")}}>Delete</Button></>} />
  </div>;
}

/* ---- Plan: read-first, explicit Edit, then Confirm & brew ---- */
function Plan({session,brewed,editing,setEditing,iced,setIced,onCommit}){
  return <section style={{display:"flex",flexDirection:"column",gap:"var(--space-6)"}}>
    <SectionHeading level="section" action={
      <Button size="sm" variant="outline" onClick={()=>setEditing(v=>!v)}>
        {editing?"Done editing":<><Icon name="pencil" size={16} />Edit</>}</Button>}>Recipe</SectionHeading>

    {editing?<div style={{display:"grid",gap:"var(--space-5)",gridTemplateColumns:"repeat(3,minmax(0,1fr))",
      borderRadius:"var(--radius-2xl)",border:"1px solid var(--edit-border)",background:"var(--edit-surface)",
      padding:"var(--space-6)"}}>
      <Field label="Method"><Select size="touch" value="v60" options={[{value:"__none__",label:"— None —"},{value:"v60",label:"V60"},{value:"kalita",label:"Kalita Wave 155"},{value:"espresso",label:"Espresso"}]} /></Field>
      <Field label="Measured by"><Select size="touch" value="input" options={[{value:"input",label:"input (brew water)"},{value:"output",label:"output (in cup)"}]} /></Field>
      <Field label="Brewer / brew device"><Select size="touch" value="v60" options={[{value:"v60",label:"Hario V60 02"},{value:"kalita",label:"Kalita Wave 155"}]} /></Field>
      <Field label="Grinder"><Select size="touch" value="k" options={[{value:"k",label:"1Zpresso K-Ultra"}]} /></Field>
      <Field label="Grind setting"><Input size="touch" defaultValue={session.grind} /></Field>
      <Field label="Dose (g)"><Input size="touch" inputMode="decimal" defaultValue={String(session.dose)} /></Field>
      <Field label="Water (g)"><Input size="touch" inputMode="decimal" defaultValue={String(session.water)} /></Field>
      <Field label="Temperature (°C)"><Input size="touch" inputMode="decimal" defaultValue={String(session.temp)} /></Field>
      <Field label="Bloom water (g)"><Input size="touch" inputMode="decimal" defaultValue={String(session.bloom_g)} /></Field>
      <Field label="Bloom time (m:ss)" hint="m:ss"><Input size="touch" inputMode="numeric" defaultValue={session.bloom_t} /></Field>
      <div style={{gridColumn:"span 2",display:"flex",alignItems:"center",justifyContent:"space-between",
        gap:"var(--space-4)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",
        background:"var(--surface-card)",padding:"var(--space-3) var(--space-4)"}}>
        <Label>Iced</Label><Switch checked={iced} onChange={setIced} />
      </div>
      {iced?<Field label="Ice (g)"><Input size="touch" inputMode="decimal" placeholder="e.g. 120" /></Field>:null}
    </div>:<div style={{display:"flex",flexDirection:"column",gap:"var(--space-6)"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",
        columnGap:"var(--space-8)",rowGap:"var(--space-2)"}}>
        <ViewRow label="Method" value={session.method} />
        <ViewRow label="Brewer" value={session.brewer} />
        <ViewRow label="Grinder" value={session.grinder} />
        <ViewRow label="Grind" value={session.grind} />
        <ViewRow label="Dose (g)" value={session.dose} />
        <ViewRow label="Water (g)" value={session.water} />
        <ViewRow label="Measured by" value={session.anchor} />
        <ViewRow label="Temperature (°C)" value={session.temp} />
        <ViewRow label="Bloom water (g)" value={session.bloom_g} />
        <ViewRow label="Bloom time (m:ss)" value={session.bloom_t} />
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
        <SectionHeading level="section">Steps</SectionHeading>
        <StepsTable steps={session.steps} />
      </div>
    </div>}

    {!editing?<div><Button size="hero" onClick={onCommit}>
      <Icon name="play" size={20} />{brewed?"Confirm & brew":"Continue to Make"}</Button></div>:null}
  </section>;
}

function PostBrew({session,onCommit}){
  return <section style={{display:"flex",flexDirection:"column",gap:"var(--space-6)"}}>
    <SectionHeading level="section">Post-brew</SectionHeading>
    <div style={{display:"grid",gap:"var(--space-5)",gridTemplateColumns:"repeat(3,minmax(0,1fr))",
      borderRadius:"var(--radius-2xl)",border:"1px solid var(--edit-border)",background:"var(--edit-surface)",
      padding:"var(--space-6)"}}>
      <Field label="Total brew time (m:ss)" hint="m:ss"><Input size="touch" inputMode="numeric" defaultValue={session.total} /></Field>
      <div style={{gridColumn:"span 3"}}><Field label="Post-brew notes"><Textarea defaultValue={session.notes} /></Field></div>
    </div>
    <div><Button size="lg" onClick={onCommit}>Continue to Tasting<Icon name="arrow-right" size={16} /></Button></div>
  </section>;
}

function Make({ingredients,steps,onCommit}){
  const [mult,setMult]=React.useState("1");
  const m=Number(mult)>0?Math.round(Number(mult)*10)/10:1;
  return <section style={{display:"flex",flexDirection:"column",gap:"var(--space-8)"}}>
    <div style={{display:"flex",flexDirection:"column",gap:"var(--space-3)"}}>
      <SectionHeading level="section" action={<span style={{display:"flex",alignItems:"center",gap:"var(--space-2)"}}>
        <Label size="xs">Batch ×</Label><Input size="sm" value={mult} onChange={e=>setMult(e.target.value)} style={{width:"5rem"}} />
      </span>}>Ingredients</SectionHeading>
      <ul style={{display:"flex",flexDirection:"column",gap:"var(--space-2)",margin:0,padding:0,listStyle:"none",
        maxWidth:"var(--brew-measure)"}}>
        {ingredients.map(i=><li key={i.name} style={{display:"flex",justifyContent:"space-between",
          gap:"var(--space-4)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",
          background:"var(--surface-card)",padding:"var(--space-3) var(--space-5)",
          fontSize:"var(--brew-step)",color:"var(--text-body)"}}>
          <span>{i.name}</span>
          <span className="tabular" style={{fontWeight:"var(--weight-semibold)",color:"var(--text-heading)"}}>
            {Math.round(i.qty*m*10)/10} {i.unit}</span></li>)}
      </ul>
      {m!==1?<p style={{margin:0,fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>Showing {m}× batch — recipe unchanged.</p>:null}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:"var(--space-2)",maxWidth:"var(--brew-measure)"}}>
      <SectionHeading level="section">Steps</SectionHeading>
      <ol style={{display:"flex",flexDirection:"column",gap:"var(--space-2)",margin:0,padding:0,listStyle:"none"}}>
        {steps.map((s,i)=><li key={i} style={{display:"flex",gap:"var(--space-4)",
          border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",background:"var(--surface-card)",
          padding:"var(--space-4) var(--space-5)"}}>
          <span className="tabular" style={{fontFamily:"var(--font-display)",fontSize:"var(--brew-time)",
            lineHeight:1,fontWeight:"var(--weight-semibold)",color:"var(--phase-brew)"}}>{i+1}</span>
          <span style={{fontSize:"var(--brew-step)",lineHeight:1.35,color:"var(--text-body)"}}>{s.description}</span></li>)}
      </ol>
    </div>
    <div><Button size="lg" onClick={onCommit}>Continue to Tasting<Icon name="arrow-right" size={16} /></Button></div>
  </section>;
}

function Tasting({session,tasting,setTasting,confirming,setConfirming,onDone}){
  return <section style={{display:"flex",flexDirection:"column",gap:"var(--space-6)"}}>
    <SectionHeading level="section">Tasting</SectionHeading>
    <div style={{display:"grid",gap:"var(--space-6)",gridTemplateColumns:"minmax(0,20rem) minmax(0,1fr)",alignItems:"start"}}>
      <div style={{display:"flex",flexDirection:"column",gap:"var(--space-4)",
        borderRadius:"var(--radius-2xl)",border:"1px solid var(--edit-border)",background:"var(--edit-surface)",
        padding:"var(--space-6)"}}>
        <Field label="Overall enjoyment (1–10)" hint="Standalone enjoyment, set directly (1–10, 0.5 steps)">
          <Input size="touch" inputMode="decimal" defaultValue={String(session.overall||"")} placeholder="e.g. 8.5" />
        </Field>
        <Field label="Next-time adjustments"><Textarea defaultValue={session.next} minHeight="7rem" /></Field>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"var(--space-3)"}}>
        <p style={{margin:0,fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>
          Per-category 1–5 describes prominence on each parameter&rsquo;s spectrum — not enjoyment.</p>
        {tasting.map((c,i)=><div key={c.name} style={{display:"flex",flexDirection:"column",gap:"var(--space-2)",
          border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",background:"var(--surface-card)",
          padding:"var(--space-4)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--space-3)"}}>
            <span style={{fontSize:"var(--text-base)",fontWeight:"var(--weight-semibold)",color:"var(--text-heading)"}}>{c.name}</span>
            <RatingControl value={c.rating} onChange={v=>setTasting(t=>t.map((x,j)=>j===i?{...x,rating:v}:x))} />
          </div>
          <p style={{margin:0,fontSize:"var(--text-xs)",color:"var(--text-muted)"}}>{c.guidance}</p>
          <Textarea minHeight="2.25rem" defaultValue={c.notes} placeholder="Notes (optional)" />
        </div>)}
      </div>
    </div>
    <div style={{borderTop:"1px solid var(--border)",paddingTop:"var(--space-6)"}}>
      {confirming?<ConfirmPanel confirmLabel="Mark complete" confirmIcon={<Icon name="check" size={16} />}
        onCancel={()=>setConfirming(false)} onConfirm={onDone}
        message="Mark complete? This snapshots days-rested + brew date and marks the workflow done. You can still edit it afterward."
        style={{maxWidth:"36rem"}} />
        :<Button size="hero" onClick={()=>setConfirming(true)}><Icon name="check" size={20} />Mark complete</Button>}
    </div>
  </section>;
}
Object.assign(window,{ SessionWorkflow });
