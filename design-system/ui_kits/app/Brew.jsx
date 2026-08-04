const { Button, Icon, BrewParam } = window.CafJamestineDesignSystem_188632;

/* Brew mode: full-screen, read-only, distance-legible. No timer — the user's kit owns timing. */
function Brew({ go, session }){
  return <div style={{display:"flex",minHeight:"100%",flexDirection:"column",background:"var(--surface-page)"}}>
    <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"var(--space-4) var(--shell-gutter)",borderBottom:"1px solid var(--border)"}}>
      <a onClick={()=>go("session",session)} style={{display:"flex",alignItems:"center",gap:"var(--space-2)",
        fontSize:"var(--text-base)",color:"var(--text-muted)",cursor:"pointer"}}>
        <Icon name="arrow-left" size={18} />Back to Plan</a>
      <span style={{display:"flex",alignItems:"center",gap:"var(--space-2)",
        fontSize:"var(--text-sm)",fontWeight:"var(--weight-semibold)",textTransform:"uppercase",
        letterSpacing:"var(--tracking-wide)",color:"var(--phase-brew)"}}>
        <span style={{width:8,height:8,borderRadius:"var(--radius-full)",background:"var(--phase-brew)"}} />Brew</span>
    </header>

    <main style={{margin:"0 auto",width:"100%",maxWidth:"var(--brew-measure)",flex:1,
      padding:"var(--space-8) var(--shell-gutter) var(--space-16)",boxSizing:"border-box",
      display:"flex",flexDirection:"column",gap:"var(--space-10)"}}>
      <div style={{display:"flex",flexDirection:"column",gap:"var(--space-2)"}}>
        <h1 style={{margin:0,fontFamily:"var(--font-display)",fontSize:"var(--brew-title)",lineHeight:1.05,
          fontWeight:"var(--weight-semibold)",letterSpacing:"var(--tracking-tight)",color:"var(--text-heading)"}}>
          {session.title}</h1>
        <span style={{fontSize:"var(--text-lg)",color:"var(--text-muted)"}}>{session.method} · {session.grinder}</span>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:"var(--space-4)"}}>
        <BrewParam label="Dose" value={session.dose.toFixed?session.dose.toFixed(1):session.dose} unit="g" />
        <BrewParam label="Water" value={session.water} unit="g" />
        <BrewParam label="Temp" value={session.temp} unit="°C" />
        <BrewParam label="Grind" value={session.grind} />
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:"var(--space-4)"}}>
        <span className="eyebrow" style={{fontSize:"var(--brew-label)"}}>Pour steps</span>
        <ol style={{display:"flex",flexDirection:"column",gap:"var(--space-3)",margin:0,padding:0,listStyle:"none"}}>
          {session.steps.map((s,i)=><li key={i} style={{display:"grid",
            gridTemplateColumns:"5.5rem minmax(0,1fr) auto",alignItems:"center",gap:"var(--space-5)",
            borderRadius:"var(--radius-2xl)",border:"1px solid var(--border)",background:"var(--surface-card)",
            padding:"var(--space-4) var(--space-6)"}}>
            <span className="tabular" style={{fontFamily:"var(--font-display)",fontSize:"var(--brew-time)",
              lineHeight:1,fontWeight:"var(--weight-semibold)",color:"var(--phase-brew)"}}>{s.time}</span>
            <span style={{fontSize:"var(--brew-step)",lineHeight:1.3,color:"var(--text-heading)"}}>{s.description}</span>
            <span className="tabular" style={{fontSize:"var(--brew-step)",fontWeight:"var(--weight-semibold)",
              color:"var(--text-muted)",whiteSpace:"nowrap"}}>
              {s.weight!=null?s.weight+" g":""}{s.flow!=null?" · "+s.flow+" ml/s":""}</span>
          </li>)}
        </ol>
      </div>
    </main>

    <footer style={{position:"sticky",bottom:0,borderTop:"1px solid var(--border)",
      background:"color-mix(in srgb,var(--background) 94%,transparent)",backdropFilter:"var(--blur-bar)",
      padding:"var(--space-4) var(--shell-gutter)"}}>
      <div style={{margin:"0 auto",width:"100%",maxWidth:"var(--brew-measure)"}}>
        <Button size="hero" fullWidth onClick={()=>go("session",session)} style={{fontSize:"var(--text-lg)"}}>
          <Icon name="check" size={22} />Done brewing</Button>
      </div>
    </footer>
  </div>;
}
Object.assign(window,{ Brew });
