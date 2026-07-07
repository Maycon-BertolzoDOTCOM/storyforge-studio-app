/**
 * MCP (Model Context Protocol) Client
 * Handles communication with MCP servers for tool inspection
 */

export interface McpConfig {
  servers: McpServer[];
}

export interface McpServer {
  name: string;
  url: string;
  description?: string;
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: any;
  serverName: string;
}

export interface McpResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  serverName: string;
}

export interface McpServerStatus {
  name: string;
  url: string;
  connected: boolean;
  tools: McpTool[];
  resources: McpResource[];
  error?: string;
}

export class McpClient {
  private config: McpConfig;

  constructor(config: McpConfig) {
    this.config = config;
  }

  private async requestJsonRpc(serverUrl: string, method: string, params?: any): Promise<any> {
    const response = await fetch(`${serverUrl}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params: params || {},
      }),
    });

    if (!response.ok) {
      throw new Error(`MCP request failed: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || 'MCP error');
    }

    return data.result;
  }

  async getServerStatus(server: McpServer): Promise<McpServerStatus> {
    try {
      const toolsResult = await this.requestJsonRpc(server.url, 'tools/list');
      const resourcesResult = await this.requestJsonRpc(server.url, 'resources/list');

      return {
        name: server.name,
        url: server.url,
        connected: true,
        tools: (toolsResult?.tools || []).map((tool: any) => ({
          ...tool,
          serverName: server.name,
        })),
        resources: (resourcesResult?.resources || []).map((resource: any) => ({
          ...resource,
          serverName: server.name,
        })),
      };
    } catch (error) {
      return {
        name: server.name,
        url: server.url,
        connected: false,
        tools: [],
        resources: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getAllServersStatus(): Promise<McpServerStatus[]> {
    const statuses = await Promise.allSettled(
      this.config.servers.map(server => this.getServerStatus(server))
    );

    return statuses.map((status, index) => {
      if (status.status === 'fulfilled') {
        return status.value;
      }
      return {
        name: this.config.servers[index].name,
        url: this.config.servers[index].url,
        connected: false,
        tools: [],
        resources: [],
        error: status.reason?.message || 'Connection failed',
      };
    });
  }

  async getAllTools(): Promise<McpTool[]> {
    const statuses = await this.getAllServersStatus();
    return statuses.flatMap(status => status.tools);
  }

  async getAllResources(): Promise<McpResource[]> {
    const statuses = await this.getAllServersStatus();
    return statuses.flatMap(status => status.resources);
  }

  async callTool(serverUrl: string, toolName: string, args: any): Promise<any> {
    return this.requestJsonRpc(serverUrl, 'tools/call', {
      name: toolName,
      arguments: args,
    });
  }

  async readResource(serverUrl: string, uri: string): Promise<any> {
    return this.requestJsonRpc(serverUrl, 'resources/read', { uri });
  }
}

export const createMcpClient = (config?: Partial<McpConfig>): McpClient => {
  const defaultServers: McpServer[] = [
    { name: 'StoryForge MCP', url: process.env.STORYFORGE_MCP_URL || 'http://localhost:8003', description: 'Core StoryForge tools' },
    { name: 'Figma MCP', url: process.env.FIGMA_MCP_URL || 'http://localhost:3001/mcp', description: 'Figma integration' },
    { name: 'BrightData MCP', url: process.env.BRIGHTDATA_MCP_URL || 'http://localhost:3002/mcp', description: 'Web scraping' },
  ];

  return new McpClient({
    servers: defaultServers,
    ...config,
  });
};
