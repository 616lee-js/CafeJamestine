const { Button, Input, Label } = window.CafJamestineDesignSystem_188632;

function Login({ go }){
  return <div style={{display:"flex",minHeight:"100%",flex:1,alignItems:"stretch",background:"var(--surface-page)"}}>
    <div style={{flex:"1 1 40%",display:"none",background:"var(--indigo-600)",alignItems:"center",
      justifyContent:"center",padding:"var(--space-12)"}} className="cj-auth-art">
      <img src="../../assets/logo-reversed.svg" alt="" style={{width:220}} />
    </div>
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"var(--space-12) var(--shell-gutter)"}}>
      <div style={{width:"100%",maxWidth:"var(--form-measure)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"var(--space-3)",marginBottom:"var(--space-8)"}}>
          <img src="../../assets/logo.svg" alt="" style={{width:34}} />
          <span style={{fontFamily:"var(--font-display)",fontSize:"var(--text-xl)",
            fontWeight:"var(--weight-semibold)",letterSpacing:"var(--tracking-snug)",color:"var(--text-heading)"}}>
            Café Jamestine</span>
        </div>
        <h1 style={{marginBottom:"var(--space-6)",fontFamily:"var(--font-display)",fontSize:"var(--text-3xl)",
          fontWeight:"var(--weight-semibold)",letterSpacing:"var(--tracking-tight)"}}>Sign in</h1>
        <form onSubmit={e=>{e.preventDefault();go("home")}} style={{display:"flex",flexDirection:"column",gap:"var(--space-4)"}}>
          <div style={{display:"flex",flexDirection:"column",gap:"var(--space-1-5)"}}>
            <Label>Email</Label><Input size="touch" type="email" defaultValue="james@cafejamestine.app" />
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"var(--space-1-5)"}}>
            <Label>Password</Label><Input size="touch" type="password" defaultValue="········" />
          </div>
          <Button pill fullWidth size="touch" type="submit">Sign in</Button>
        </form>
        <p style={{marginTop:"var(--space-6)",textAlign:"center",fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>
          No account? <a style={{fontWeight:"var(--weight-medium)",cursor:"pointer"}}>Create one</a></p>
      </div>
    </div>
  </div>;
}
Object.assign(window,{ Login });
