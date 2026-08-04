/* @ds-bundle: {"format":4,"namespace":"CafJamestineDesignSystem_188632","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"CardHeader","sourcePath":"components/core/Card.jsx"},{"name":"CardContent","sourcePath":"components/core/Card.jsx"},{"name":"CardFooter","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Toast","sourcePath":"components/core/Toast.jsx"},{"name":"Combobox","sourcePath":"components/forms/Combobox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Label","sourcePath":"components/forms/Label.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"BrewParam","sourcePath":"components/patterns/BrewParam.jsx"},{"name":"ConfirmPanel","sourcePath":"components/patterns/ConfirmPanel.jsx"},{"name":"Dialog","sourcePath":"components/patterns/Dialog.jsx"},{"name":"EmptyState","sourcePath":"components/patterns/EmptyState.jsx"},{"name":"ListRow","sourcePath":"components/patterns/ListRow.jsx"},{"name":"PhaseStepper","sourcePath":"components/patterns/PhaseStepper.jsx"},{"name":"RatingControl","sourcePath":"components/patterns/RatingControl.jsx"},{"name":"SectionHeading","sourcePath":"components/patterns/SectionHeading.jsx"},{"name":"SplitPane","sourcePath":"components/patterns/SplitPane.jsx"},{"name":"StepsTable","sourcePath":"components/patterns/StepsTable.jsx"},{"name":"ViewRow","sourcePath":"components/patterns/ViewRow.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"e12b3a505f6e","components/core/Button.jsx":"87a4c8843359","components/core/Card.jsx":"6107e5c5452f","components/core/Icon.jsx":"fd1d2d93e435","components/core/Toast.jsx":"03990e90fcc5","components/forms/Combobox.jsx":"4691c35196cb","components/forms/Field.jsx":"a38280aad89d","components/forms/Input.jsx":"a987745a96d0","components/forms/Label.jsx":"f420aff6e418","components/forms/Select.jsx":"416db1ed09f3","components/forms/Switch.jsx":"0a79b5c339b0","components/forms/Textarea.jsx":"283b77abc6a0","components/patterns/BrewParam.jsx":"872e1ff503cc","components/patterns/ConfirmPanel.jsx":"b1f214e08e8c","components/patterns/Dialog.jsx":"ed94ce15ab7d","components/patterns/EmptyState.jsx":"8a5d26e47185","components/patterns/ListRow.jsx":"0f6042da7425","components/patterns/PhaseStepper.jsx":"2e4f8ce915dd","components/patterns/RatingControl.jsx":"76870546e0ca","components/patterns/SectionHeading.jsx":"f93d2d0cd20f","components/patterns/SplitPane.jsx":"67c22e138529","components/patterns/StepsTable.jsx":"046d471fe2cc","components/patterns/ViewRow.jsx":"6c58a1fe7146","ui_kits/app/App.jsx":"d2b889a8b9e1","ui_kits/app/AppShell.jsx":"2b95c7371132","ui_kits/app/Brew.jsx":"99e1f6b36fa0","ui_kits/app/Coffees.jsx":"3994bf5f0276","ui_kits/app/Equipment.jsx":"7dfcf397a306","ui_kits/app/Landing.jsx":"c76da9fdfcc9","ui_kits/app/Login.jsx":"bf23011c917f","ui_kits/app/NewSession.jsx":"d366ec11a09a","ui_kits/app/Rail.jsx":"ba80e08f9bdf","ui_kits/app/Recipes.jsx":"0289da99ca99","ui_kits/app/Reference.jsx":"608f129d17fe","ui_kits/app/SessionWorkflow.jsx":"609f47332a77","ui_kits/app/Sessions.jsx":"864b508357e3","ui_kits/app/data.js":"034ed47f211d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CafJamestineDesignSystem_188632 = window.CafJamestineDesignSystem_188632 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VARIANTS = {
  default: {
    background: "var(--primary)",
    color: "var(--primary-foreground)"
  },
  secondary: {
    background: "var(--secondary)",
    color: "var(--secondary-foreground)"
  },
  destructive: {
    background: "var(--destructive)",
    color: "#fff"
  },
  outline: {
    background: "transparent",
    color: "var(--text-body)",
    borderColor: "var(--border)"
  },
  ghost: {
    background: "transparent",
    color: "var(--text-muted)"
  }
};
/* Bag + session state. Indigo/lavender/mint family — never the coffee ramp. */
const STATUS = {
  frozen: {
    background: "var(--bag-frozen-soft)",
    color: "var(--bag-frozen)"
  },
  resting: {
    background: "var(--bag-resting-soft)",
    color: "var(--bag-resting)"
  },
  active: {
    background: "var(--bag-active-soft)",
    color: "var(--bag-active)"
  },
  finished: {
    background: "var(--bag-finished-soft)",
    color: "var(--bag-finished)"
  },
  complete: {
    background: "var(--session-complete-soft)",
    color: "var(--session-complete)"
  }
};
/* Session workflow phases — the coffee-lifecycle ramp, used only here. */
const PHASE = {
  plan: {
    background: "var(--phase-plan-soft)",
    color: "var(--phase-plan)"
  },
  brew: {
    background: "var(--phase-brew-soft)",
    color: "var(--phase-brew)"
  },
  make: {
    background: "var(--phase-brew-soft)",
    color: "var(--phase-brew)"
  },
  postbrew: {
    background: "var(--phase-post-soft)",
    color: "var(--phase-post)"
  },
  tasting: {
    background: "var(--phase-taste-soft)",
    color: "var(--phase-taste)"
  }
};
function Badge({
  variant = "default",
  status,
  phase,
  dot = false,
  style,
  children,
  ...rest
}) {
  const tone = phase ? PHASE[phase] : status ? STATUS[status] : VARIANTS[variant];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      width: "fit-content",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-1-5)",
      borderRadius: "var(--radius-full)",
      border: "1px solid transparent",
      padding: "0.1875rem 0.625rem",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-xs)",
      lineHeight: "var(--leading-xs)",
      fontWeight: "var(--weight-medium)",
      whiteSpace: "nowrap",
      ...tone,
      ...style
    }
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "var(--radius-full)",
      background: "currentColor"
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VARIANTS = {
  default: {
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    border: "1px solid transparent"
  },
  destructive: {
    background: "var(--destructive)",
    color: "#fff",
    border: "1px solid transparent"
  },
  outline: {
    background: "var(--background)",
    color: "var(--text-body)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow-xs)"
  },
  secondary: {
    background: "var(--secondary)",
    color: "var(--secondary-foreground)",
    border: "1px solid transparent"
  },
  ghost: {
    background: "transparent",
    color: "var(--text-body)",
    border: "1px solid transparent"
  },
  link: {
    background: "transparent",
    color: "var(--primary)",
    border: "1px solid transparent",
    textUnderlineOffset: "4px"
  }
};
const HOVER = {
  default: {
    background: "var(--indigo-700)"
  },
  destructive: {
    filter: "brightness(0.92)"
  },
  outline: {
    background: "var(--accent)",
    color: "var(--accent-foreground)"
  },
  secondary: {
    background: "var(--indigo-100)"
  },
  ghost: {
    background: "var(--accent)",
    color: "var(--accent-foreground)"
  },
  link: {
    textDecoration: "underline"
  }
};
const SIZES = {
  xs: {
    height: "var(--control-xs)",
    padding: "0 var(--space-2)",
    fontSize: "var(--text-xs)",
    gap: "var(--space-1)",
    borderRadius: "var(--radius-md)"
  },
  sm: {
    height: "var(--control-sm)",
    padding: "0 var(--space-3)",
    fontSize: "var(--text-sm)",
    gap: "var(--space-1-5)",
    borderRadius: "var(--radius-md)"
  },
  default: {
    height: "var(--control-md)",
    padding: "0 var(--space-4)",
    fontSize: "var(--text-sm)",
    gap: "var(--space-2)",
    borderRadius: "var(--radius-md)"
  },
  lg: {
    height: "var(--control-lg)",
    padding: "0 var(--space-6)",
    fontSize: "var(--text-sm)",
    gap: "var(--space-2)",
    borderRadius: "var(--radius-md)"
  },
  hero: {
    height: "3.5rem",
    padding: "0 var(--space-8)",
    fontSize: "var(--text-base)",
    gap: "var(--space-2)",
    borderRadius: "var(--radius-md)"
  },
  touch: {
    height: "var(--control-touch)",
    padding: "0 var(--space-4)",
    fontSize: "var(--text-sm)",
    gap: "var(--space-2)",
    borderRadius: "var(--radius-md)"
  },
  icon: {
    height: "var(--control-md)",
    width: "var(--control-md)",
    padding: 0,
    borderRadius: "var(--radius-md)"
  },
  "icon-xs": {
    height: "var(--control-xs)",
    width: "var(--control-xs)",
    padding: 0,
    borderRadius: "var(--radius-md)"
  },
  "icon-sm": {
    height: "var(--control-sm)",
    width: "var(--control-sm)",
    padding: 0,
    borderRadius: "var(--radius-md)"
  },
  "icon-lg": {
    height: "var(--control-lg)",
    width: "var(--control-lg)",
    padding: 0,
    borderRadius: "var(--radius-md)"
  }
};
function Button({
  variant = "default",
  size = "default",
  disabled = false,
  pill = false,
  fullWidth = false,
  as = "button",
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const Tag = as;
  const s = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontFamily: "var(--font-sans)",
    fontWeight: "var(--weight-medium)",
    whiteSpace: "nowrap",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "var(--transition-colors)",
    textDecoration: "none",
    ...SIZES[size],
    ...VARIANTS[variant],
    ...(hover && !disabled ? HOVER[variant] : null),
    ...(pill ? {
      borderRadius: "var(--radius-full)"
    } : null),
    ...(fullWidth ? {
      width: "100%"
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    disabled: as === "button" ? disabled : undefined,
    style: s,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)",
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--border)",
      background: "var(--surface-card)",
      padding: "var(--space-6) 0",
      color: "var(--card-foreground)",
      boxShadow: "var(--shadow-sm)",
      ...style
    }
  }, rest), children);
}
function CardHeader({
  action,
  title,
  description,
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "grid",
      gridTemplateColumns: action ? "1fr auto" : "1fr",
      alignItems: "start",
      gap: "var(--space-2)",
      padding: "0 var(--space-6)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1)"
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-base)",
      lineHeight: 1,
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-heading)"
    }
  }, title) : null, description ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, description) : null, children), action ? /*#__PURE__*/React.createElement("div", {
    style: {
      justifySelf: "end"
    }
  }, action) : null);
}
function CardContent({
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      padding: "0 var(--space-6)",
      ...style
    }
  }, rest), children);
}
function CardFooter({
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "0 var(--space-6)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card, CardHeader, CardContent, CardFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lucide is the app's icon library (components.json → iconLibrary: "lucide").
   Load it once per page: <script src="https://unpkg.com/lucide@0.544.0/dist/umd/lucide.js"></script> */
function Icon({
  name,
  size = 16,
  strokeWidth = 2,
  color = "currentColor",
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = "";
    const node = document.createElement("i");
    node.setAttribute("data-lucide", name);
    el.appendChild(node);
    window.lucide.createIcons({
      attrs: {
        width: size,
        height: size,
        "stroke-width": strokeWidth
      },
      nameAttr: "data-lucide",
      root: el
    });
  }, [name, size, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", _extends({
    ref: ref,
    "aria-hidden": "true",
    style: {
      display: "inline-flex",
      flexShrink: 0,
      width: size,
      height: size,
      color,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const KIND = {
  error: {
    color: "var(--destructive)",
    glyph: "octagon-x"
  },
  success: {
    color: "var(--success)",
    glyph: "circle-check"
  },
  info: {
    color: "var(--text-muted)",
    glyph: "info"
  },
  loading: {
    color: "var(--text-muted)",
    glyph: "loader-2"
  }
};
function Toast({
  kind = "error",
  title,
  description,
  style,
  ...rest
}) {
  const k = KIND[kind];
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "var(--space-3)",
      width: "22rem",
      maxWidth: "100%",
      borderRadius: "var(--radius)",
      border: "1px solid var(--border)",
      background: "var(--popover)",
      color: "var(--popover-foreground)",
      padding: "var(--space-4)",
      boxShadow: "var(--shadow-lg)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: "1px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: k.glyph,
    size: 16,
    color: k.color
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--weight-medium)"
    }
  }, title), description ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)"
    }
  }, description) : null));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Combobox.jsx
