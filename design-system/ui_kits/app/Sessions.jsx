const { Button, Badge, Icon, ListRow, SectionHeading, EmptyState, SplitPane } = window.CafJamestineDesignSystem_188632;

function Sessions({ go, sessions }){
  const active=sessions.filter(s=>s.status==="active");
  const history=sessions.filter(s=>s.status==="complete");
  const rail=<Rail title="Sessions" onNew={()=>go("new-session")}
    groups={[{label:"Active",items:active.map(s=>({id:s.id,name:s.title,meta:fmt(s.date),status:"active"}))},
             {label:"History",items:history.map(s=>({id:s.id,name:s.title,meta:fmt(s.date)}))}]}
    selected={sessions[0].id} onSelect={()=>go("session",sessions[0])} />;
  return <SplitPane list={rail}>
    <div style={{display:"flex",flexDirection:"column",gap:"var(--space-8)"}}>
      <SectionHeading level="page" action={<Button onClick={()=>go("new-session")}><Icon name="plus" size={16} />Start a session</Button>}>Sessions</SectionHeading>
      <Group label="Active" rows={active} go={go} empty="No active sessions." />
      {history.length?<Group label="History" rows={history} go={go} />:null}
    </div>
  </SplitPane>;
}
const fmt=d=>new Date(d+"T12:00:00").toLocaleDateString();

function Group({label,rows,go,empty}){
  return <section style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
    <SectionHeading level="eyebrow">{label}</SectionHeading>
    {rows.length===0?<EmptyState>{empty}</EmptyState>:
      <ul style={{display:"flex",flexDirection:"column",gap:"var(--space-2)",margin:0,padding:0,listStyle:"none"}}>
        {rows.map(s=><li key={s.id}><ListRow as="div" onClick={()=>go("session",s)}
          title={s.title}
          meta={[fmt(s.date),s.method,s.overall?s.overall+"/10":null].filter(Boolean).join(" · ")}
          trailing={<span style={{display:"flex",gap:"var(--space-2)"}}>
            <Badge variant="secondary">{s.type==="brewed_coffee"?"Brewed":"Specialty"}</Badge>
            <Badge status={s.status} dot={s.status==="active"}>{s.status}</Badge></span>} /></li>)}
      </ul>}
  </section>;
}
Object.assign(window,{ Sessions });
