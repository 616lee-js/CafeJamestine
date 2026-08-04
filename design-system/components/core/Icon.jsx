import React from "react";

/* Lucide is the app's icon library (components.json → iconLibrary: "lucide").
   Load it once per page: <script src="https://unpkg.com/lucide@0.544.0/dist/umd/lucide.js"></script> */
export function Icon({name,size=16,strokeWidth=2,color="currentColor",style,...rest}){
  const ref=React.useRef(null);
  React.useEffect(()=>{
    const el=ref.current; if(!el||!window.lucide) return;
    el.innerHTML="";
    const node=document.createElement("i");
    node.setAttribute("data-lucide",name);
    el.appendChild(node);
    window.lucide.createIcons({attrs:{width:size,height:size,"stroke-width":strokeWidth},nameAttr:"data-lucide",root:el});
  },[name,size,strokeWidth]);
  return <span ref={ref} aria-hidden="true" style={{display:"inline-flex",flexShrink:0,width:size,height:size,color,...style}} {...rest}></span>;
}
