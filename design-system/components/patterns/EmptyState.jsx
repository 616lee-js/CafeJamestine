import React from "react";

export function EmptyState({children,style,...rest}){
  return <p style={{margin:0,fontSize:"var(--text-sm)",color:"var(--text-muted)",...style}} {...rest}>{children}</p>;
}
