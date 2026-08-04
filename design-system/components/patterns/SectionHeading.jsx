import React from "react";

export function SectionHeading({level="section",action,style,children,...rest}){
  if(level==="eyebrow") return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",...style}} {...rest}>
    <h2 style={{fontSize:"var(--text-xs)",lineHeight:"var(--leading-xs)",fontWeight:"var(--weight-semibold)",
      textTransform:"uppercase",letterSpacing:"var(--tracking-wide)",color:"var(--text-eyebrow)"}}>{children}</h2>
    {action}
  </div>;
  const size=level==="page"?"var(--text-2xl)":level==="hero"?"var(--text-3xl)":"var(--text-lg)";
  const Tag=level==="section"?"h2":"h1";
  return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"var(--space-3)",...style}} {...rest}>
    <Tag style={{fontSize:size,lineHeight:1.2,fontWeight:"var(--weight-semibold)",
      letterSpacing:"var(--tracking-tight)",color:"var(--text-heading)"}}>{children}</Tag>
    {action}
  </div>;
}
