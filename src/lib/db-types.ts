// Hand-written row types for the Phase 2 tables. (Supabase CLI type-gen deferred.)

export type BagStatus = "frozen" | "resting" | "active" | "finished";
export const BAG_STATUSES: BagStatus[] = ["frozen", "resting", "active", "finished"];
export type BrewMethodFamily = "filter" | "espresso" | "hybrid";

export type ReferenceTable =
  | "roasters"
  | "countries"
  | "regions"
  | "producers"
  | "processes"
  | "varietals";

export interface ReferenceRow {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface RegionRow extends ReferenceRow {
  country_id: string;
}

export interface SeedRow {
  id: string;
  name: string;
  sort_order: number | null;
}

export interface Equipment {
  id: string;
  user_id: string;
  name: string | null;
  category_id: string | null;
  is_workflow_relevant: boolean;
  manufacturer: string | null;
  type: string | null;
  brew_method_family: BrewMethodFamily | null;
  price: number | null;
  acquired_on: string | null;
  image_path: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Coffee {
  id: string;
  user_id: string;
  name: string | null;
  roaster_id: string | null;
  country_id: string | null;
  region_id: string | null;
  producer_id: string | null;
  roast_level_id: string | null;
  roaster_notes: string | null;
  recommended_rest: string | null;
  website_url: string | null;
  image_path: string | null;
  notes: string | null;
  rating_override: number | null;
  created_at: string;
  updated_at: string;
}

export interface CoffeeBag {
  id: string;
  user_id: string;
  coffee_id: string;
  roast_date: string | null;
  price: number | null;
  status: BagStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoffeeBagStatusEvent {
  id: string;
  user_id: string;
  coffee_bag_id: string;
  status: BagStatus;
  changed_at: string;
  created_at: string;
  updated_at: string;
}