try { (() => {
/* Searchable reference picker with inline create — the app's ReferenceSelect / CoffeeSelect. */
function Combobox({
  value,
  valueName,
  options = [],
  placeholder = "Select…",
  allowCreate = true,
  disabled = false,
  onChange,
  style
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const list = options.filter(o => o.name.toLowerCase().includes(q.trim().toLowerCase()));
  const exact = options.some(o => o.name.toLowerCase() === q.trim().toLowerCase());
  function pick(o) {
    onChange && onChange(o ? o.id : null, o ? o.name : null);
    setOpen(false);
    setQ("");
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: "var(--space-1)",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "touch",
    disabled: disabled,
    onClick: () => setOpen(v => !v),
    style: {
      flex: "1 1 0",
      minWidth: 0,
      justifyContent: "space-between",
      fontWeight: "var(--weight-regular)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: value ? "var(--text-body)" : "var(--text-muted)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, value ? valueName ?? "…" : placeholder), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.5,
      marginLeft: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevrons-up-down",
    size: 16
  }))), value && !disabled ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "icon",
    "aria-label": "Clear",
    onClick: () => pick(null),
    style: {
      height: "var(--control-touch)",
      width: "var(--control-touch)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16
  })) : null, open ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "calc(var(--control-touch) + 4px)",
      left: 0,
      zIndex: 50,
      width: "100%",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border)",
      background: "var(--popover)",
      boxShadow: "var(--shadow-md)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: "1px solid var(--border)",
      padding: "var(--space-2) var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search or type to add\u2026",
    style: {
      width: "100%",
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--text-body)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: "14rem",
      overflowY: "auto",
      padding: "var(--space-1)"
    }
  }, list.length === 0 && !q.trim() ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      padding: "var(--space-2)",
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, "No matches.") : null, list.map(o => /*#__PURE__*/React.createElement(Row, {
    key: o.id,
    selected: o.id === value,
    onClick: () => pick(o)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginRight: "var(--space-2)",
      opacity: o.id === value ? 1 : 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 16
  })), o.name)), allowCreate && q.trim() && !exact ? /*#__PURE__*/React.createElement(Row, {
    onClick: () => pick({
      id: "new",
      name: q.trim()
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginRight: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 16
  })), "Add \u201C", q.trim(), "\u201D") : null)) : null);
}
function Row({
  selected,
  onClick,
  children
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      alignItems: "center",
      borderRadius: "var(--radius-sm)",
      padding: "var(--space-1-5) var(--space-2)",
      fontSize: "var(--text-sm)",
      cursor: "default",
      color: "var(--text-body)",
      background: h || selected ? "var(--accent)" : "transparent"
    }
  }, children);
}
Object.assign(__ds_scope, { Combobox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Combobox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  size = "md",
  prefix,
  invalid = false,
  disabled = false,
  align,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const height = size === "sm" ? "var(--control-sm)" : size === "lg" ? "var(--control-lg)" : size === "touch" ? "var(--control-touch)" : "var(--control-md)";
  const control = /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      height,
      width: "100%",
      minWidth: 0,
      boxSizing: "border-box",
      borderRadius: "var(--radius-md)",
      border: `1px solid ${invalid ? "var(--destructive)" : focus ? "var(--ring)" : "var(--input)"}`,
      background: "transparent",
      color: "var(--text-body)",
      padding: prefix ? "0 var(--space-3) 0 1.75rem" : "0 var(--space-3)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      boxShadow: focus ? `0 0 0 var(--ring-width) color-mix(in oklab,var(--ring) 50%,transparent)` : "var(--shadow-xs)",
      outline: "none",
      transition: "var(--transition-colors)",
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? "not-allowed" : "text",
      textAlign: align,
      ...style
    }
  }, rest));
  if (!prefix) return control;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "var(--space-3)",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: "var(--text-muted)",
      fontSize: "var(--text-sm)"
    }
  }, prefix), control);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Label.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Label({
  size = "sm",
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      fontFamily: "var(--font-sans)",
      fontSize: size === "xs" ? "var(--text-xs)" : "var(--text-sm)",
      lineHeight: 1,
      fontWeight: "var(--weight-medium)",
      color: size === "xs" ? "var(--text-muted)" : "var(--text-body)",
      userSelect: "none",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Label });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Label.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Field({
  label,
  hint,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1-5)",
      ...style
    }
  }, rest), label ? /*#__PURE__*/React.createElement(__ds_scope.Label, null, label) : null, children, hint ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-xs)",
      lineHeight: "var(--leading-xs)",
      color: "var(--text-muted)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  size = "md",
  placeholder = "Select…",
  value,
  options = [],
  disabled = false,
  onChange,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const height = size === "sm" ? "var(--control-sm)" : size === "touch" ? "var(--control-touch)" : "var(--control-md)";
  const empty = value == null || value === "";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      ...style
    }
  }, /*#__PURE__*/React.createElement("select", _extends({}, onChange ? {
    value: value ?? "",
    onChange
  } : {
    defaultValue: value ?? ""
  }, {
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: "none",
      height,
      width: "100%",
      boxSizing: "border-box",
      borderRadius: "var(--radius-md)",
      border: `1px solid ${focus ? "var(--ring)" : "var(--input)"}`,
      background: "transparent",
      color: empty ? "var(--text-muted)" : "var(--text-body)",
      padding: "0 2rem 0 var(--space-3)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      boxShadow: focus ? "0 0 0 var(--ring-width) color-mix(in oklab,var(--ring) 50%,transparent)" : "var(--shadow-xs)",
      outline: "none",
      transition: "var(--transition-colors)",
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? "not-allowed" : "pointer"
    }
  }, rest), /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: "var(--space-3)",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      opacity: 0.5
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  checked = false,
  size = "default",
  disabled = false,
  onChange,
  style,
  ...rest
}) {
  const w = size === "sm" ? "1.5rem" : "2rem",
    h = size === "sm" ? "0.875rem" : "1.15rem",
    t = size === "sm" ? "0.75rem" : "1rem";
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: () => onChange && onChange(!checked),
    style: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      width: w,
      height: h,
      padding: 0,
      border: "1px solid transparent",
      borderRadius: "var(--radius-full)",
      background: checked ? "var(--primary)" : "var(--input)",
      boxShadow: "var(--shadow-xs)",
      transition: "var(--transition-colors)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      width: t,
      height: t,
      borderRadius: "var(--radius-full)",
      background: "var(--background)",
      transform: checked ? `translateX(calc(${w} - ${t} - 2px))` : "translateX(0)",
      transition: `transform var(--duration-base) var(--ease-standard)`
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  minHeight = "5rem",
  invalid = false,
  disabled = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("textarea", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      display: "flex",
      width: "100%",
      minHeight,
      boxSizing: "border-box",
      resize: "vertical",
      borderRadius: "var(--radius-md)",
      border: `1px solid ${invalid ? "var(--destructive)" : focus ? "var(--ring)" : "var(--input)"}`,
      background: "transparent",
      color: "var(--text-body)",
      padding: "var(--space-2) var(--space-3)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      lineHeight: "var(--leading-sm)",
      boxShadow: focus ? "0 0 0 var(--ring-width) color-mix(in oklab,var(--ring) 50%,transparent)" : "var(--shadow-xs)",
      outline: "none",
      transition: "var(--transition-colors)",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/patterns/BrewParam.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* One parameter, sized to be read from an eye-level mount or an angled stand at 1–2 feet. */
function BrewParam({
  label,
  value,
  unit,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      borderRadius: "var(--radius-3xl)",
      border: "1px solid var(--border)",
      background: "var(--surface-card)",
      padding: "var(--space-5) var(--space-6)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--brew-label)",
      lineHeight: 1,
      fontWeight: "var(--weight-semibold)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--text-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "var(--space-2)",
      fontFamily: "var(--font-display)",
      fontSize: "var(--brew-value)",
      lineHeight: 1,
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-tight)",
      fontVariantNumeric: "tabular-nums",
      color: "var(--text-heading)"
    }
  }, value, unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xl)",
      fontWeight: "var(--weight-medium)",
      color: "var(--text-muted)"
    }
  }, unit) : null));
}
Object.assign(__ds_scope, { BrewParam });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/BrewParam.jsx", error: String((e && e.message) || e) }); }

