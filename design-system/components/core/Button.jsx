import React from "react";

const VARIANTS = {
  default:{background:"var(--primary)",color:"var(--primary-foreground)",border:"1px solid transparent"},
  destructive:{background:"var(--destructive)",color:"#fff",border:"1px solid transparent"},
  outline:{background:"var(--background)",color:"var(--text-body)",border:"1px solid var(--border)",boxShadow:"var(--shadow-xs)"},
  secondary:{background:"var(--secondary)",color:"var(--secondary-foreground)",border:"1px solid transparent"},
  ghost:{background:"transparent",color:"var(--text-body)",border:"1px solid transparent"},
  link:{background:"transparent",color:"var(--primary)",border:"1px solid transparent",textUnderlineOffset:"4px"},
};
const HOVER = {
  default:{background:"var(--indigo-700)"},
  destructive:{filter:"brightness(0.92)"},
  outline:{background:"var(--accent)",color:"var(--accent-foreground)"},
  secondary:{background:"var(--indigo-100)"},
  ghost:{background:"var(--accent)",color:"var(--accent-foreground)"},
  link:{textDecoration:"underline"},
};
const SIZES = {
  xs:{height:"var(--control-xs)",padding:"0 var(--space-2)",fontSize:"var(--text-xs)",gap:"var(--space-1)",borderRadius:"var(--radius-md)"},
  sm:{height:"var(--control-sm)",padding:"0 var(--space-3)",fontSize:"var(--text-sm)",gap:"var(--space-1-5)",borderRadius:"var(--radius-md)"},
  default:{height:"var(--control-md)",padding:"0 var(--space-4)",fontSize:"var(--text-sm)",gap:"var(--space-2)",borderRadius:"var(--radius-md)"},
  lg:{height:"var(--control-lg)",padding:"0 var(--space-6)",fontSize:"var(--text-sm)",gap:"var(--space-2)",borderRadius:"var(--radius-md)"},
  hero:{height:"3.5rem",padding:"0 var(--space-8)",fontSize:"var(--text-base)",gap:"var(--space-2)",borderRadius:"var(--radius-md)"},
  touch:{height:"var(--control-touch)",padding:"0 var(--space-4)",fontSize:"var(--text-sm)",gap:"var(--space-2)",borderRadius:"var(--radius-md)"},
  icon:{height:"var(--control-md)",width:"var(--control-md)",padding:0,borderRadius:"var(--radius-md)"},
  "icon-xs":{height:"var(--control-xs)",width:"var(--control-xs)",padding:0,borderRadius:"var(--radius-md)"},
  "icon-sm":{height:"var(--control-sm)",width:"var(--control-sm)",padding:0,borderRadius:"var(--radius-md)"},
  "icon-lg":{height:"var(--control-lg)",width:"var(--control-lg)",padding:0,borderRadius:"var(--radius-md)"},
};

export function Button({variant="default",size="default",disabled=false,pill=false,fullWidth=false,as="button",style,children,...rest}){
  const [hover,setHover]=React.useState(false);
  const Tag = as;
  const s = {
    display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0,
    fontFamily:"var(--font-sans)",fontWeight:"var(--weight-medium)",whiteSpace:"nowrap",
    cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,
    transition:"var(--transition-colors)",textDecoration:"none",
    ...SIZES[size],...VARIANTS[variant],
    ...(hover&&!disabled?HOVER[variant]:null),
    ...(pill?{borderRadius:"var(--radius-full)"}:null),
    ...(fullWidth?{width:"100%"}:null),
    ...style,
  };
  return <Tag disabled={as==="button"?disabled:undefined} style={s}
    onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} {...rest}>{children}</Tag>;
}
