const { Button, Icon } = window.CafJamestineDesignSystem_188632;

/* Global top bar — brand routes to the launchpad; three primary destinations.
   Equipment and Reference are low-frequency, so they sit in a quiet trailing group. */
const PRIMARY=[{key:"coffees",label:"Coffees"},{key:"sessions",label:"Sessions"},{key:"recipes",label:"Recipes"}];
const SECONDARY=[{key:"equipment",label:"Equipment"},{key:"reference",label:"Reference"}];

function AppShell({ route, go, subbar, children, wide=false }){
  return <div style={{display:"flex",minHeight:"100%",flex:1,flexDirection:"column",background:"var(--surface-page)"}}>
    <header style={{position:"sticky",top:0,zIndex:20,borderBottom:"1px solid var(--border)",
      background:"color-mix(in srgb,var(--background) 88%,transparent)",backdropFilter:"var(--blur-bar)"}}>
      <div style={{margin:"0 auto",display:"flex",height:"var(--topbar-height)",width:"100%",
        maxWidth:"var(--shell-max)",alignItems:"center",gap:"var(--space-6)",
        padding:"0 var(--shell-gutter)",boxSizing:"border-box"}}>
        <a onClick={()=>go("home")} style={{display:"flex",alignItems:"center",gap:"var(--space-2-5,0.625rem)",
          cursor:"pointer",textDecoration:"none"}}>
          <img src="../../assets/logo.svg" alt="" style={{width:22,display:"block"}} />
          <span style={{fontFamily:"var(--font-display)",fontSize:"var(--text-lg)",
            fontWeight:"var(--weight-semibold)",letterSpacing:"var(--tracking-snug)",
            color:"var(--text-heading)"}}>Café Jamestine</span>
        </a>
        <nav style={{display:"flex",alignItems:"center",gap:"var(--space-1)"}}>
          {PRIMARY.map(n=><NavLink key={n.key} active={route===n.key} onClick={()=>go(n.key)}>{n.label}</NavLink>)}
        </nav>
        <nav style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"var(--space-1)"}}>
          {SECONDARY.map(n=><NavLink key={n.key} quiet active={route===n.key} onClick={()=>go(n.key)}>{n.label}</NavLink>)}
          <span style={{width:1,height:20,margin:"0 var(--space-2)",background:"var(--border)"}} />
          <Button variant="ghost" size="sm" onClick={()=>go("login")}>Sign out</Button>
        </nav>
      </div>
    </header>
    {subbar?<div style={{position:"sticky",top:"var(--topbar-height)",zIndex:15,
      borderBottom:"1px solid var(--border)",background:"var(--surface-page)"}}>
      <div style={{margin:"0 auto",width:"100%",maxWidth:"var(--shell-max)",
        padding:"0 var(--shell-gutter)",boxSizing:"border-box"}}>{subbar}</div>
    </div>:null}
    <main style={{margin:"0 auto",width:"100%",maxWidth:"var(--shell-max)",flex:1,
      padding:"var(--space-8) var(--shell-gutter) var(--space-16)",boxSizing:"border-box"}}>
      <div style={{maxWidth:wide?"none":"var(--shell-max)"}}>{children}</div>
    </main>
  </div>;
}

function NavLink({active,quiet,onClick,children}){
  const [h,setH]=React.useState(false);
  return <a onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{borderRadius:"var(--radius-md)",padding:"var(--space-2) var(--space-3)",
      fontSize:quiet?"var(--text-sm)":"var(--text-base)",
      fontWeight:active?"var(--weight-semibold)":"var(--weight-medium)",cursor:"pointer",textDecoration:"none",
      background:active?"var(--surface-selected)":h?"var(--slate-100)":"transparent",
      color:active?"var(--indigo-700)":h?"var(--text-heading)":"var(--text-muted)",
      transition:"var(--transition-colors)"}}>{children}</a>;
}
Object.assign(window,{ AppShell });
