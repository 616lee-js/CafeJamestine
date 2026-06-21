// Dynamic label + example for equipment.sub_category, driven by the selected category.
// Presentation only — never changes which fields show or what values are allowed.
export function subCategoryMeta(categoryName: string | null): {
  label: string;
  eg?: string;
} {
  switch ((categoryName ?? "").toLowerCase()) {
    case "grinder":
      return { label: "Burr type", eg: "e.g. conical, flat" };
    case "brewer":
      return { label: "Dripper shape", eg: "e.g. flat-bottom, conical, hybrid" };
    case "basket":
      return { label: "Basket type", eg: "e.g. stock, precision" };
    case "filter":
      return { label: "Filter type", eg: "e.g. paper, metal, cloth" };
    case "machine":
      return { label: "Machine type", eg: "e.g. lever, pump" };
    default:
      return { label: "Sub-category (optional)" };
  }
}

// Equipment category sets used by recipe selectors.
export const GRINDER_CATEGORIES = ["grinder"];
export const BREWER_CATEGORIES = ["brewer", "basket"]; // espresso uses a portafilter basket
