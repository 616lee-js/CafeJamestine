const { Button, Badge, Icon, Field, Input, Textarea, Select, Combobox, SplitPane,
        SectionHeading, ViewRow, ListRow, EmptyState, Card, CardHeader, CardContent } = window.CafJamestineDesignSystem_188632;

const GROUPS=[["active","Active"],["storage","Storage"],["history","History"]];

function Coffees({ go, coffees }){
  const [selected,setSelected]=React.useState(coffees[0].id);
  const [mode,setMode]=React.useState("view");
  const [incomplete,setIncomplete]=React.useState(false);
  const coffee=coffees.find(c=>c.id===selected);
  const groups=GROUPS.map(([g,label])=>({label,items:coffees.filter(c=>c.group===g).map(c=>({
    id:c.id,name:c.name,meta:c.roaster,status:c.bags[0]&&c.bags[0].status}))}));
  const rail=<Rail title="Coffees" groups={incomplete?[{label:"Incomplete",items:[]}]:groups}
    selected={selected} onSelect={id=>{setSelected(id);setMode("view")}} onNew={()=>setMode("edit")}
    emptyLabel="No incomplete coffees."
    filters={<Button size="xs" variant={incomplete?"default":"outline"} onClick={()=>setIncomplete(v=>!v)}>Incomplete (0)</Button>} />;
  return <SplitPane list={rail}>
    {mode==="view"?<CoffeeView coffee={coffee} onEdit={()=>setMode("edit")} go={go} />
      :<CoffeeEdit coffee={coffee} onDone={()=>setMode("view")} />}
  </SplitPane>;
}

function CoffeeView({coffee,onEdit,go}){
  return <div style={{display:"flex",flexDirection:"column",gap:"var(--space-10)"}}>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"var(--space-4)"}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:"var(--space-5)"}}>
        <div style={{display:"flex",width:96,height:96,flexShrink:0,alignItems:"center",justifyContent:"center",
          borderRadius:"var(--radius-xl)",border:"1px solid var(--border)",background:"var(--muted)"}}>
          <Icon name="image-plus" size={24} color="var(--text-muted)" />
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
          <h1 style={{margin:0,fontFamily:"var(--font-display)",fontSize:"var(--text-3xl)",lineHeight:1.1,
            fontWeight:"var(--weight-semibold)",letterSpacing:"var(--tracking-tight)",color:"var(--text-heading)"}}>
            {coffee.name}</h1>
          <span style={{fontSize:"var(--text-base)",color:"var(--text-muted)"}}>
            {[coffee.roaster,coffee.country,coffee.processes&&coffee.processes[0]].filter(Boolean).join(" · ")}</span>
        </div>
      </div>
      <div style={{display:"flex",gap:"var(--space-2)",flexShrink:0}}>
        <Button size="sm" variant="outline" onClick={onEdit}><Icon name="pencil" size={16} />Edit</Button>
        <Button size="sm" variant="ghost" style={{color:"var(--destructive)"}}><Icon name="trash-2" size={16} />Delete</Button>
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",columnGap:"var(--space-8)",rowGap:"var(--space-2)"}}>
      <ViewRow label="Roaster" value={coffee.roaster} />
      <ViewRow label="Country" value={coffee.country} />
      <ViewRow label="Region" value={coffee.region} />
      <ViewRow label="Producer" value={coffee.producer} />
      <ViewRow label="Roast level" value={coffee.roast} />
      <ViewRow label="Recommended rest" value={coffee.rest} />
      <ViewRow label="Rating" value={coffee.rating?coffee.rating+" · "+coffee.ratingCount+" session"+(coffee.ratingCount===1?"":"s"):null} />
      <ViewRow label="Elevation" value={coffee.elevation} />
      <ViewRow label="Processes" value={<Chips items={coffee.processes} />} />
      <ViewRow label="Varietals" value={<Chips items={coffee.varietals} />} />
    </div>
    <ViewRow label="Flavor notes" value={coffee.flavor} />

    <section style={{display:"flex",flexDirection:"column",gap:"var(--space-3)"}}>
      <SectionHeading level="section" action={<Button size="sm" variant="outline"><Icon name="plus" size={16} />Add bag</Button>}>Bags</SectionHeading>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(15rem,1fr))",gap:"var(--space-3)"}}>
        {coffee.bags.map(b=><Card key={b.id} style={{gap:"var(--space-3)",padding:"var(--space-4) 0"}}>
          <CardHeader style={{padding:"0 var(--space-4)"}} title={"Roasted "+b.roast_date}
            description={"$"+b.price.toFixed(2)+" · "+b.rested+" days rested"}
            action={<Badge status={b.status} dot>{b.status}</Badge>} />
          <CardContent style={{padding:"0 var(--space-4)"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"var(--space-1-5)"}}>
              {["frozen","resting","active","finished"].map(s=>
                <Button key={s} size="xs" variant={s===b.status?"default":"outline"}>{s}</Button>)}
            </div>
          </CardContent>
        </Card>)}
      </div>
    </section>

    <section style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
      <SectionHeading level="section">Sessions brewed with this coffee</SectionHeading>
      <ul style={{display:"flex",flexDirection:"column",gap:"var(--space-2)",margin:0,padding:0,listStyle:"none"}}>
        <li><ListRow as="div" onClick={()=>go("session")} title="V60 · 18 g / 300 g" meta="8/2/2026 · 8.5/10" trailing={<Badge status="active" dot>active</Badge>} /></li>
        <li><ListRow as="div" onClick={()=>go("session")} title="V60 · 18 g / 290 g" meta="7/27/2026 · 8.0/10" trailing={<Badge status="complete">complete</Badge>} /></li>
      </ul>
    </section>
  </div>;
}

