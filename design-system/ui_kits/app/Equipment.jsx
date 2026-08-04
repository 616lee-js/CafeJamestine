const { Button, Badge, Icon, ListRow, SectionHeading } = window.CafJamestineDesignSystem_188632;

function Equipment({ equipment }){
  const inBrewing=equipment.filter(e=>e.workflow), other=equipment.filter(e=>!e.workflow);
  return <div style={{maxWidth:"var(--detail-measure)",display:"flex",flexDirection:"column",gap:"var(--space-8)"}}>
    <SectionHeading level="page" action={<Button size="sm"><Icon name="plus" size={16} />New</Button>}>Equipment</SectionHeading>
    {[["In brewing",inBrewing],["Everything else",other]].map(([label,rows])=>rows.length?
      <section key={label} style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
        <SectionHeading level="eyebrow">{label}</SectionHeading>
        <ul style={{display:"flex",flexDirection:"column",gap:"var(--space-2)",margin:0,padding:0,listStyle:"none"}}>
          {rows.map(e=><li key={e.id}><ListRow as="div" title={e.name}
            meta={[e.category,e.sub].filter(Boolean).join(" · ")}
            trailing={e.workflow?<Badge variant="secondary">In brewing</Badge>:null} /></li>)}
        </ul>
      </section>:null)}
  </div>;
}
Object.assign(window,{ Equipment });
