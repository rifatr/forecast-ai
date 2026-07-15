export interface FarmAnalysisInput {
  county: string;
  landAcres: string;
  location: string;
  notes: string;
}

export interface TreeHealth {
  healthy: number;
  needs_care: number;
  needs_replacement: number;
}

export interface ComputerVisionDebug {
  orig_resolution: string;
  work_resolution: string;
  canopy_px: number;
  peaks_detected: number;
  after_area_filter: number;
}

export interface FarmAnalysis {
  analysis_id: string;
  timestamp: string;
  farmer_id: string | null;
  county: string | null;
  location: string | null;
  land_acres: number | null;
  total_tree_count: number;
  tree_density_per_acre: number | null;
  confidence_score: number;
  canopy_coverage_pct: number;
  tree_health: TreeHealth;
  low_confidence: boolean;
  tree_species_guess: string;
  observations: string[];
  recommendations: string[];
  original_image_url: string;
  overlay_image_url: string | null;
  cv_debug: ComputerVisionDebug;
}

export interface FarmHistoryResponse {
  data: FarmAnalysis[];
  next_cursor: string | null;
}

export interface FarmQuota {
  plan: string;
  used: number;
  limit: number;
  remaining: number;
  unlimited: boolean;
  resets_at: string;
}
