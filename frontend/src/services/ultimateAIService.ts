/**
 * TRON ULTIMATE AI SERVICE
 * Pure class TypeScript service for all AI capabilities
 * Professional API integration, no emojis
 */

export interface ImageGenerationConfig {
  prompt: string;
  config?: Record<string, any>;
}

export interface WebResearchConfig {
  query: string;
  context?: string;
}

export interface CodeExecutionConfig {
  code: string;
  language: string;
  context?: string;
}

export interface BrowserControlConfig {
  task_description: string;
  url?: string;
}

export interface FileCreationConfig {
  content: string;
  filename: string;
  format: string;
}

export interface LiveInteractionConfig {
  interaction_type: string;
  data: Record<string, any>;
}

export interface WorkflowConfig {
  workflow_description: string;
  tasks: Array<{
    type: string;
    config: Record<string, any>;
  }>;
}

export interface SystemAnalytics {
  system_status: string;
  total_requests: number;
  error_count: number;
  error_rate: number;
  uptime_seconds: number;
  capability_usage: Record<string, number>;
  performance_metrics: {
    average_response_time: number;
    total_processing_time: number;
    requests_per_minute: number;
  };
  models_status: Record<string, string>;
  capabilities_status: Record<string, boolean>;
  timestamp: string;
}

export interface PerformanceMetrics {
  performance_metrics: {
    average_response_time: number;
    total_processing_time: number;
    requests_per_minute: number;
  };
  error_rate: number;
  uptime_seconds: number;
  timestamp: string;
}

export interface CapabilityInfo {
  engine_info: {
    name: string;
    version: string;
    model_count: number;
    capability_count: number;
  };
  models: Record<string, string>;
  capabilities: Record<string, {
    description: string;
    model: string;
    features: string[];
  }>;
  timestamp: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface UploadResponse {
  success: boolean;
  filename: string;
  original_filename: string;
  size: number;
  path: string;
  timestamp: string;
}

export interface DownloadResponse {
  success: boolean;
  file_path: string;
  download_url: string;
  size_bytes: number;
  timestamp: string;
}

export class UltimateAIService {
  private readonly baseUrl = '/api/ultimate-ai';
  private readonly apiUrl = '/api';

  // Try multiple API URL patterns for flexibility
  private readonly apiUrls = [
    '/.netlify/functions/api',  // Netlify Functions (primary)
    '/api',                     // Direct API
    '',                         // Root path
    '/functions/api',          // Alternative functions path
  ];

  /**
   * Core API request handler with multiple URL fallback
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Try each API URL pattern
    for (const baseUrl of this.apiUrls) {
      const url = `${baseUrl}${endpoint}`;
      
      try {
        const response = await fetch(url, {
          ...defaultOptions,
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.warn(`API request failed for ${url}: ${error}`);
        continue; // Try next URL
      }
    }
    
    // If all URLs failed
    throw new Error(`All API endpoints failed for endpoint: ${endpoint}`);
  }

  /**
   * System status and health
   */
  async getSystemStatus(): Promise<{
    system: string;
    timestamp: string;
    analytics: SystemAnalytics;
    capabilities: CapabilityInfo;
    uptime: string;
  }> {
    return this.makeRequest('/api');
  }

  /**
   * Get detailed capability information
   */
  async getCapabilities(): Promise<CapabilityInfo> {
    return this.makeRequest('/health');
  }

  /**
   * Image generation using Gemini 2.5 Flash Image
   */
  async generateImages(config: ImageGenerationConfig): Promise<APIResponse> {
    return this.makeRequest('/generate-image', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  /**
   * Web research with Google Search grounding
   */
  async researchWeb(config: WebResearchConfig): Promise<APIResponse> {
    return this.makeRequest('/research-web', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  /**
   * Code execution in Python sandbox
   */
  async executeCode(config: CodeExecutionConfig): Promise<APIResponse> {
    return this.makeRequest('/execute-code', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  /**
   * Browser automation and control
   */
  async controlBrowser(config: BrowserControlConfig): Promise<APIResponse> {
    return this.makeRequest('/control-browser', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  /**
   * File creation and management
   */
  async createFile(config: FileCreationConfig): Promise<DownloadResponse> {
    return this.makeRequest('/create-file', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  /**
   * Real-time voice/video interactions
   */
  async liveInteraction(config: LiveInteractionConfig): Promise<APIResponse> {
    return this.makeRequest('/live-interaction', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  /**
   * Multi-task workflow execution
   */
  async executeWorkflow(config: WorkflowConfig): Promise<APIResponse> {
    return this.makeRequest('/execute-workflow', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  /**
   * File download
   */
  async downloadFile(filename: string): Promise<Blob> {
    const url = `${this.baseUrl}/download/${filename}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }
    
    return response.blob();
  }

  /**
   * File upload
   */
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/upload-file`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * System analytics and monitoring
   */
  async getAnalytics(): Promise<SystemAnalytics> {
    return this.makeRequest('/analytics');
  }

  /**
   * Capability usage statistics
   */
  async getCapabilityUsage(): Promise<{
    capability_usage: Record<string, number>;
    total_requests: number;
    timestamp: string;
  }> {
    return this.makeRequest('/analytics/capabilities-usage');
  }

  /**
   * Performance metrics
   */
  async getPerformanceMetrics(): Promise<{
    performance_metrics: {
      average_response_time: number;
      total_processing_time: number;
      requests_per_minute: number;
    };
    error_rate: number;
    uptime_seconds: number;
    timestamp: string;
  }> {
    return this.makeRequest('/analytics/performance');
  }

  /**
   * AI models status
   */
  async getModelsStatus(): Promise<{
    models_status: Record<string, string>;
    capabilities_status: Record<string, any>;
    timestamp: string;
  }> {
    return this.makeRequest('/analytics/models-status');
  }

  /**
   * Basic health check
   */
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    version: string;
  }> {
    return this.makeRequest('/health');
  }

  /**
   * API status overview
   */
  async getAPIStatus(): Promise<{
    api_status: string;
    endpoints: Record<string, any>;
    capabilities: Record<string, string>;
    timestamp: string;
  }> {
    return this.makeRequest('/status');
  }

  /**
   * Metrics endpoint for monitoring
   */
  async getMetrics(): Promise<Record<string, number>> {
    return this.makeRequest('/metrics');
  }

  /**
   * Bulk workflow execution helper
   */
  async executeBulkWorkflow(tasks: Array<{
    type: string;
    config: Record<string, any>;
    priority?: number;
  }>): Promise<APIResponse> {
    const workflowConfig: WorkflowConfig = {
      workflow_description: 'Bulk workflow execution',
      tasks: tasks.map((task, index) => ({
        type: task.type,
        config: { ...task.config, priority: task.priority || index }
      }))
    };

    return this.executeWorkflow(workflowConfig);
  }

  /**
   * System diagnostics
   */
  async runDiagnostics(): Promise<{
    health: {
      status: string;
      timestamp: string;
      version: string;
    };
    analytics: SystemAnalytics;
    capabilities: CapabilityInfo;
    performance: PerformanceMetrics;
  }> {
    const [health, analytics, capabilities, performance] = await Promise.all([
      this.healthCheck(),
      this.getAnalytics(),
      this.getCapabilities(),
      this.getPerformanceMetrics()
    ]);

    return {
      health,
      analytics,
      capabilities,
      performance
    };
  }
}

// Export singleton instance
export const ultimateAIService = new UltimateAIService();