// components/patterns/ConfirmPanel.jsx
try { (() => {
/* Inline commitment gate — the app confirms consequential actions in place, not in a modal,
   when the action is a forward step (Mark complete). Modals are for destructive actions. */
function ConfirmPanel({
  message,
  confirmLabel = "Confirm",
  confirmIcon,
  onConfirm,
  onCancel,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      borderRadius: "var(--radius)",
      border: "1px solid var(--border)",
      padding: "var(--space-4)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      color: "var(--text-body)"
    }
  }, message), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    onClick: onConfirm
  }, confirmIcon, confirmLabel)));
}
Object.assign(__ds_scope, { ConfirmPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/ConfirmPanel.jsx", error: String((e && e.message) || e) }); }

// components/patterns/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  description,
  footer,
  onClose,
  style,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--overlay)",
      padding: "var(--space-4)"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: "relative",
      display: "grid",
      gap: "var(--space-4)",
      width: "100%",
      maxWidth: "32rem",
      borderRadius: "var(--radius)",
      border: "1px solid var(--border)",
      background: "var(--background)",
      padding: "var(--space-6)",
      boxShadow: "var(--shadow-lg)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, title ? /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--text-lg)",
      lineHeight: 1,
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-heading)"
    }
  }, title) : null, description ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, description) : null), children, footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "var(--space-2)"
    }
  }, footer) : null));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/patterns/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function EmptyState({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("p", _extends({
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/patterns/ListRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The app's most-repeated element: a bordered, full-width tappable row.
   Sessions, recipes, equipment, wizard choices and area cards are all this row. */
function ListRow({
  title,
  meta,
  trailing,
  leading,
  selected = false,
  as = "a",
  style,
  children,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-3)",
      boxSizing: "border-box",
      width: "100%",
      textAlign: "left",
      borderRadius: "var(--radius)",
      border: "1px solid var(--border)",
      background: h || selected ? "var(--accent)" : "transparent",
      padding: "var(--space-3) var(--space-4)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--text-body)",
      textDecoration: "none",
      cursor: "pointer",
      transition: "var(--transition-colors)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      minWidth: 0
    }
  }, leading, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--weight-medium)"
    }
  }, title), meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)"
    }
  }, meta) : null, children), trailing);
}
Object.assign(__ds_scope, { ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/ListRow.jsx", error: String((e && e.message) || e) }); }

// components/patterns/PhaseStepper.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const RAMP = {
  plan: {
    c: "var(--phase-plan)",
    soft: "var(--phase-plan-soft)"
  },
  brew: {
    c: "var(--phase-brew)",
    soft: "var(--phase-brew-soft)"
  },
  make: {
    c: "var(--phase-brew)",
    soft: "var(--phase-brew-soft)"
  },
  postbrew: {
    c: "var(--phase-post)",
    soft: "var(--phase-post-soft)"
  },
  tasting: {
    c: "var(--phase-taste)",
    soft: "var(--phase-taste-soft)"
  }
};

/* Session workflow spine. Phase labels double as tabs; the ramp shows progress at a glance. */
function PhaseStepper({
  phases = [],
  value,
  done = [],
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      minHeight: "var(--subbar-height)",
      borderBottom: "1px solid var(--border)",
      ...style
    }
  }, rest), phases.map((p, i) => {
    const ramp = RAMP[p.value] || RAMP.plan;
    const prev = i ? RAMP[phases[i - 1].value] || ramp : ramp;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: p.value
    }, i ? /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        width: "var(--space-8)",
        height: 2,
        flexShrink: 0,
        opacity: 0.55,
        background: "linear-gradient(90deg," + prev.c + "," + ramp.c + ")"
      }
    }) : null, /*#__PURE__*/React.createElement(Tab, {
      tab: p,
      ramp: ramp,
      active: p.value === value,
      complete: done.includes(p.value),
      index: i,
      onClick: () => onChange && onChange(p.value)
    }));
  }));
}
function Tab({
  tab,
  ramp,
  active,
  complete,
  index,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    "aria-current": active ? "step" : undefined,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-2)",
      marginBottom: -1,
      border: "none",
      borderBottom: "3px solid " + (active ? ramp.c : "transparent"),
      background: "transparent",
      padding: "var(--space-3) var(--space-4)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      fontWeight: active ? "var(--weight-semibold)" : "var(--weight-medium)",
      color: active || h ? "var(--text-heading)" : "var(--text-muted)",
      cursor: "pointer",
      transition: "var(--transition-colors)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "1.5rem",
      height: "1.5rem",
      flexShrink: 0,
      borderRadius: "var(--radius-full)",
      border: "2px solid " + ramp.c,
      background: active || complete ? ramp.c : "transparent",
      color: active || complete ? "#fff" : ramp.c,
      fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-semibold)",
      fontVariantNumeric: "tabular-nums"
    }
  }, complete && !active ? "\u2713" : index + 1), tab.label);
}
Object.assign(__ds_scope, { PhaseStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/PhaseStepper.jsx", error: String((e && e.message) || e) }); }

// components/patterns/RatingControl.jsx
try { (() => {
/* 1–5 prominence picker. Selected number flips to the filled variant; clicking it again clears. */
function RatingControl({
  value = null,
  readOnly = false,
  max = 5,
  onChange,
  style
}) {
  if (readOnly) return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)",
      ...style
    }
  }, value != null ? `${value}/${max}` : "—");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-1)",
      ...style
    }
  }, Array.from({
    length: max
  }, (_, i) => i + 1).map(n => /*#__PURE__*/React.createElement(__ds_scope.Button, {
    key: n,
    size: "icon-sm",
    variant: value === n ? "default" : "outline",
    onClick: () => onChange && onChange(value === n ? null : n)
  }, n)));
}
Object.assign(__ds_scope, { RatingControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/RatingControl.jsx", error: String((e && e.message) || e) }); }

// components/patterns/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHeading({
  level = "section",
  action,
  style,
  children,
  ...rest
}) {
  if (level === "eyebrow") return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--text-xs)",
      lineHeight: "var(--leading-xs)",
      fontWeight: "var(--weight-semibold)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--text-eyebrow)"
    }
  }, children), action);
  const size = level === "page" ? "var(--text-2xl)" : level === "hero" ? "var(--text-3xl)" : "var(--text-lg)";
  const Tag = level === "section" ? "h2" : "h1";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-3)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(Tag, {
    style: {
      fontSize: size,
      lineHeight: 1.2,
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-tight)",
      color: "var(--text-heading)"
    }
  }, children), action);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/patterns/SplitPane.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* List on the left that never unmounts, detail filling the rest. Stacks on narrow screens.
   Used by Coffees, Recipes and Sessions — the app's browsing shape. */
function SplitPane({
  list,
  children,
  listWidth = "var(--list-pane)",
  stacked = false,
  style,
  ...rest
}) {
  if (stacked) return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)",
      ...style
    }
  }, rest), list, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, children));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "grid",
      gridTemplateColumns: listWidth + " minmax(0,1fr)",
      alignItems: "start",
      gap: "var(--space-8)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "sticky",
      top: "var(--space-6)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      maxHeight: "calc(100vh - var(--topbar-height) - var(--space-12))",
      overflowY: "auto"
    }
  }, list), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      maxWidth: "var(--detail-measure)"
    }
  }, children));
}
Object.assign(__ds_scope, { SplitPane });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/SplitPane.jsx", error: String((e && e.message) || e) }); }

