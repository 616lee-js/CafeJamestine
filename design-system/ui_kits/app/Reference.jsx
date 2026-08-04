const { Button, Icon, Input, SectionHeading, EmptyState } = window.CafJamestineDesignSystem_188632;

const TABLES=[["Roasters",["Onyx Coffee Lab","Sey Coffee","Tim Wendelboe"]],
  ["Countries",["Brazil","Colombia","Ethiopia","Kenya"]],
  ["Regions",["Cauca","Guji","Kirinyaga"]],
  ["Producers",["Diego Bermúdez","Uraga Washing Station"]],
  ["Processes",["Washed","Natural","Double anaerobic"]],
  ["Varietals",["Castillo","Heirloom","SL28","SL34","Yellow Bourbon"]],
  ["Units",["g","ml","oz","shot"]]];

function Reference(){
  const [table,setTable]=React.useState("Roasters");
  const rows=(TABLES.find(t=>t[0]===table)||[])[1]||[];
  return <div style={{maxWidth:"var(--detail-measure)",display:"flex",flexDirection:"column",gap:"var(--space-6)"}}>
    <SectionHeading level="page">Reference</SectionHeading>
    <p style={{margin:0,fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>
      Your own lists. Anything you add here becomes selectable everywhere else.</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:"var(--space-2)"}}>
      {TABLES.map(([t])=><Button key={t} size="sm" variant={t===table?"default":"outline"} onClick={()=>setTable(t)}>{t}</Button>)}
    </div>
    <div style={{display:"flex",gap:"var(--space-2)",maxWidth:"26rem"}}>
      <Input size="touch" placeholder={"Add to "+table.toLowerCase()+"…"} />
      <Button size="touch" variant="outline"><Icon name="plus" size={16} />Add</Button>
    </div>
    {rows.length===0?<EmptyState>Nothing yet.</EmptyState>:
      <ul style={{display:"flex",flexWrap:"wrap",gap:"var(--space-2)",margin:0,padding:0,listStyle:"none"}}>
        {rows.map(r=><li key={r} style={{display:"flex",alignItems:"center",gap:"var(--space-1)",
          border:"1px solid var(--border)",background:"var(--surface-card)",borderRadius:"var(--radius-full)",
          padding:"var(--space-1) var(--space-1) var(--space-1) var(--space-3)",fontSize:"var(--text-sm)"}}>
          {r}<Button size="icon-xs" variant="ghost" style={{color:"var(--text-muted)"}}><Icon name="x" size={12} /></Button>
        </li>)}
      </ul>}
  </div>;
}
Object.assign(window,{ Reference });
