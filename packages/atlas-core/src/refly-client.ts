/**
 * Refly API Client
 * Handles communication with the Refly skill orchestration platform
 */

export interface ReflyConfig {
  baseUrl: string;
  apiKey?: string;
}

export interface ReflySkill {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  inputSchema: any;
  outputSchema: any;
  enabled: boolean;
}

export interface ReflyWorkflow {
  id: string;
  name: string;
  displayName: string;
  description: string;
  steps: any[];
  enabled: boolean;
}

export interface ExecuteSkillRequest {
  skillId: string;
  input: Record<string, any>;
}

export interface ExecuteSkillResponse {
  success: boolean;
  output?: any;
  error?: string;
  duration?: number;
}

export class ReflyClient {
  private config: ReflyConfig;

  constructor(config: ReflyConfig) {
    this.config = config;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Refly API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.warn('Refly API not available:', error);
      throw error;
    }
  }

  async health(): Promise<boolean> {
    try {
      await this.request('/api/v1/health');
      return true;
    } catch {
      return false;
    }
  }

  async listSkills(): Promise<ReflySkill[]> {
    try {
      const response = await this.request<{ data: ReflySkill[] }>('/api/v1/skills');
      return response.data || [];
    } catch {
      return [];
    }
  }

  async getSkill(id: string): Promise<ReflySkill | null> {
    try {
      return await this.request<ReflySkill>(`/api/v1/skills/${id}`);
    } catch {
      return null;
    }
  }

  async listWorkflows(): Promise<ReflyWorkflow[]> {
    try {
      const response = await this.request<{ data: ReflyWorkflow[] }>('/api/v1/workflows');
      return response.data || [];
    } catch {
      return [];
    }
  }

  async getWorkflow(id: string): Promise<ReflyWorkflow | null> {
    try {
      return await this.request<ReflyWorkflow>(`/api/v1/workflows/${id}`);
    } catch {
      return null;
    }
  }

  async executeSkill(request: ExecuteSkillRequest): Promise<ExecuteSkillResponse> {
    try {
      return await this.request<ExecuteSkillResponse>('/api/v1/skills/execute', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async syncLocalSkills(skills: ReflySkill[]): Promise<{ synced: number; errors: number }> {
    let synced = 0;
    let errors = 0;

    for (const skill of skills) {
      try {
        await this.request('/api/v1/skills', {
          method: 'POST',
          body: JSON.stringify(skill),
        });
        synced++;
      } catch {
        errors++;
      }
    }

    return { synced, errors };
  }
}

export const createReflyClient = (config?: Partial<ReflyConfig>): ReflyClient => {
  return new ReflyClient({
    baseUrl: process.env.REFLY_API_URL || 'http://localhost:5700',
    apiKey: process.env.REFLY_API_KEY,
    ...config,
  });
};
