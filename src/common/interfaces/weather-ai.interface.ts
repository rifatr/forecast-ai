export interface WeatherAiCurrent {
	time: string;
	interval: number;
	temperature: number;
	windspeed: number;
	winddirection: number;
	is_day: number;
	weathercode: number;
}

export interface WeatherAiDaily {
	date: string;
	temp_max: number;
	temp_min: number;
	precipitation: number;
	weathercode: number;
}

export interface WeatherAiHourly {
	time: string;
	temp: number;
	precipitation: number;
	weathercode: number;
}

export interface WeatherAiGeoData {
	ip: string;
	ip_version: string;
	lat: number;
	lon: number;
	city: string;
	region: string;
	country: string;
	timezone: string;
	isp: string | null;
	asn: string | null;
	is_datacenter: boolean;
}

export interface WeatherAiResponse {
	lat: number;
	lon: number;
	units: string;
	days: number;
	current: WeatherAiCurrent;
	daily: WeatherAiDaily[];
	hourly: WeatherAiHourly[];
	ai_summary: string | null;
}

export interface WeatherAiGeoResponse extends WeatherAiResponse {
	geo: WeatherAiGeoData;
}

export interface WeatherAiUsageResponse {
	plan: string;
	used: number;
	limit: number;
	remaining: number;
	unlimited: boolean;
}

export interface WeatherAiTreeHealth {
	healthy: number;
	needs_care: number;
	needs_replacement: number;
}

export interface WeatherAiTreeCvDebug {
	orig_resolution: string;
	work_resolution: string;
	canopy_px: number;
	peaks_detected: number;
	after_area_filter: number;
}

export interface WeatherAiTreeAnalysisResponse {
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
	tree_health: WeatherAiTreeHealth;
	low_confidence: boolean;
	tree_species_guess: string;
	observations: string[];
	recommendations: string[];
	original_image_url: string;
	overlay_image_url: string | null;
	cv_debug: WeatherAiTreeCvDebug;
}

export interface WeatherAiTreesHistoryResponse {
	data: WeatherAiTreeAnalysisResponse[];
	next_cursor: string | null;
}

export interface WeatherAiTreesQuotaResponse {
	plan: string;
	used: number;
	limit: number;
	remaining: number;
	unlimited: boolean;
	resets_at: string;
}
