import React from "react";

export function Card({style,children,...rest}){
  return <div style={{display:"flex",flexDirection:"column",gap:"var(--space-6)",
    borderRadius:"var(--radius-xl)",border:"1px solid var(--border)",background:"var(--surface-card)",
    padding:"var(--space-6) 0",color:"var(--card-foreground)",boxShadow:"var(--shadow-sm)",...style}} {...rest}>{children}</div>;
}
export function CardHeader({action,title,description,style,children,...rest}){
  return <div style={{display:"grid",gridTemplateColumns:action?"1fr auto":"1fr",alignItems:"start",
    gap:"var(--space-2)",padding:"0 var(--space-6)",...style}} {...rest}>
    <div style={{display:"flex",flexDirection:"column",gap:"var(--space-1)"}}>
      {title?<div style={{fontSize:"var(--text-base)",lineHeight:1,fontWeight:"var(--weight-semibold)",color:"var(--text-heading)"}}>{title}</div>:null}
      {description?<div style={{fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>{description}</div>:null}
      {children}
    </div>
    {action?<div style={{justifySelf:"end"}}>{action}</div>:null}
  </div>;
}
export function CardContent({style,children,...rest}){
  return <div style={{padding:"0 var(--space-6)",...style}} {...rest}>{children}</div>;
}
export function CardFooter({style,children,...rest}){
  return <div style={{display:"flex",alignItems:"center",gap:"var(--space-2)",padding:"0 var(--space-6)",...style}} {...rest}>{children}</div>;
}
