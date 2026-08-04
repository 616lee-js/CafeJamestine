const { Button, Badge, Icon, ListRow, SectionHeading, EmptyState, SplitPane,
        ViewRow, StepsTable } = window.CafJamestineDesignSystem_188632;

function Recipes({ go, recipes }){
  const [selected,setSelected]=React.useState(recipes[0].id);
  const [scope,setScope]=React.useState("all");
  const r=recipes.find(x=>x.id===selected);
  const pass=x=>scope==="all"||(scope==="standard"&&x.scope==="standard")||(scope==="favorite"&&x.favorite)||(scope==="coffee"&&x.scope!=="standard");
  const rail=<Rail title="Recipes" onNew={()=>{}} selected={selected} onSelect={setSelected}
    emptyLabel="No recipes match."
    filters={[["all","All"],["standard","Standards"],["coffee","Coffee-specific"],["favorite","Favorites"]].map(([v,l])=>
      <Button key={v} size="xs" variant={scope===v?"default":"outline"} onClick={()=>setScope(v)}>{l}</Button>)}
    groups={[{label:"Brewed",items:recipes.filter(x=>x.type==="brewed_coffee"&&pass(x)).map(x=>({id:x.id,name:x.name,meta:x.method,favorite:x.favorite}))},
             {label:"Specialty",items:recipes.filter(x=>x.type==="specialty_drink"&&pass(x)).map(x=>({id:x.id,name:x.name,meta:x.scope,favorite:x.favorite}))}]} />;
  return <SplitPane list={rail}>
    <div style={{display:"flex",flexDirection:"column",gap:"var(--space-8)"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"var(--space-4)"}}>
        <div style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
          <h1 style={{margin:0,fontFamily:"var(--font-display)",fontSize:"var(--text-3xl)",lineHeight:1.1,
            fontWeight:"var(--weight-semibold)",letterSpacing:"var(--tracking-tight)",color:"var(--text-heading)"}}>{r.name}</h1>
          <span style={{display:"flex",alignItems:"center",gap:"var(--space-2)"}}>
            {r.favorite?<Icon name="star" size={16} color="var(--favorite)" />:null}
            <Badge variant="secondary">{r.type==="brewed_coffee"?"Brewed coffee":"Specialty drink"}</Badge>
            <span style={{fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>{[r.method,r.scope].filter(Boolean).join(" · ")}</span>
          </span>
        </div>
        <div style={{display:"flex",gap:"var(--space-2)",flexShrink:0}}>
          <Button size="sm" variant="outline"><Icon name="pencil" size={16} />Edit</Button>
          <Button size="sm" onClick={()=>go("new-session")}><Icon name="play" size={16} />Use in a session</Button>
        </div>
      </div>
      {r.type==="brewed_coffee"?<div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",
        columnGap:"var(--space-8)",rowGap:"var(--space-2)"}}>
        <ViewRow label="Method" value={r.method} /><ViewRow label="Dose (g)" value="20" />
        <ViewRow label="Water (g)" value="320" /><ViewRow label="Temp (°C)" value="94" />
      </div>:null}
      <div style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
        <SectionHeading level="section">Steps</SectionHeading>
        <StepsTable mode={r.type} steps={r.type==="brewed_coffee"
          ?[{time:"0:00",description:"Bloom, centre pour",weight:55,flow:null},{time:"0:45",description:"Spiral to 180 g",weight:180,flow:3.4},{time:"1:40",description:"Final pour",weight:320,flow:4.0}]
          :[{description:"Pull an 18 g double into a warmed cup."},{description:"Steam milk to 60 °C, glossy microfoam."},{description:"Pour from height, drop in close for a centred dot."}]} />
      </div>
    </div>
  </SplitPane>;
}
Object.assign(window,{ Recipes });
