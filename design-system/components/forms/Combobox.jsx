import React from "react";
import { Icon } from "../core/Icon.jsx";
import { Button } from "../core/Button.jsx";

/* Searchable reference picker with inline create — the app's ReferenceSelect / CoffeeSelect. */
export function Combobox({value,valueName,options=[],placeholder="Select…",allowCreate=true,disabled=false,onChange,style}){
  const [open,setOpen]=React.useState(false);
  const [q,setQ]=React.useState("");
  const list=options.filter(o=>o.name.toLowerCase().includes(q.trim().toLowerCase()));
  const exact=options.some(o=>o.name.toLowerCase()===q.trim().toLowerCase());
  function pick(o){ onChange&&onChange(o?o.id:null,o?o.name:null); setOpen(false); setQ(""); }
  return <div style={{position:"relative",display:"flex",alignItems:"center",gap:"var(--space-1)",...style}}>
    <Button variant="outline" size="touch" disabled={disabled}
      onClick={()=>setOpen(v=>!v)}
      style={{flex:"1 1 0",minWidth:0,justifyContent:"space-between",fontWeight:"var(--weight-regular)"}}>
      <span style={{color:value?"var(--text-body)":"var(--text-muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{value?(valueName??"…"):placeholder}</span>
      <span style={{opacity:0.5,marginLeft:"var(--space-2)"}}><Icon name="chevrons-up-down" size={16} /></span>
    </Button>
    {value&&!disabled?<Button variant="ghost" size="icon" aria-label="Clear" onClick={()=>pick(null)}
      style={{height:"var(--control-touch)",width:"var(--control-touch)",color:"var(--text-muted)"}}><Icon name="x" size={16} /></Button>:null}
    {open?<div style={{position:"absolute",top:"calc(var(--control-touch) + 4px)",left:0,zIndex:50,width:"100%",
      borderRadius:"var(--radius-md)",border:"1px solid var(--border)",background:"var(--popover)",
      boxShadow:"var(--shadow-md)",overflow:"hidden"}}>
      <div style={{borderBottom:"1px solid var(--border)",padding:"var(--space-2) var(--space-3)"}}>
        <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search or type to add…"
          style={{width:"100%",border:"none",outline:"none",background:"transparent",
            fontFamily:"var(--font-sans)",fontSize:"var(--text-sm)",color:"var(--text-body)"}} />
      </div>
      <div style={{maxHeight:"14rem",overflowY:"auto",padding:"var(--space-1)"}}>
        {list.length===0&&!q.trim()?<p style={{margin:0,padding:"var(--space-2)",fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>No matches.</p>:null}
        {list.map(o=><Row key={o.id} selected={o.id===value} onClick={()=>pick(o)}>
          <span style={{marginRight:"var(--space-2)",opacity:o.id===value?1:0}}><Icon name="check" size={16} /></span>{o.name}
        </Row>)}
        {allowCreate&&q.trim()&&!exact?<Row onClick={()=>pick({id:"new",name:q.trim()})}>
          <span style={{marginRight:"var(--space-2)"}}><Icon name="plus" size={16} /></span>Add “{q.trim()}”
        </Row>:null}
      </div>
    </div>:null}
  </div>;
}

function Row({selected,onClick,children}){
  const [h,setH]=React.useState(false);
  return <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:"flex",alignItems:"center",borderRadius:"var(--radius-sm)",
      padding:"var(--space-1-5) var(--space-2)",fontSize:"var(--text-sm)",cursor:"default",
      color:"var(--text-body)",background:h||selected?"var(--accent)":"transparent"}}>{children}</div>;
}