function Chips({items}){
  if(!items||!items.length) return null;
  return <span style={{display:"flex",flexWrap:"wrap",gap:"var(--space-1)",marginTop:"var(--space-1)"}}>
    {items.map(i=><Badge key={i} variant="secondary">{i}</Badge>)}</span>;
}

/* Edit is an explicit mode with its own tinted surface — the read/edit distinction. */
function CoffeeEdit({coffee,onDone}){
  return <div style={{display:"flex",flexDirection:"column",gap:"var(--space-6)"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--space-4)"}}>
      <span style={{display:"flex",alignItems:"center",gap:"var(--space-2)"}}>
        <Badge variant="secondary">Editing</Badge>
        <span style={{fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>Changes save when you press Save.</span>
      </span>
      <div style={{display:"flex",gap:"var(--space-2)"}}>
        <Button size="sm" variant="ghost" onClick={onDone}>Cancel</Button>
        <Button size="sm" onClick={onDone}>Save</Button>
      </div>
    </div>
    <div style={{display:"grid",gap:"var(--space-5)",gridTemplateColumns:"repeat(2,minmax(0,1fr))",
      borderRadius:"var(--radius-2xl)",border:"1px solid var(--edit-border)",background:"var(--edit-surface)",
      padding:"var(--space-6)"}}>
      <div style={{gridColumn:"span 2"}}><Field label="Name"><Input size="touch" defaultValue={coffee.name} placeholder="e.g. Finca …" /></Field></div>
      <Field label="Roaster"><Combobox value="1" valueName={coffee.roaster} options={[{id:"1",name:coffee.roaster},{id:"2",name:"Sey Coffee"},{id:"3",name:"Tim Wendelboe"}]} /></Field>
      <Field label="Producer"><Combobox value={coffee.producer?"1":null} valueName={coffee.producer} options={[{id:"1",name:coffee.producer||"—"}]} /></Field>
      <Field label="Country"><Combobox value="1" valueName={coffee.country} options={[{id:"1",name:coffee.country}]} /></Field>
      <Field label="Region" hint="Pick a country first"><Combobox value={coffee.region?"1":null} valueName={coffee.region} options={[{id:"1",name:coffee.region||"—"}]} /></Field>
      <Field label="Roast level"><Select size="touch" value="light" options={[{value:"__none__",label:"— None —"},{value:"light",label:"Light"},{value:"medium",label:"Medium"},{value:"dark",label:"Dark"}]} /></Field>
      <Field label="Recommended rest"><Input size="touch" defaultValue={coffee.rest} placeholder="e.g. 2–3 weeks from roast" /></Field>
      <Field label="Website"><Input size="touch" type="url" placeholder="https://…" /></Field>
      <Field label="Rating override (1–10)" hint="Optional; overrides computed aggregate"><Input size="touch" inputMode="decimal" placeholder="e.g. 8.5" style={{width:"7rem"}} /></Field>
      <div style={{gridColumn:"span 2"}}><Field label="Flavor notes"><Textarea defaultValue={coffee.flavor} /></Field></div>
      <div style={{gridColumn:"span 2"}}>
        <details style={{borderRadius:"var(--radius-lg)",border:"1px solid var(--border)",background:"var(--surface-card)",padding:"var(--space-3)"}}>
          <summary style={{cursor:"pointer",fontSize:"var(--text-sm)",fontWeight:"var(--weight-medium)"}}>More details (rare)</summary>
          <div style={{display:"grid",gap:"var(--space-5)",gridTemplateColumns:"repeat(3,minmax(0,1fr))",paddingTop:"var(--space-4)"}}>
            <Field label="Elevation"><Input size="touch" defaultValue={coffee.elevation} placeholder="e.g. 1,950 masl" /></Field>
            <Field label="Salinity"><Input size="touch" /></Field>
            <Field label="Humidity"><Input size="touch" /></Field>
          </div>
        </details>
      </div>
    </div>
  </div>;
}
Object.assign(window,{ Coffees });
