import React from "react";

export function Label({size="sm",style,children,...rest}){
  return <label style={{display:"flex",alignItems:"center",gap:"var(--space-2)",
    fontFamily:"var(--font-sans)",
    fontSize:size==="xs"?"var(--text-xs)":"var(--text-sm)",
    lineHeight:1,fontWeight:"var(--weight-medium)",
    color:size==="xs"?"var(--text-muted)":"var(--text-body)",
    userSelect:"none",...style}} {...rest}>{children}</label>;
}
