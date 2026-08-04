const D = window.CJ_DATA;

function App(){
  const [route,setRoute]=React.useState("home");
  const [session,setSession]=React.useState(D.sessions[0]);
  const [subbar,setSubbar]=React.useState(null);
  function go(r,payload){ if(payload) setSession(payload); setSubbar(null); setRoute(r); window.scrollTo(0,0) }

  if(route==="login") return <Login go={go} />;
  if(route==="brew") return <Brew go={go} session={session.steps?session:D.sessions[0]} />;

  let body=null;
  if(route==="home") body=<Landing go={go} resume={D.sessions[0]} />;
  else if(route==="sessions") body=<Sessions go={go} sessions={D.sessions} />;
  else if(route==="new-session") body=<NewSession go={go} coffees={D.coffees} recipes={D.recipes} sessions={D.sessions} />;
  else if(route==="session") body=<SessionWorkflow go={go} session={session.steps?session:D.sessions[0]}
    ingredients={D.ingredients} drinkSteps={D.drinkSteps} onSubbar={setSubbar} />;
  else if(route==="coffees") body=<Coffees go={go} coffees={D.coffees} />;
  else if(route==="recipes") body=<Recipes go={go} recipes={D.recipes} />;
  else if(route==="equipment") body=<Equipment equipment={D.equipment} />;
  else if(route==="reference") body=<Reference />;

  const navKey=route==="session"||route==="new-session"?"sessions":route;
  return <AppShell route={navKey} go={go} subbar={subbar}>{body}</AppShell>;
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