// components/patterns/StepsTable.jsx
try { (() => {
/* Read-mode brew steps. Brewed coffee → structured table; specialty → numbered prose list. */
function StepsTable({
  steps = [],
  mode = "brewed_coffee",
  style
}) {
  if (steps.length === 0) return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)",
      ...style
    }
  }, "None.");
  if (mode === "specialty_drink") return /*#__PURE__*/React.createElement("ol", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      margin: 0,
      padding: 0,
      listStyle: "none",
      ...style
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      borderRadius: "var(--radius)",
      border: "1px solid var(--border)",
      padding: "var(--space-2) var(--space-3)",
      fontSize: "var(--text-sm)",
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginRight: "var(--space-2)",
      fontWeight: "var(--weight-medium)",
      color: "var(--text-muted)"
    }
  }, i + 1, "."), s.description)));
  const th = {
    padding: "var(--space-2) var(--space-3)",
    fontWeight: "var(--weight-medium)",
    textAlign: "left"
  };
  const td = {
    padding: "var(--space-2) var(--space-3)",
    fontVariantNumeric: "tabular-nums"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto",
      borderRadius: "var(--radius)",
      border: "1px solid var(--border)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "var(--text-sm)"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: "1px solid var(--border)",
      fontSize: "var(--text-xs)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Time"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Description"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Total weight"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Flow rate"))), /*#__PURE__*/React.createElement("tbody", null, steps.map((s, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderBottom: i === steps.length - 1 ? "none" : "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, s.time || "—"), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontVariantNumeric: "normal"
    }
  }, s.description || "—"), /*#__PURE__*/React.createElement("td", {
    style: td
  }, s.weight != null ? `${s.weight} g` : "—"), /*#__PURE__*/React.createElement("td", {
    style: td
  }, s.flow != null ? `${s.flow} ml/s` : "—"))))));
}
Object.assign(__ds_scope, { StepsTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/StepsTable.jsx", error: String((e && e.message) || e) }); }

// components/patterns/ViewRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Read-only label/value pair. Renders nothing when empty — read views show filled fields only. */
function ViewRow({
  label,
  value,
  style,
  ...rest
}) {
  if (value == null || value === "") return null;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.125rem",
      padding: "var(--space-1-5) 0",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      lineHeight: "var(--leading-xs)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--text-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: "pre-wrap",
      fontSize: "var(--text-sm)",
      color: "var(--text-body)"
    }
  }, value));
}
Object.assign(__ds_scope, { ViewRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/ViewRow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/App.jsx
try { (() => {
const D = window.CJ_DATA;
function App() {
  const [route, setRoute] = React.useState("home");
  const [session, setSession] = React.useState(D.sessions[0]);
  const [subbar, setSubbar] = React.useState(null);
  function go(r, payload) {
    if (payload) setSession(payload);
    setSubbar(null);
    setRoute(r);
    window.scrollTo(0, 0);
  }
  if (route === "login") return /*#__PURE__*/React.createElement(Login, {
    go: go
  });
  if (route === "brew") return /*#__PURE__*/React.createElement(Brew, {
    go: go,
    session: session.steps ? session : D.sessions[0]
  });
  let body = null;
  if (route === "home") body = /*#__PURE__*/React.createElement(Landing, {
    go: go,
    resume: D.sessions[0]
  });else if (route === "sessions") body = /*#__PURE__*/React.createElement(Sessions, {
    go: go,
    sessions: D.sessions
  });else if (route === "new-session") body = /*#__PURE__*/React.createElement(NewSession, {
    go: go,
    coffees: D.coffees,
    recipes: D.recipes,
    sessions: D.sessions
  });else if (route === "session") body = /*#__PURE__*/React.createElement(SessionWorkflow, {
    go: go,
    session: session.steps ? session : D.sessions[0],
    ingredients: D.ingredients,
    drinkSteps: D.drinkSteps,
    onSubbar: setSubbar
  });else if (route === "coffees") body = /*#__PURE__*/React.createElement(Coffees, {
    go: go,
    coffees: D.coffees
  });else if (route === "recipes") body = /*#__PURE__*/React.createElement(Recipes, {
    go: go,
    recipes: D.recipes
  });else if (route === "equipment") body = /*#__PURE__*/React.createElement(Equipment, {
    equipment: D.equipment
  });else if (route === "reference") body = /*#__PURE__*/React.createElement(Reference, null);
  const navKey = route === "session" || route === "new-session" ? "sessions" : route;
  return /*#__PURE__*/React.createElement(AppShell, {
    route: navKey,
    go: go,
    subbar: subbar
  }, body);
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
const {
  Button,
  Icon
} = window.CafJamestineDesignSystem_188632;

/* Global top bar — brand routes to the launchpad; three primary destinations.
   Equipment and Reference are low-frequency, so they sit in a quiet trailing group. */
const PRIMARY = [{
  key: "coffees",
  label: "Coffees"
}, {
  key: "sessions",
  label: "Sessions"
}, {
  key: "recipes",
  label: "Recipes"
}];
const SECONDARY = [{
  key: "equipment",
  label: "Equipment"
}, {
  key: "reference",
  label: "Reference"
}];
function AppShell({
  route,
  go,
  subbar,
  children,
  wide = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      minHeight: "100%",
      flex: 1,
      flexDirection: "column",
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      borderBottom: "1px solid var(--border)",
      background: "color-mix(in srgb,var(--background) 88%,transparent)",
      backdropFilter: "var(--blur-bar)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "0 auto",
      display: "flex",
      height: "var(--topbar-height)",
      width: "100%",
      maxWidth: "var(--shell-max)",
      alignItems: "center",
      gap: "var(--space-6)",
      padding: "0 var(--shell-gutter)",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => go("home"),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2-5,0.625rem)",
      cursor: "pointer",
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.svg",
    alt: "",
    style: {
      width: 22,
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-lg)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-snug)",
      color: "var(--text-heading)"
    }
  }, "Caf\xE9 Jamestine")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-1)"
    }
  }, PRIMARY.map(n => /*#__PURE__*/React.createElement(NavLink, {
    key: n.key,
    active: route === n.key,
    onClick: () => go(n.key)
  }, n.label))), /*#__PURE__*/React.createElement("nav", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: "var(--space-1)"
    }
  }, SECONDARY.map(n => /*#__PURE__*/React.createElement(NavLink, {
    key: n.key,
    quiet: true,
    active: route === n.key,
    onClick: () => go(n.key)
  }, n.label)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 20,
      margin: "0 var(--space-2)",
      background: "var(--border)"
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => go("login")
  }, "Sign out")))), subbar ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: "var(--topbar-height)",
      zIndex: 15,
      borderBottom: "1px solid var(--border)",
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "0 auto",
      width: "100%",
      maxWidth: "var(--shell-max)",
      padding: "0 var(--shell-gutter)",
      boxSizing: "border-box"
    }
  }, subbar)) : null, /*#__PURE__*/React.createElement("main", {
    style: {
      margin: "0 auto",
      width: "100%",
      maxWidth: "var(--shell-max)",
      flex: 1,
      padding: "var(--space-8) var(--shell-gutter) var(--space-16)",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: wide ? "none" : "var(--shell-max)"
    }
  }, children)));
}
function NavLink({
  active,
  quiet,
  onClick,
  children
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      borderRadius: "var(--radius-md)",
      padding: "var(--space-2) var(--space-3)",
      fontSize: quiet ? "var(--text-sm)" : "var(--text-base)",
      fontWeight: active ? "var(--weight-semibold)" : "var(--weight-medium)",
      cursor: "pointer",
      textDecoration: "none",
      background: active ? "var(--surface-selected)" : h ? "var(--slate-100)" : "transparent",
      color: active ? "var(--indigo-700)" : h ? "var(--text-heading)" : "var(--text-muted)",
      transition: "var(--transition-colors)"
    }
  }, children);
}
Object.assign(window, {
  AppShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Brew.jsx
try { (() => {
const {
  Button,
  Icon,
  BrewParam
} = window.CafJamestineDesignSystem_188632;

/* Brew mode: full-screen, read-only, distance-legible. No timer — the user's kit owns timing. */
function Brew({
  go,
  session
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      minHeight: "100%",
      flexDirection: "column",
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "var(--space-4) var(--shell-gutter)",
      borderBottom: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => go("session", session),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      fontSize: "var(--text-base)",
      color: "var(--text-muted)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 18
  }), "Back to Plan"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-semibold)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--phase-brew)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "var(--radius-full)",
      background: "var(--phase-brew)"
    }
  }), "Brew")), /*#__PURE__*/React.createElement("main", {
    style: {
      margin: "0 auto",
      width: "100%",
      maxWidth: "var(--brew-measure)",
      flex: 1,
      padding: "var(--space-8) var(--shell-gutter) var(--space-16)",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-10)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "var(--brew-title)",
      lineHeight: 1.05,
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-tight)",
      color: "var(--text-heading)"
    }
  }, session.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-lg)",
      color: "var(--text-muted)"
    }
  }, session.method, " \xB7 ", session.grinder)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,minmax(0,1fr))",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(BrewParam, {
    label: "Dose",
    value: session.dose.toFixed ? session.dose.toFixed(1) : session.dose,
    unit: "g"
  }), /*#__PURE__*/React.createElement(BrewParam, {
    label: "Water",
    value: session.water,
    unit: "g"
  }), /*#__PURE__*/React.createElement(BrewParam, {
    label: "Temp",
    value: session.temp,
    unit: "\xB0C"
  }), /*#__PURE__*/React.createElement(BrewParam, {
    label: "Grind",
    value: session.grind
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      fontSize: "var(--brew-label)"
    }
  }, "Pour steps"), /*#__PURE__*/React.createElement("ol", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  }, session.steps.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: "5.5rem minmax(0,1fr) auto",
      alignItems: "center",
      gap: "var(--space-5)",
      borderRadius: "var(--radius-2xl)",
      border: "1px solid var(--border)",
      background: "var(--surface-card)",
      padding: "var(--space-4) var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tabular",
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--brew-time)",
      lineHeight: 1,
      fontWeight: "var(--weight-semibold)",
      color: "var(--phase-brew)"
    }
  }, s.time), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--brew-step)",
      lineHeight: 1.3,
      color: "var(--text-heading)"
    }
  }, s.description), /*#__PURE__*/React.createElement("span", {
    className: "tabular",
    style: {
      fontSize: "var(--brew-step)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-muted)",
      whiteSpace: "nowrap"
    }
  }, s.weight != null ? s.weight + " g" : "", s.flow != null ? " · " + s.flow + " ml/s" : "")))))), /*#__PURE__*/React.createElement("footer", {
    style: {
      position: "sticky",
      bottom: 0,
      borderTop: "1px solid var(--border)",
      background: "color-mix(in srgb,var(--background) 94%,transparent)",
      backdropFilter: "var(--blur-bar)",
      padding: "var(--space-4) var(--shell-gutter)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "0 auto",
      width: "100%",
      maxWidth: "var(--brew-measure)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "hero",
    fullWidth: true,
    onClick: () => go("session", session),
    style: {
      fontSize: "var(--text-lg)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 22
  }), "Done brewing"))));
}
Object.assign(window, {
  Brew
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Brew.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Coffees.jsx
try { (() => {
const {
  Button,
  Badge,
  Icon,
  Field,
  Input,
  Textarea,
  Select,
  Combobox,
  SplitPane,
  SectionHeading,
  ViewRow,
  ListRow,
  EmptyState,
  Card,
  CardHeader,
  CardContent
} = window.CafJamestineDesignSystem_188632;
const GROUPS = [["active", "Active"], ["storage", "Storage"], ["history", "History"]];
function Coffees({
  go,
  coffees
}) {
  const [selected, setSelected] = React.useState(coffees[0].id);
  const [mode, setMode] = React.useState("view");
  const [incomplete, setIncomplete] = React.useState(false);
  const coffee = coffees.find(c => c.id === selected);
  const groups = GROUPS.map(([g, label]) => ({
    label,
    items: coffees.filter(c => c.group === g).map(c => ({
      id: c.id,
      name: c.name,
      meta: c.roaster,
      status: c.bags[0] && c.bags[0].status
    }))
  }));
  const rail = /*#__PURE__*/React.createElement(Rail, {
    title: "Coffees",
    groups: incomplete ? [{
      label: "Incomplete",
      items: []
    }] : groups,
    selected: selected,
    onSelect: id => {
      setSelected(id);
      setMode("view");
    },
    onNew: () => setMode("edit"),
    emptyLabel: "No incomplete coffees.",
    filters: /*#__PURE__*/React.createElement(Button, {
      size: "xs",
      variant: incomplete ? "default" : "outline",
      onClick: () => setIncomplete(v => !v)
    }, "Incomplete (0)")
  });
  return /*#__PURE__*/React.createElement(SplitPane, {
    list: rail
  }, mode === "view" ? /*#__PURE__*/React.createElement(CoffeeView, {
    coffee: coffee,
    onEdit: () => setMode("edit"),
    go: go
  }) : /*#__PURE__*/React.createElement(CoffeeEdit, {
    coffee: coffee,
    onDone: () => setMode("view")
  }));
}
function CoffeeView({
  coffee,
  onEdit,
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-10)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      width: 96,
      height: 96,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--border)",
      background: "var(--muted)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "image-plus",
    size: 24,
    color: "var(--text-muted)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-3xl)",
      lineHeight: 1.1,
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-tight)",
      color: "var(--text-heading)"
    }
  }, coffee.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-base)",
      color: "var(--text-muted)"
    }
  }, [coffee.roaster, coffee.country, coffee.processes && coffee.processes[0]].filter(Boolean).join(" · ")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: onEdit
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 16
  }), "Edit"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    style: {
      color: "var(--destructive)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 16
  }), "Delete"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,minmax(0,1fr))",
      columnGap: "var(--space-8)",
      rowGap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(ViewRow, {
    label: "Roaster",
    value: coffee.roaster
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Country",
    value: coffee.country
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Region",
    value: coffee.region
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Producer",
    value: coffee.producer
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Roast level",
    value: coffee.roast
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Recommended rest",
    value: coffee.rest
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Rating",
    value: coffee.rating ? coffee.rating + " · " + coffee.ratingCount + " session" + (coffee.ratingCount === 1 ? "" : "s") : null
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Elevation",
    value: coffee.elevation
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Processes",
    value: /*#__PURE__*/React.createElement(Chips, {
      items: coffee.processes
    })
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Varietals",
    value: /*#__PURE__*/React.createElement(Chips, {
      items: coffee.varietals
    })
  })), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Flavor notes",
    value: coffee.flavor
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "section",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outline"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }), "Add bag")
  }, "Bags"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(15rem,1fr))",
      gap: "var(--space-3)"
    }
  }, coffee.bags.map(b => /*#__PURE__*/React.createElement(Card, {
    key: b.id,
    style: {
      gap: "var(--space-3)",
      padding: "var(--space-4) 0"
    }
  }, /*#__PURE__*/React.createElement(CardHeader, {
    style: {
      padding: "0 var(--space-4)"
    },
    title: "Roasted " + b.roast_date,
    description: "$" + b.price.toFixed(2) + " · " + b.rested + " days rested",
    action: /*#__PURE__*/React.createElement(Badge, {
      status: b.status,
      dot: true
    }, b.status)
  }), /*#__PURE__*/React.createElement(CardContent, {
    style: {
      padding: "0 var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-1-5)"
    }
  }, ["frozen", "resting", "active", "finished"].map(s => /*#__PURE__*/React.createElement(Button, {
    key: s,
    size: "xs",
    variant: s === b.status ? "default" : "outline"
  }, s)))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "section"
  }, "Sessions brewed with this coffee"), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ListRow, {
    as: "div",
    onClick: () => go("session"),
    title: "V60 \xB7 18 g / 300 g",
    meta: "8/2/2026 \xB7 8.5/10",
    trailing: /*#__PURE__*/React.createElement(Badge, {
      status: "active",
      dot: true
    }, "active")
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(ListRow, {
    as: "div",
    onClick: () => go("session"),
    title: "V60 \xB7 18 g / 290 g",
    meta: "7/27/2026 \xB7 8.0/10",
    trailing: /*#__PURE__*/React.createElement(Badge, {
      status: "complete"
    }, "complete")
  })))));
}
function Chips({
  items
}) {
  if (!items || !items.length) return null;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-1)",
      marginTop: "var(--space-1)"
    }
  }, items.map(i => /*#__PURE__*/React.createElement(Badge, {
    key: i,
    variant: "secondary"
  }, i)));
}

