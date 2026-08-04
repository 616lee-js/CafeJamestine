const { Button, Badge, Icon, SectionHeading, EmptyState } = window.CafJamestineDesignSystem_188632;

/* Shared list rail: grouped, status-pilled, selection persists. Used by Coffees and Recipes. */
function Rail({title,groups,selected,onSelect,onNew,filters,emptyLabel="Nothing yet."}){
  const total=groups.reduce((n,g)=>n+g.items.length,0);
  return <div style={{display:"flex",flexDirection:"column",gap:"var(--space-4)",
    borderRadius:"var(--radius-xl)",border:"1px solid var(--border)",background:"var(--surface-rail)",
    padding:"var(--space-4)"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--space-3)"}}>
      <h2 style={{margin:0,fontFamily:"var(--font-display)",fontSize:"var(--text-lg)",
        fontWeight:"var(--weight-semibold)",letterSpacing:"var(--tracking-snug)",color:"var(--text-heading)"}}>{title}</h2>
      {onNew?<Button size="sm" variant="outline" onClick={onNew}><Icon name="plus" size={16} />New</Button>:null}
    </div>
    {filters?<div style={{display:"flex",flexWrap:"wrap",gap:"var(--space-1-5)"}}>{filters}</div>:null}
    {total===0?<EmptyState>{emptyLabel}</EmptyState>:groups.map(g=>g.items.length?
      <section key={g.label} style={{display:"flex",flexDirection:"column",gap:"var(--space-1)"}}>
        <SectionHeading level="eyebrow">{g.label}</SectionHeading>
        <ul style={{display:"flex",flexDirection:"column",gap:"var(--space-0-5)",margin:0,padding:0,listStyle:"none"}}>
          {g.items.map(it=><li key={it.id}>
            <RailItem item={it} active={it.id===selected} onClick={()=>onSelect(it.id)} />
          </li>)}
        </ul>
      </section>:null)}
  </div>;
}

function RailItem({item,active,onClick}){
  const [h,setH]=React.useState(false);
  return <a onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--space-2)",
      borderRadius:"var(--radius-md)",padding:"var(--space-2) var(--space-3)",cursor:"pointer",
      textDecoration:"none",background:active?"var(--surface-selected)":h?"var(--slate-100)":"transparent",
      transition:"var(--transition-colors)"}}>
    <span style={{display:"flex",flexDirection:"column",gap:1,minWidth:0}}>
      <span style={{fontSize:"var(--text-sm)",fontWeight:active?"var(--weight-semibold)":"var(--weight-medium)",
        color:active||h?"var(--text-heading)":"var(--text-body)",overflow:"hidden",textOverflow:"ellipsis",
        whiteSpace:"nowrap"}}>{item.name}</span>
      {item.meta?<span style={{fontSize:"var(--text-xs)",color:"var(--text-muted)"}}>{item.meta}</span>:null}
    </span>
    {item.status?<Badge status={item.status} dot>{item.status}</Badge>:null}
    {item.favorite?<Icon name="star" size={14} color="var(--favorite)" />:null}
  </a>;
}
Object.assign(window,{ Rail });
