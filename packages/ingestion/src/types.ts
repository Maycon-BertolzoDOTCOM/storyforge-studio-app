export interface IngestionConfig {
  /** Engine API base URL (default: http://localhost:8000) */
  engineUrl?: string;
  /** Optional API key for authentication */
  apiKey?: string;
}

export interface Product {
  name: string;
  price: string | null;
  description: string | null;
  image_url: string | null;
  sku: string | null;
  source: "jsonld" | "html" | "notept";
}

export interface CatalogResult {
  url: string;
  products: Product[];
}

export interface VideoSummary {
  title: string;
  url: string;
  summary: string;
  key_points: string[];
  products: Product[];
}

export interface CompetitorResult {
  competitor: string;
  products: Product[];
}
