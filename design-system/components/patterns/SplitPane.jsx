import React from "react";

/* List on the left that never unmounts, detail filling the rest. Stacks on narrow screens.
   Used by Coffees, Recipes and Sessions — the app's browsing shape. */
export function SplitPane({list,children,listWidth="var(--list-pane)",stacked=false,style,...rest}){
  if(stacked) return <div style={{display:"flex",flexDirection:"column",gap:"var(--space-6)",...style}} {...rest}>
    {list}<div style={{minWidth:0}}>{children}</div>
  </div>;
  return <div style={{display:"grid",gridTemplateColumns:listWidth+" minmax(0,1fr)",
    alignItems:"start",gap:"var(--space-8)",...style}} {...rest}>
    <aside style={{position:"sticky",top:"var(--space-6)",display:"flex",flexDirection:"column",
      gap:"var(--space-4)",maxHeight:"calc(100vh - var(--topbar-height) - var(--space-12))",
      overflowY:"auto"}}>{list}</aside>
    <div style={{minWidth:0,maxWidth:"var(--detail-measure)"}}>{children}</div>
  </div>;
}