/* Edit is an explicit mode with its own tinted surface — the read/edit distinction. */
function CoffeeEdit({
  coffee,
  onDone
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "secondary"
  }, "Editing"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, "Changes save when you press Save.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    onClick: onDone
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: onDone
  }, "Save"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)",
      gridTemplateColumns: "repeat(2,minmax(0,1fr))",
      borderRadius: "var(--radius-2xl)",
      border: "1px solid var(--edit-border)",
      background: "var(--edit-surface)",
      padding: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "span 2"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Name"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    defaultValue: coffee.name,
    placeholder: "e.g. Finca \u2026"
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Roaster"
  }, /*#__PURE__*/React.createElement(Combobox, {
    value: "1",
    valueName: coffee.roaster,
    options: [{
      id: "1",
      name: coffee.roaster
    }, {
      id: "2",
      name: "Sey Coffee"
    }, {
      id: "3",
      name: "Tim Wendelboe"
    }]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Producer"
  }, /*#__PURE__*/React.createElement(Combobox, {
    value: coffee.producer ? "1" : null,
    valueName: coffee.producer,
    options: [{
      id: "1",
      name: coffee.producer || "—"
    }]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Country"
  }, /*#__PURE__*/React.createElement(Combobox, {
    value: "1",
    valueName: coffee.country,
    options: [{
      id: "1",
      name: coffee.country
    }]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Region",
    hint: "Pick a country first"
  }, /*#__PURE__*/React.createElement(Combobox, {
    value: coffee.region ? "1" : null,
    valueName: coffee.region,
    options: [{
      id: "1",
      name: coffee.region || "—"
    }]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Roast level"
  }, /*#__PURE__*/React.createElement(Select, {
    size: "touch",
    value: "light",
    options: [{
      value: "__none__",
      label: "— None —"
    }, {
      value: "light",
      label: "Light"
    }, {
      value: "medium",
      label: "Medium"
    }, {
      value: "dark",
      label: "Dark"
    }]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Recommended rest"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    defaultValue: coffee.rest,
    placeholder: "e.g. 2\u20133 weeks from roast"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Website"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    type: "url",
    placeholder: "https://\u2026"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Rating override (1\u201310)",
    hint: "Optional; overrides computed aggregate"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    inputMode: "decimal",
    placeholder: "e.g. 8.5",
    style: {
      width: "7rem"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "span 2"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Flavor notes"
  }, /*#__PURE__*/React.createElement(Textarea, {
    defaultValue: coffee.flavor
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "span 2"
    }
  }, /*#__PURE__*/React.createElement("details", {
    style: {
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border)",
      background: "var(--surface-card)",
      padding: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: "pointer",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)"
    }
  }, "More details (rare)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)",
      gridTemplateColumns: "repeat(3,minmax(0,1fr))",
      paddingTop: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Elevation"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    defaultValue: coffee.elevation,
    placeholder: "e.g. 1,950 masl"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Salinity"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Humidity"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch"
  })))))));
}
Object.assign(window, {
  Coffees
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Coffees.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Equipment.jsx
try { (() => {
const {
  Button,
  Badge,
  Icon,
  ListRow,
  SectionHeading
} = window.CafJamestineDesignSystem_188632;
function Equipment({
  equipment
}) {
  const inBrewing = equipment.filter(e => e.workflow),
    other = equipment.filter(e => !e.workflow);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--detail-measure)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "page",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }), "New")
  }, "Equipment"), [["In brewing", inBrewing], ["Everything else", other]].map(([label, rows]) => rows.length ? /*#__PURE__*/React.createElement("section", {
    key: label,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "eyebrow"
  }, label), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  }, rows.map(e => /*#__PURE__*/React.createElement("li", {
    key: e.id
  }, /*#__PURE__*/React.createElement(ListRow, {
    as: "div",
    title: e.name,
    meta: [e.category, e.sub].filter(Boolean).join(" · "),
    trailing: e.workflow ? /*#__PURE__*/React.createElement(Badge, {
      variant: "secondary"
    }, "In brewing") : null
  }))))) : null));
}
Object.assign(window, {
  Equipment
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Equipment.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Landing.jsx
try { (() => {
const {
  Button,
  Icon,
  SectionHeading
} = window.CafJamestineDesignSystem_188632;

/* Pure launchpad: one dominant action, a conditional resume line, plain area cards,
   and a reserved (empty) insight region. Two-column act zone uses the width. */
function Landing({
  go,
  resume
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-12)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-10)",
      gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "var(--space-5)",
      paddingTop: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.svg",
    alt: "",
    style: {
      width: 60,
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-4xl)",
      lineHeight: 1.05,
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-tight)",
      color: "var(--text-heading)"
    }
  }, "Caf\xE9 Jamestine"), /*#__PURE__*/React.createElement(Button, {
    size: "hero",
    onClick: () => go("new-session"),
    style: {
      fontSize: "var(--text-lg)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 20
  }), "Start a session"), resume ? /*#__PURE__*/React.createElement("a", {
    onClick: () => go("session"),
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)",
      cursor: "pointer"
    }
  }, "Resume active session \xB7 ", resume.title) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "var(--space-2)",
      minHeight: "15rem",
      borderRadius: "var(--radius-2xl)",
      border: "1px dashed var(--slate-300)",
      background: "var(--surface-sunken)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Insights"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, "Reserved for a dashboard."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-4)",
      gridTemplateColumns: "repeat(3,minmax(0,1fr))"
    }
  }, [["coffees", "Coffees", "Beans, bags and their history"], ["sessions", "Sessions", "Every brew, planned and reflected on"], ["recipes", "Recipes", "Reusable parameter templates"]].map(([k, l, d]) => /*#__PURE__*/React.createElement(AreaCard, {
    key: k,
    label: l,
    desc: d,
    onClick: () => go(k)
  }))));
}
function AreaCard({
  label,
  desc,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-4)",
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--border)",
      background: h ? "var(--surface-selected)" : "var(--surface-card)",
      boxShadow: "var(--shadow-sm)",
      padding: "var(--space-5) var(--space-6)",
      cursor: "pointer",
      textDecoration: "none",
      transition: "var(--transition-colors)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-lg)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-snug)",
      color: "var(--text-heading)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, desc)), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 18,
    color: "var(--text-muted)"
  }));
}
Object.assign(window, {
  Landing
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Landing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Login.jsx
try { (() => {
const {
  Button,
  Input,
  Label
} = window.CafJamestineDesignSystem_188632;
function Login({
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      minHeight: "100%",
      flex: 1,
      alignItems: "stretch",
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 40%",
      display: "none",
      background: "var(--indigo-600)",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-12)"
    },
    className: "cj-auth-art"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-reversed.svg",
    alt: "",
    style: {
      width: 220
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-12) var(--shell-gutter)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: "var(--form-measure)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      marginBottom: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.svg",
    alt: "",
    style: {
      width: 34
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-xl)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-snug)",
      color: "var(--text-heading)"
    }
  }, "Caf\xE9 Jamestine")), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginBottom: "var(--space-6)",
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-3xl)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-tight)"
    }
  }, "Sign in"), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      go("home");
    },
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1-5)"
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Email"), /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    type: "email",
    defaultValue: "james@cafejamestine.app"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1-5)"
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Password"), /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    type: "password",
    defaultValue: "\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7"
  })), /*#__PURE__*/React.createElement(Button, {
    pill: true,
    fullWidth: true,
    size: "touch",
    type: "submit"
  }, "Sign in")), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: "var(--space-6)",
      textAlign: "center",
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, "No account? ", /*#__PURE__*/React.createElement("a", {
    style: {
      fontWeight: "var(--weight-medium)",
      cursor: "pointer"
    }
  }, "Create one")))));
}
Object.assign(window, {
  Login
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Login.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/NewSession.jsx
try { (() => {
const {
  Button,
  Icon,
  ListRow,
  SectionHeading,
  EmptyState
} = window.CafJamestineDesignSystem_188632;

/* Three steps, each its own screen. Committing lands you in the workflow at Plan. */
function NewSession({
  go,
  coffees,
  recipes,
  sessions
}) {
  const [step, setStep] = React.useState(1);
  const [type, setType] = React.useState(null);
  const [coffee, setCoffee] = React.useState(null);
  const activeCoffees = coffees.filter(c => c.bags.some(b => b.status === "active"));
  const typeRecipes = recipes.filter(r => r.type === type);
  const prior = sessions.filter(s => s.type === type).slice(0, 4);
  const back = () => setStep(step === 3 && type === "brewed_coffee" ? 2 : 1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--detail-measure)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => go("sessions"),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-1)",
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 16
  }), "Sessions"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Step ", step, " of 3"), step > 1 ? /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: back
  }, "Back") : null)), step === 1 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "page"
  }, "Start a session"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      color: "var(--text-muted)"
    }
  }, "What are you making? (This sets the type \u2014 permanent.)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-4)",
      gridTemplateColumns: "repeat(2,minmax(0,1fr))"
    }
  }, [["brewed_coffee", "coffee", "Brewed coffee", "Pour-over and similar: a coffee, a recipe, timed pours."], ["specialty_drink", "glass-water", "Specialty drink", "Lattes and signature drinks: ingredients and prose steps."]].map(([v, g, l, d]) => /*#__PURE__*/React.createElement(TypeTile, {
    key: v,
    glyph: g,
    label: l,
    desc: d,
    onClick: () => {
      setType(v);
      setStep(v === "brewed_coffee" ? 2 : 3);
    }
  })))) : null, step === 2 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "page"
  }, "Select coffee"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      color: "var(--text-muted)"
    }
  }, "Only coffees with an active bag can be brewed."), activeCoffees.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, null, "No coffees have an active bag. Set a bag to active on a coffee first.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  }, activeCoffees.map(c => /*#__PURE__*/React.createElement("li", {
    key: c.id
  }, /*#__PURE__*/React.createElement(ListRow, {
    as: "div",
    title: c.name,
    meta: c.roaster,
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16,
      color: "var(--text-muted)"
    }),
    onClick: () => {
      setCoffee(c);
      setStep(3);
    }
  }))))) : null, step === 3 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "page"
  }, "Parameter source"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      color: "var(--text-muted)"
    }
  }, type === "brewed_coffee" ? "Brewed coffee" + (coffee ? " · " + coffee.name : "") : "Specialty drink")), /*#__PURE__*/React.createElement(Button, {
    size: "hero",
    fullWidth: true,
    style: {
      justifyContent: "flex-start",
      fontSize: "var(--text-lg)"
    },
    onClick: () => go("session")
  }, "Build new (blank)"), /*#__PURE__*/React.createElement("section", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "eyebrow"
  }, "Clone a recipe"), typeRecipes.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, null, "No recipes of this type.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  }, typeRecipes.map(r => /*#__PURE__*/React.createElement("li", {
    key: r.id
  }, /*#__PURE__*/React.createElement(ListRow, {
    as: "div",
    title: r.name,
    meta: r.method,
    trailing: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-sm)",
        color: "var(--text-muted)"
      }
    }, r.scope),
    onClick: () => go("session")
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "eyebrow"
  }, "Clone a prior session"), prior.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, null, "No prior sessions.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  }, prior.map(s => /*#__PURE__*/React.createElement("li", {
    key: s.id
  }, /*#__PURE__*/React.createElement(ListRow, {
    as: "div",
    title: new Date(s.date + "T12:00:00").toLocaleDateString() + " · " + s.title,
    meta: s.method,
    onClick: () => go("session")
  })))))) : null);
}
function TypeTile({
  glyph,
  label,
  desc,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "var(--space-3)",
      borderRadius: "var(--radius-2xl)",
      border: "1px solid " + (h ? "var(--ring)" : "var(--border)"),
      background: h ? "var(--surface-selected)" : "var(--surface-card)",
      boxShadow: "var(--shadow-sm)",
      padding: "var(--space-6)",
      cursor: "pointer",
      textAlign: "left",
      fontFamily: "var(--font-sans)",
      transition: "var(--transition-colors)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: glyph,
    size: 32,
    color: "var(--primary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-xl)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-snug)",
      color: "var(--text-heading)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      lineHeight: 1.45,
      color: "var(--text-muted)"
    }
  }, desc));
}
Object.assign(window, {
  NewSession
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/NewSession.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Rail.jsx
try { (() => {
const {
  Button,
  Badge,
  Icon,
  SectionHeading,
  EmptyState
} = window.CafJamestineDesignSystem_188632;

/* Shared list rail: grouped, status-pilled, selection persists. Used by Coffees and Recipes. */
function Rail({
  title,
  groups,
  selected,
  onSelect,
  onNew,
  filters,
  emptyLabel = "Nothing yet."
}) {
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--border)",
      background: "var(--surface-rail)",
      padding: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-lg)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-snug)",
      color: "var(--text-heading)"
    }
  }, title), onNew ? /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: onNew
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), "New") : null), filters ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-1-5)"
    }
  }, filters) : null, total === 0 ? /*#__PURE__*/React.createElement(EmptyState, null, emptyLabel) : groups.map(g => g.items.length ? /*#__PURE__*/React.createElement("section", {
    key: g.label,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "eyebrow"
  }, g.label), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-0-5)",
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  }, g.items.map(it => /*#__PURE__*/React.createElement("li", {
    key: it.id
  }, /*#__PURE__*/React.createElement(RailItem, {
    item: it,
    active: it.id === selected,
    onClick: () => onSelect(it.id)
  }))))) : null));
}
function RailItem({
  item,
  active,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-2)",
      borderRadius: "var(--radius-md)",
      padding: "var(--space-2) var(--space-3)",
      cursor: "pointer",
      textDecoration: "none",
      background: active ? "var(--surface-selected)" : h ? "var(--slate-100)" : "transparent",
      transition: "var(--transition-colors)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: active ? "var(--weight-semibold)" : "var(--weight-medium)",
      color: active || h ? "var(--text-heading)" : "var(--text-body)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, item.name), item.meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)"
    }
  }, item.meta) : null), item.status ? /*#__PURE__*/React.createElement(Badge, {
    status: item.status,
    dot: true
  }, item.status) : null, item.favorite ? /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 14,
    color: "var(--favorite)"
  }) : null);
}
Object.assign(window, {
  Rail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Rail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Recipes.jsx
try { (() => {
const {
  Button,
  Badge,
  Icon,
  ListRow,
  SectionHeading,
  EmptyState,
  SplitPane,
  ViewRow,
  StepsTable
} = window.CafJamestineDesignSystem_188632;
function Recipes({
  go,
  recipes
}) {
  const [selected, setSelected] = React.useState(recipes[0].id);
  const [scope, setScope] = React.useState("all");
  const r = recipes.find(x => x.id === selected);
  const pass = x => scope === "all" || scope === "standard" && x.scope === "standard" || scope === "favorite" && x.favorite || scope === "coffee" && x.scope !== "standard";
  const rail = /*#__PURE__*/React.createElement(Rail, {
    title: "Recipes",
    onNew: () => {},
    selected: selected,
    onSelect: setSelected,
    emptyLabel: "No recipes match.",
    filters: [["all", "All"], ["standard", "Standards"], ["coffee", "Coffee-specific"], ["favorite", "Favorites"]].map(([v, l]) => /*#__PURE__*/React.createElement(Button, {
      key: v,
      size: "xs",
      variant: scope === v ? "default" : "outline",
      onClick: () => setScope(v)
    }, l)),
    groups: [{
      label: "Brewed",
      items: recipes.filter(x => x.type === "brewed_coffee" && pass(x)).map(x => ({
        id: x.id,
        name: x.name,
        meta: x.method,
        favorite: x.favorite
      }))
    }, {
      label: "Specialty",
      items: recipes.filter(x => x.type === "specialty_drink" && pass(x)).map(x => ({
        id: x.id,
        name: x.name,
        meta: x.scope,
        favorite: x.favorite
      }))
    }]
  });
  return /*#__PURE__*/React.createElement(SplitPane, {
    list: rail
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-3xl)",
      lineHeight: 1.1,
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-tight)",
      color: "var(--text-heading)"
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)"
    }
  }, r.favorite ? /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 16,
    color: "var(--favorite)"
  }) : null, /*#__PURE__*/React.createElement(Badge, {
    variant: "secondary"
  }, r.type === "brewed_coffee" ? "Brewed coffee" : "Specialty drink"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, [r.method, r.scope].filter(Boolean).join(" · ")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 16
  }), "Edit"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go("new-session")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 16
  }), "Use in a session"))), r.type === "brewed_coffee" ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,minmax(0,1fr))",
      columnGap: "var(--space-8)",
      rowGap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(ViewRow, {
    label: "Method",
    value: r.method
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Dose (g)",
    value: "20"
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Water (g)",
    value: "320"
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Temp (\xB0C)",
    value: "94"
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "section"
  }, "Steps"), /*#__PURE__*/React.createElement(StepsTable, {
    mode: r.type,
    steps: r.type === "brewed_coffee" ? [{
      time: "0:00",
      description: "Bloom, centre pour",
      weight: 55,
      flow: null
    }, {
      time: "0:45",
      description: "Spiral to 180 g",
      weight: 180,
      flow: 3.4
    }, {
      time: "1:40",
      description: "Final pour",
      weight: 320,
      flow: 4.0
    }] : [{
      description: "Pull an 18 g double into a warmed cup."
    }, {
      description: "Steam milk to 60 °C, glossy microfoam."
    }, {
      description: "Pour from height, drop in close for a centred dot."
    }]
  }))));
}
Object.assign(window, {
  Recipes
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Recipes.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Reference.jsx
try { (() => {
const {
  Button,
  Icon,
  Input,
  SectionHeading,
  EmptyState
} = window.CafJamestineDesignSystem_188632;
const TABLES = [["Roasters", ["Onyx Coffee Lab", "Sey Coffee", "Tim Wendelboe"]], ["Countries", ["Brazil", "Colombia", "Ethiopia", "Kenya"]], ["Regions", ["Cauca", "Guji", "Kirinyaga"]], ["Producers", ["Diego Bermúdez", "Uraga Washing Station"]], ["Processes", ["Washed", "Natural", "Double anaerobic"]], ["Varietals", ["Castillo", "Heirloom", "SL28", "SL34", "Yellow Bourbon"]], ["Units", ["g", "ml", "oz", "shot"]]];
function Reference() {
  const [table, setTable] = React.useState("Roasters");
  const rows = (TABLES.find(t => t[0] === table) || [])[1] || [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--detail-measure)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "page"
  }, "Reference"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, "Your own lists. Anything you add here becomes selectable everywhere else."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-2)"
    }
  }, TABLES.map(([t]) => /*#__PURE__*/React.createElement(Button, {
    key: t,
    size: "sm",
    variant: t === table ? "default" : "outline",
    onClick: () => setTable(t)
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      maxWidth: "26rem"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    placeholder: "Add to " + table.toLowerCase() + "…"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "touch",
    variant: "outline"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), "Add")), rows.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, null, "Nothing yet.") : /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-2)",
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  }, rows.map(r => /*#__PURE__*/React.createElement("li", {
    key: r,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-1)",
      border: "1px solid var(--border)",
      background: "var(--surface-card)",
      borderRadius: "var(--radius-full)",
      padding: "var(--space-1) var(--space-1) var(--space-1) var(--space-3)",
      fontSize: "var(--text-sm)"
    }
  }, r, /*#__PURE__*/React.createElement(Button, {
    size: "icon-xs",
    variant: "ghost",
    style: {
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 12
  }))))));
}
Object.assign(window, {
  Reference
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Reference.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/SessionWorkflow.jsx
try { (() => {
const {
  Button,
  Badge,
  Icon,
  Field,
  Input,
  Textarea,
  Select,
  Switch,
  Label,
  PhaseStepper,
  SectionHeading,
  ViewRow,
  RatingControl,
  StepsTable,
  ConfirmPanel,
  Dialog,
  BrewParam
} = window.CafJamestineDesignSystem_188632;
const ORDER = {
  brewed_coffee: ["plan", "brew", "postbrew", "tasting"],
  specialty_drink: ["plan", "make", "tasting"]
};
const LABEL = {
  plan: "Plan",
  brew: "Brew",
  postbrew: "Post-brew",
  make: "Make",
  tasting: "Tasting"
};

/* One session, one continuous surface, one phase at a time. Committing a phase advances. */
function SessionWorkflow({
  go,
  session,
  ingredients,
  drinkSteps,
  onSubbar
}) {
  const brewed = session.type === "brewed_coffee";
  const order = ORDER[session.type];
  const [phase, setPhase] = React.useState("plan");
  const [done, setDone] = React.useState([]);
  const [editing, setEditing] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [iced, setIced] = React.useState(false);
  const [tasting, setTasting] = React.useState(session.tasting || []);
  const advance = () => {
    const i = order.indexOf(phase);
    setDone(d => d.includes(phase) ? d : d.concat(phase));
    if (i < order.length - 1) setPhase(order[i + 1]);
  };
  React.useEffect(() => {
    onSubbar(/*#__PURE__*/React.createElement(PhaseStepper, {
      value: phase,
      done: done,
      onChange: setPhase,
      phases: order.map(v => ({
        value: v,
        label: LABEL[v]
      }))
    }));
  }, [phase, done]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => go("sessions"),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-1)",
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 16
  }), "Sessions"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-3xl)",
      lineHeight: 1.1,
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-tight)",
      color: "var(--text-heading)"
    }
  }, session.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, "roasted 2026-07-18 \xB7 ", session.rested, " days rested")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "secondary"
  }, brewed ? "Brewed coffee" : "Specialty drink"), /*#__PURE__*/React.createElement(Badge, {
    status: session.status,
    dot: session.status === "active"
  }, session.status), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "copy",
    size: 16
  }), "Clone"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    style: {
      color: "var(--destructive)"
    },
    onClick: () => setDeleting(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 16
  }), "Delete"))), phase === "plan" ? /*#__PURE__*/React.createElement(Plan, {
    session: session,
    brewed: brewed,
    editing: editing,
    setEditing: setEditing,
    iced: iced,
    setIced: setIced,
    onCommit: () => brewed ? go("brew", session) : advance()
  }) : null, phase === "postbrew" ? /*#__PURE__*/React.createElement(PostBrew, {
    session: session,
    onCommit: advance
  }) : null, phase === "make" ? /*#__PURE__*/React.createElement(Make, {
    ingredients: ingredients,
    steps: drinkSteps,
    onCommit: advance
  }) : null, phase === "tasting" ? /*#__PURE__*/React.createElement(Tasting, {
    session: session,
    tasting: tasting,
    setTasting: setTasting,
    confirming: confirming,
    setConfirming: setConfirming,
    onDone: () => go("sessions")
  }) : null, /*#__PURE__*/React.createElement(Dialog, {
    open: deleting,
    onClose: () => setDeleting(false),
    title: "Delete this session?",
    description: "The session, its steps and its tasting notes go with it. This cannot be undone.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setDeleting(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "destructive",
      onClick: () => {
        setDeleting(false);
        go("sessions");
      }
    }, "Delete"))
  }));
}

