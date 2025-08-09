/**
 * API client for TorchANI service
 */

const API_URL = process.env.NEXT_PUBLIC_TORCHANI_API_URL || 'https://torchani.ameyanagi.com/torchani/api/v1';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://torchani.ameyanagi.com/torchani/ws';

export interface OptimizationRequest {
  smiles: string;
  model_name?: string;
  max_steps?: number;
  fmax?: number;
  optimizer?: string;
}

export interface OptimizationResponse {
  success: boolean;
  model_used: string;
  energy: number;
  coordinates: number[][];
  forces: number[][];
  steps_taken: number;
  charge: number;
  elements: number[];
  xyz?: string;
}

export interface JobSubmitResponse {
  job_id: string;
  status: string;
  message: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: OptimizationResponse;
  error?: string;
  created_at: string;
  completed_at?: string;
}

export interface ModelInfo {
  available: boolean;
  loaded: boolean;
  last_used?: number;
  metadata?: any;
}

export interface ModelsResponse {
  models: Record<string, ModelInfo>;
  gpu_stats: {
    device: string;
    memory_usage: number;
    memory_threshold: number;
    models_loaded: number;
    max_models: number;
  };
}

class TorchANIAPI {
  private baseURL: string;
  private wsURL: string;
  private ws: WebSocket | null = null;

  constructor() {
    this.baseURL = API_URL;
    this.wsURL = WS_URL;
  }

  /**
   * Submit a synchronous optimization job
   */
  async optimizeStructure(request: OptimizationRequest): Promise<OptimizationResponse> {
    const response = await fetch(`${this.baseURL}/optimize/smiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Optimization failed');
    }

    return response.json();
  }

  /**
   * Submit an async optimization job
   */
  async submitJob(request: OptimizationRequest): Promise<JobSubmitResponse> {
    const response = await fetch(`${this.baseURL}/jobs/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to submit job');
    }

    return response.json();
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    const response = await fetch(`${this.baseURL}/jobs/${jobId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get job status');
    }

    return response.json();
  }

  /**
   * Poll job status until completion
   */
  async waitForJob(
    jobId: string,
    onProgress?: (progress: number) => void,
    pollInterval: number = 2000
  ): Promise<OptimizationResponse> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getJobStatus(jobId);
          
          if (onProgress) {
            onProgress(status.progress);
          }

          if (status.status === 'completed') {
            resolve(status.result!);
          } else if (status.status === 'failed') {
            reject(new Error(status.error || 'Job failed'));
          } else {
            setTimeout(poll, pollInterval);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  /**
   * Connect to WebSocket for real-time updates
   */
  connectWebSocket(
    jobId: string,
    onMessage: (data: any) => void,
    onError?: (error: Event) => void
  ): void {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(`${this.wsURL}/jobs/${jobId}/progress`);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    this.ws.onerror = (event) => {
      if (onError) {
        onError(event);
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
    };
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * List available models
   */
  async listModels(): Promise<ModelsResponse> {
    const response = await fetch(`${this.baseURL}/models`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to list models');
    }

    return response.json();
  }

  /**
   * Load a model into GPU memory
   */
  async loadModel(modelName: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/models/${modelName}/load`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to load model');
    }
  }

  /**
   * Download results as CSV
   */
  async downloadResultsAsCSV(result: OptimizationResponse, filename: string = 'results.csv'): Promise<void> {
    // Convert result to CSV format
    const headers = ['Energy', 'Model', 'Steps', 'Success'];
    const values = [result.energy, result.model_used, result.steps_taken, result.success];
    
    const csv = [
      headers.join(','),
      values.join(','),
      '',
      'Coordinates',
      result.coordinates.map(coord => coord.join(',')).join('\n'),
      '',
      'XYZ Format',
      result.xyz || '',
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const torchaniAPI = new TorchANIAPI();