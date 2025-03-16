export interface EmbeddingModel {
  id: string;
  name: string;
  description: string;
  embed: (text: string) => Promise<{ embedding: number[], time: number }>;
  dimensions: number;
  mtebScore?: number;
  maxTokens?: number;
  languages?: string[];
  costPerMillion?: number;
  specialties?: string[];
  provider: string;
  isOpenSource: boolean;
  requiresApiKey?: boolean;
}

export interface EmbeddingResult {
  text1: string;
  text2: string;
  cosineSimilarity: number;
  euclideanDistance: number;
  manhattanDistance: number;
  model: string;
  timeTaken: number;
  dimensions: number;
}

export type TabState = {
  activeTab: 'compare' | 'insights' | 'domain-specific';
};

export interface ApiKeyContextType {
  apiKeys: Record<string, string>;
  setApiKey: (provider: string, key: string) => void;
} 