/* ---- Plan: read-first, explicit Edit, then Confirm & brew ---- */
function Plan({
  session,
  brewed,
  editing,
  setEditing,
  iced,
  setIced,
  onCommit
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "section",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outline",
      onClick: () => setEditing(v => !v)
    }, editing ? "Done editing" : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
      name: "pencil",
      size: 16
    }), "Edit"))
  }, "Recipe"), editing ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)",
      gridTemplateColumns: "repeat(3,minmax(0,1fr))",
      borderRadius: "var(--radius-2xl)",
      border: "1px solid var(--edit-border)",
      background: "var(--edit-surface)",
      padding: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Method"
  }, /*#__PURE__*/React.createElement(Select, {
    size: "touch",
    value: "v60",
    options: [{
      value: "__none__",
      label: "— None —"
    }, {
      value: "v60",
      label: "V60"
    }, {
      value: "kalita",
      label: "Kalita Wave 155"
    }, {
      value: "espresso",
      label: "Espresso"
    }]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Measured by"
  }, /*#__PURE__*/React.createElement(Select, {
    size: "touch",
    value: "input",
    options: [{
      value: "input",
      label: "input (brew water)"
    }, {
      value: "output",
      label: "output (in cup)"
    }]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Brewer / brew device"
  }, /*#__PURE__*/React.createElement(Select, {
    size: "touch",
    value: "v60",
    options: [{
      value: "v60",
      label: "Hario V60 02"
    }, {
      value: "kalita",
      label: "Kalita Wave 155"
    }]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Grinder"
  }, /*#__PURE__*/React.createElement(Select, {
    size: "touch",
    value: "k",
    options: [{
      value: "k",
      label: "1Zpresso K-Ultra"
    }]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Grind setting"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    defaultValue: session.grind
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Dose (g)"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    inputMode: "decimal",
    defaultValue: String(session.dose)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Water (g)"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    inputMode: "decimal",
    defaultValue: String(session.water)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Temperature (\xB0C)"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    inputMode: "decimal",
    defaultValue: String(session.temp)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Bloom water (g)"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    inputMode: "decimal",
    defaultValue: String(session.bloom_g)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Bloom time (m:ss)",
    hint: "m:ss"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    inputMode: "numeric",
    defaultValue: session.bloom_t
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "span 2",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-4)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      background: "var(--surface-card)",
      padding: "var(--space-3) var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Iced"), /*#__PURE__*/React.createElement(Switch, {
    checked: iced,
    onChange: setIced
  })), iced ? /*#__PURE__*/React.createElement(Field, {
    label: "Ice (g)"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    inputMode: "decimal",
    placeholder: "e.g. 120"
  })) : null) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,minmax(0,1fr))",
      columnGap: "var(--space-8)",
      rowGap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(ViewRow, {
    label: "Method",
    value: session.method
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Brewer",
    value: session.brewer
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Grinder",
    value: session.grinder
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Grind",
    value: session.grind
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Dose (g)",
    value: session.dose
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Water (g)",
    value: session.water
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Measured by",
    value: session.anchor
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Temperature (\xB0C)",
    value: session.temp
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Bloom water (g)",
    value: session.bloom_g
  }), /*#__PURE__*/React.createElement(ViewRow, {
    label: "Bloom time (m:ss)",
    value: session.bloom_t
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "section"
  }, "Steps"), /*#__PURE__*/React.createElement(StepsTable, {
    steps: session.steps
  }))), !editing ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    size: "hero",
    onClick: onCommit
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 20
  }), brewed ? "Confirm & brew" : "Continue to Make")) : null);
}
function PostBrew({
  session,
  onCommit
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "section"
  }, "Post-brew"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)",
      gridTemplateColumns: "repeat(3,minmax(0,1fr))",
      borderRadius: "var(--radius-2xl)",
      border: "1px solid var(--edit-border)",
      background: "var(--edit-surface)",
      padding: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Total brew time (m:ss)",
    hint: "m:ss"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    inputMode: "numeric",
    defaultValue: session.total
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "span 3"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Post-brew notes"
  }, /*#__PURE__*/React.createElement(Textarea, {
    defaultValue: session.notes
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: onCommit
  }, "Continue to Tasting", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 16
  }))));
}
function Make({
  ingredients,
  steps,
  onCommit
}) {
  const [mult, setMult] = React.useState("1");
  const m = Number(mult) > 0 ? Math.round(Number(mult) * 10) / 10 : 1;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "section",
    action: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)"
      }
    }, /*#__PURE__*/React.createElement(Label, {
      size: "xs"
    }, "Batch \xD7"), /*#__PURE__*/React.createElement(Input, {
      size: "sm",
      value: mult,
      onChange: e => setMult(e.target.value),
      style: {
        width: "5rem"
      }
    }))
  }, "Ingredients"), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      margin: 0,
      padding: 0,
      listStyle: "none",
      maxWidth: "var(--brew-measure)"
    }
  }, ingredients.map(i => /*#__PURE__*/React.createElement("li", {
    key: i.name,
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: "var(--space-4)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      background: "var(--surface-card)",
      padding: "var(--space-3) var(--space-5)",
      fontSize: "var(--brew-step)",
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", null, i.name), /*#__PURE__*/React.createElement("span", {
    className: "tabular",
    style: {
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-heading)"
    }
  }, Math.round(i.qty * m * 10) / 10, " ", i.unit)))), m !== 1 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, "Showing ", m, "\xD7 batch \u2014 recipe unchanged.") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      maxWidth: "var(--brew-measure)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "section"
  }, "Steps"), /*#__PURE__*/React.createElement("ol", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: "var(--space-4)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      background: "var(--surface-card)",
      padding: "var(--space-4) var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tabular",
    style: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--brew-time)",
      lineHeight: 1,
      fontWeight: "var(--weight-semibold)",
      color: "var(--phase-brew)"
    }
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--brew-step)",
      lineHeight: 1.35,
      color: "var(--text-body)"
    }
  }, s.description))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: onCommit
  }, "Continue to Tasting", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 16
  }))));
}
function Tasting({
  session,
  tasting,
  setTasting,
  confirming,
  setConfirming,
  onDone
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "section"
  }, "Tasting"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-6)",
      gridTemplateColumns: "minmax(0,20rem) minmax(0,1fr)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      borderRadius: "var(--radius-2xl)",
      border: "1px solid var(--edit-border)",
      background: "var(--edit-surface)",
      padding: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Overall enjoyment (1\u201310)",
    hint: "Standalone enjoyment, set directly (1\u201310, 0.5 steps)"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "touch",
    inputMode: "decimal",
    defaultValue: String(session.overall || ""),
    placeholder: "e.g. 8.5"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Next-time adjustments"
  }, /*#__PURE__*/React.createElement(Textarea, {
    defaultValue: session.next,
    minHeight: "7rem"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, "Per-category 1\u20135 describes prominence on each parameter\u2019s spectrum \u2014 not enjoyment."), tasting.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.name,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      background: "var(--surface-card)",
      padding: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-base)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-heading)"
    }
  }, c.name), /*#__PURE__*/React.createElement(RatingControl, {
    value: c.rating,
    onChange: v => setTasting(t => t.map((x, j) => j === i ? {
      ...x,
      rating: v
    } : x))
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)"
    }
  }, c.guidance), /*#__PURE__*/React.createElement(Textarea, {
    minHeight: "2.25rem",
    defaultValue: c.notes,
    placeholder: "Notes (optional)"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border)",
      paddingTop: "var(--space-6)"
    }
  }, confirming ? /*#__PURE__*/React.createElement(ConfirmPanel, {
    confirmLabel: "Mark complete",
    confirmIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16
    }),
    onCancel: () => setConfirming(false),
    onConfirm: onDone,
    message: "Mark complete? This snapshots days-rested + brew date and marks the workflow done. You can still edit it afterward.",
    style: {
      maxWidth: "36rem"
    }
  }) : /*#__PURE__*/React.createElement(Button, {
    size: "hero",
    onClick: () => setConfirming(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 20
  }), "Mark complete")));
}
Object.assign(window, {
  SessionWorkflow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/SessionWorkflow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Sessions.jsx
try { (() => {
const {
  Button,
  Badge,
  Icon,
  ListRow,
  SectionHeading,
  EmptyState,
  SplitPane
} = window.CafJamestineDesignSystem_188632;
function Sessions({
  go,
  sessions
}) {
  const active = sessions.filter(s => s.status === "active");
  const history = sessions.filter(s => s.status === "complete");
  const rail = /*#__PURE__*/React.createElement(Rail, {
    title: "Sessions",
    onNew: () => go("new-session"),
    groups: [{
      label: "Active",
      items: active.map(s => ({
        id: s.id,
        name: s.title,
        meta: fmt(s.date),
        status: "active"
      }))
    }, {
      label: "History",
      items: history.map(s => ({
        id: s.id,
        name: s.title,
        meta: fmt(s.date)
      }))
    }],
    selected: sessions[0].id,
    onSelect: () => go("session", sessions[0])
  });
  return /*#__PURE__*/React.createElement(SplitPane, {
    list: rail
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "page",
    action: /*#__PURE__*/React.createElement(Button, {
      onClick: () => go("new-session")
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }), "Start a session")
  }, "Sessions"), /*#__PURE__*/React.createElement(Group, {
    label: "Active",
    rows: active,
    go: go,
    empty: "No active sessions."
  }), history.length ? /*#__PURE__*/React.createElement(Group, {
    label: "History",
    rows: history,
    go: go
  }) : null));
}
const fmt = d => new Date(d + "T12:00:00").toLocaleDateString();
function Group({
  label,
  rows,
  go,
  empty
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    level: "eyebrow"
  }, label), rows.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, null, empty) : /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  }, rows.map(s => /*#__PURE__*/React.createElement("li", {
    key: s.id
  }, /*#__PURE__*/React.createElement(ListRow, {
    as: "div",
    onClick: () => go("session", s),
    title: s.title,
    meta: [fmt(s.date), s.method, s.overall ? s.overall + "/10" : null].filter(Boolean).join(" · "),
    trailing: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        gap: "var(--space-2)"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      variant: "secondary"
    }, s.type === "brewed_coffee" ? "Brewed" : "Specialty"), /*#__PURE__*/React.createElement(Badge, {
      status: s.status,
      dot: s.status === "active"
    }, s.status))
  })))));
}
Object.assign(window, {
  Sessions
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Sessions.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
// Fixture data shaped like the real Supabase rows (src/lib/db-types.ts).
window.CJ_DATA = {
  coffees: [{
    id: "c1",
    name: "Ethiopia Guji Uraga",
    roaster: "Onyx Coffee Lab",
    country: "Ethiopia",
    region: "Guji",
    producer: "Uraga Washing Station",
    roast: "Light",
    rest: "2–3 weeks from roast",
    flavor: "Peach, bergamot, cane sugar",
    elevation: "1,950 masl",
    rating: 8.6,
    ratingCount: 4,
    processes: ["Washed"],
    varietals: ["Heirloom"],
    group: "active",
    bags: [{
      id: "b1",
      roast_date: "2026-07-18",
      status: "active",
      price: 22.00,
      rested: 15
    }, {
      id: "b2",
      roast_date: "2026-06-02",
      status: "frozen",
      price: 22.00,
      rested: 0
    }]
  }, {
    id: "c2",
    name: "Colombia El Paraíso",
    roaster: "Sey Coffee",
    country: "Colombia",
    region: "Cauca",
    producer: "Diego Bermúdez",
    roast: "Light",
    rest: "3 weeks from roast",
    flavor: "Lychee, rose, red apple",
    rating: 9.1,
    ratingCount: 2,
    processes: ["Double anaerobic"],
    varietals: ["Castillo"],
    group: "active",
    bags: [{
      id: "b3",
      roast_date: "2026-07-24",
      status: "resting",
      price: 26.50,
      rested: 6
    }]
  }, {
    id: "c3",
    name: "Kenya Kirinyaga AA",
    roaster: "Tim Wendelboe",
    country: "Kenya",
    region: "Kirinyaga",
    roast: "Light",
    flavor: "Blackcurrant, tomato leaf",
    group: "storage",
    rating: 8.0,
    ratingCount: 1,
    processes: ["Washed"],
    varietals: ["SL28", "SL34"],
    bags: [{
      id: "b4",
      roast_date: "2026-05-11",
      status: "frozen",
      price: 24.00,
      rested: 0
    }]
  }, {
    id: "c4",
    name: "Brazil Fazenda Rainha",
    roaster: "Onyx Coffee Lab",
    country: "Brazil",
    roast: "Medium",
    flavor: "Cocoa, hazelnut",
    group: "history",
    rating: 7.4,
    ratingCount: 6,
    processes: ["Natural"],
    varietals: ["Yellow Bourbon"],
    bags: [{
      id: "b5",
      roast_date: "2026-03-02",
      status: "finished",
      price: 18.00,
      rested: 41
    }]
  }],
  sessions: [{
    id: "s1",
    title: "Ethiopia Guji Uraga",
    type: "brewed_coffee",
    status: "active",
    date: "2026-08-02",
    method: "V60",
    brewer: "Hario V60 02",
    grinder: "1Zpresso K-Ultra",
    grind: "4.2",
    dose: 18,
    water: 300,
    anchor: "input",
    temp: 93,
    bloom_g: 50,
    bloom_t: "0:45",
    rested: 15,
    total: "2:48",
    notes: "Bed looked even. Slightly faster drawdown than last time.",
    next: "Grind one click finer; hold 93 °C.",
    steps: [{
      time: "0:00",
      description: "Bloom, centre pour",
      weight: 50,
      flow: null
    }, {
      time: "0:45",
      description: "Spiral out to 150 g",
      weight: 150,
      flow: 3.2
    }, {
      time: "1:30",
      description: "Final pour, keep bed flat",
      weight: 300,
      flow: 4.1
    }, {
      time: "2:40",
      description: "Drawdown complete, swirl",
      weight: null,
      flow: null
    }],
    tasting: [{
      name: "Acidity",
      guidance: "Bright and lively vs soft and round",
      rating: 4,
      notes: "Bergamot up front, no bite."
    }, {
      name: "Sweetness",
      guidance: "Sugar-like intensity through the finish",
      rating: 3,
      notes: ""
    }, {
      name: "Body",
      guidance: "Weight and texture in the mouth",
      rating: 2,
      notes: "Tea-like."
    }, {
      name: "Balance",
      guidance: "How the parts sit together",
      rating: 4,
      notes: ""
    }],
    overall: 8.5
  }, {
    id: "s2",
    title: "Colombia El Paraíso",
    type: "brewed_coffee",
    status: "active",
    date: "2026-08-01",
    method: "Kalita Wave 155"
  }, {
    id: "s3",
    title: "Cortado",
    type: "specialty_drink",
    status: "complete",
    date: "2026-07-30",
    overall: 8.0
  }, {
    id: "s4",
    title: "Ethiopia Guji Uraga",
    type: "brewed_coffee",
    status: "complete",
    date: "2026-07-27",
    method: "V60",
    overall: 8.0
  }, {
    id: "s5",
    title: "Iced shaken espresso",
    type: "specialty_drink",
    status: "complete",
    date: "2026-07-21",
    overall: 7.5
  }],
  recipes: [{
    id: "r1",
    name: "Kalita 20 g standard",
    type: "brewed_coffee",
    method: "Kalita Wave 155",
    scope: "standard",
    favorite: true
  }, {
    id: "r2",
    name: "Guji light-roast V60",
    type: "brewed_coffee",
    method: "V60",
    scope: "Ethiopia Guji Uraga",
    favorite: false
  }, {
    id: "r3",
    name: "House cortado",
    type: "specialty_drink",
    method: null,
    scope: "standard",
    favorite: true
  }, {
    id: "r4",
    name: "Iced shaken espresso",
    type: "specialty_drink",
    method: null,
    scope: "standard",
    favorite: false
  }, {
    id: "r5",
    name: "Espresso 1:2 in 28 s",
    type: "brewed_coffee",
    method: "Espresso",
    scope: "standard",
    favorite: false
  }],
  equipment: [{
    id: "e1",
    name: "Hario V60 02",
    category: "Brewer",
    sub: "Conical",
    workflow: true
  }, {
    id: "e2",
    name: "1Zpresso K-Ultra",
    category: "Grinder",
    sub: "Conical",
    workflow: true
  }, {
    id: "e3",
    name: "Kalita Wave 155",
    category: "Brewer",
    sub: "Flat-bottom",
    workflow: true
  }, {
    id: "e4",
    name: "Acaia Pearl S",
    category: "Scale",
    sub: null,
    workflow: false
  }, {
    id: "e7",
    name: "Timemore Sculptor 064S",
    category: "Grinder",
    sub: "Flat",
    workflow: true
  }, {
    id: "e5",
    name: "Fellow Stagg EKG",
    category: "Kettle",
    sub: null,
    workflow: false
  }, {
    id: "e6",
    name: "IMS precision basket 18 g",
    category: "Basket",
    sub: "Precision",
    workflow: true
  }],
  ingredients: [{
    name: "Espresso (18 g in / 36 g out)",
    qty: 36,
    unit: "g"
  }, {
    name: "Whole milk, steamed",
    qty: 120,
    unit: "g"
  }],
  drinkSteps: [{
    description: "Pull an 18 g double into a warmed 5 oz cup."
  }, {
    description: "Steam milk to 60 °C with a tight, glossy microfoam."
  }, {
    description: "Pour from height, then drop in close for a small centred dot."
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardHeader = __ds_scope.CardHeader;

__ds_ns.CardContent = __ds_scope.CardContent;

__ds_ns.CardFooter = __ds_scope.CardFooter;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Combobox = __ds_scope.Combobox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Label = __ds_scope.Label;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.BrewParam = __ds_scope.BrewParam;

__ds_ns.ConfirmPanel = __ds_scope.ConfirmPanel;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.PhaseStepper = __ds_scope.PhaseStepper;

__ds_ns.RatingControl = __ds_scope.RatingControl;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.SplitPane = __ds_scope.SplitPane;

__ds_ns.StepsTable = __ds_scope.StepsTable;

__ds_ns.ViewRow = __ds_scope.ViewRow;

})();
