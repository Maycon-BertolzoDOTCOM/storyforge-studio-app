/**
 * Vivify API Client
 * 
 * Centralized API calls for the Vivify product catalog.
 */

const API_BASE = process.env.NEXT_PUBLIC_ENGINE_URL || 'http://localhost:8000';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  niche: string;
  status: string;
  tags: string[];
  image_url: string | null;
  splat_status: string;
  splat_url: string | null;
  splat_splat_count: number | null;
  splat_quality_score: number | null;
  splat_file_size_mb: number | null;
  has_3d: boolean;
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  image_url: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class VivifyAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async get<T>(path: string): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${path}`);
      const data = await res.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async patch<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async delete<T>(path: string): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  // ── Products ────────────────────────────────────────────────────────────

  async listProducts(category?: string, has3d?: boolean): Promise<ApiResponse<{ products: Product[] }>> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (has3d !== undefined) params.append('has_3d', String(has3d));
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.get(`/api/vivify/products${query}`);
  }

  async getProduct(id: string): Promise<ApiResponse<{ product: Product }>> {
    return this.get(`/api/vivify/products/${id}`);
  }

  async createProduct(data: {
    name: string;
    description?: string;
    price?: number;
    category?: string;
    niche?: string;
    tags?: string[];
  }): Promise<ApiResponse<{ product: Product }>> {
    return this.post('/api/vivify/products', data);
  }

  async updateProduct(id: string, updates: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    tags?: string[];
  }): Promise<ApiResponse<{ product: Product }>> {
    return this.patch(`/api/vivify/products/${id}`, updates);
  }

  async deleteProduct(id: string): Promise<ApiResponse<{ deleted: string }>> {
    return this.delete(`/api/vivify/products/${id}`);
  }

  // ── 3D Viewer ───────────────────────────────────────────────────────────

  async uploadSplat(id: string, data: {
    splat_url: string;
    splat_count?: number;
    file_size_mb?: number;
    quality_score?: number;
  }): Promise<ApiResponse<{ product: Product }>> {
    return this.post(`/api/vivify/products/${id}/splat`, data);
  }

  async getProduct3d(id: string): Promise<ApiResponse<{
    has_3d: boolean;
    splat_url: string | null;
    splat_count: number | null;
    quality_score: number | null;
  }>> {
    return this.get(`/api/vivify/products/${id}/3d`);
  }

  async getViewerHtml(id: string, height?: string): Promise<ApiResponse<{ viewer_html: string }>> {
    const query = height ? `?height=${height}` : '';
    return this.get(`/api/vivify/products/${id}/viewer${query}`);
  }

  async generateLanding(id: string, options?: {
    skybox_url?: string;
    auto_deploy?: boolean;
  }): Promise<ApiResponse<{ landing_page_html: string }>> {
    return this.post(`/api/vivify/products/${id}/landing`, options || {});
  }

  // ── Catalog ─────────────────────────────────────────────────────────────

  async getCatalog(): Promise<ApiResponse<{
    product_count: number;
    products_3d: number;
  }>> {
    return this.get('/api/vivify/catalog');
  }

  async getHealth(): Promise<ApiResponse<{
    status: string;
    product_count: number;
    products_3d: number;
  }>> {
    return this.get('/api/vivify/health');
  }

  // ── Deployment ──────────────────────────────────────────────────────────

  async deployLanding(id: string, options?: {
    provider?: string;
    custom_domain?: string;
  }): Promise<ApiResponse<{ url: string; provider: string }>> {
    return this.post(`/api/vivify/products/${id}/deploy`, options || {});
  }

  // ── Analytics ───────────────────────────────────────────────────────────

  async trackEvent(data: {
    event_type: string;
    product_id: string;
    session_id?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return this.post('/api/vivify/analytics/track', data);
  }

  async getProductAnalytics(id: string): Promise<ApiResponse<{
    total_views: number;
    splat_loads: number;
    splat_interactions: number;
    cta_clicks: number;
    conversions: number;
  }>> {
    return this.get(`/api/vivify/analytics/product/${id}`);
  }

  async getOverallAnalytics(): Promise<ApiResponse<{
    total_events: number;
    total_views: number;
    total_interactions: number;
    total_conversions: number;
    products_viewed: number;
  }>> {
    return this.get('/api/vivify/analytics/overall');
  }
}

export const vivifyApi = new VivifyAPI();
