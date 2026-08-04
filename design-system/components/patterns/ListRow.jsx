import React from "react";

/* The app's most-repeated element: a bordered, full-width tappable row.
   Sessions, recipes, equipment, wizard choices and area cards are all this row. */
export function ListRow({title,meta,trailing,leading,selected=false,as="a",style,children,...rest}){
  const [h,setH]=React.useState(false);
  const Tag=as;
  return <Tag onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
    display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--space-3)",
    boxSizing:"border-box",width:"100%",textAlign:"left",
    borderRadius:"var(--radius)",border:"1px solid var(--border)",
    background:h||selected?"var(--accent)":"transparent",
    padding:"var(--space-3) var(--space-4)",
    fontFamily:"var(--font-sans)",fontSize:"var(--text-sm)",color:"var(--text-body)",
    textDecoration:"none",cursor:"pointer",transition:"var(--transition-colors)",...style}} {...rest}>
    <span style={{display:"flex",alignItems:"center",gap:"var(--space-2)",minWidth:0}}>
      {leading}
      <span style={{fontWeight:"var(--weight-medium)"}}>{title}</span>
      {meta?<span style={{color:"var(--text-muted)"}}>{meta}</span>:null}
      {children}
    </span>
    {trailing}
  </Tag>;
}
