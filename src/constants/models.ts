import { EmbeddingModel } from '../types';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import OpenAI from 'openai';
import { ApiKeyError, EmbeddingError } from '../utils/errorHandling';

export const createModels = (useModel: use.UniversalSentenceEncoder | null): Record<string, EmbeddingModel> => ({
  use: {
    id: 'use',
    name: 'Universal Sentence Encoder',
    description: "Google's model that encodes text into 512-dimensional vectors",
    dimensions: 512,
    provider: 'Google',
    isOpenSource: true,
    mtebScore: 62.4,
    maxTokens: 512,
    languages: ['English'],
    specialties: ['General Purpose', 'Semantic Similarity'],
    embed: async (text: string) => {
      if (!useModel) throw new Error('Model not loaded');
      try {
        const startTime = performance.now();
        const embeddings = await useModel.embed([text]);
        const embeddingArray = await embeddings.array();
        const endTime = performance.now();
        return { embedding: embeddingArray[0], time: endTime - startTime };
      } catch (error) {
        throw new EmbeddingError(
          error instanceof Error ? error.message : 'Failed to generate embeddings',
          'Universal Sentence Encoder'
        );
      }
    }
  },
  'text-embedding-3-small': {
    id: 'text-embedding-3-small',
    name: 'OpenAI text-embedding-3-small',
    description: "OpenAI's small text embedding model with 1536-dimensional vectors",
    dimensions: 1536,
    provider: 'OpenAI',
    isOpenSource: false,
    mtebScore: 63.5,
    maxTokens: 8191,
    languages: ['Multilingual'],
    costPerMillion: 0.02,
    specialties: ['General Purpose', 'Cross-lingual Understanding'],
    embed: async (text: string) => {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new ApiKeyError('OpenAI');
      }
      try {
        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        const startTime = performance.now();
        const response = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: text,
          encoding_format: "float"
        });
        const endTime = performance.now();
        return { embedding: response.data[0].embedding, time: endTime - startTime };
      } catch (error) {
        throw new EmbeddingError(
          error instanceof Error ? error.message : 'Failed to generate embeddings',
          'OpenAI'
        );
      }
    }
  },
  'text-embedding-3-large': {
    id: 'text-embedding-3-large',
    name: 'OpenAI text-embedding-3-large',
    description: "OpenAI's large text embedding model with 3072-dimensional vectors",
    dimensions: 3072,
    provider: 'OpenAI',
    isOpenSource: false,
    mtebScore: 64.2,
    maxTokens: 8191,
    languages: ['Multilingual'],
    costPerMillion: 0.13,
    specialties: ['General Purpose', 'High Accuracy', 'Cross-lingual Understanding'],
    embed: async (text: string) => {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new ApiKeyError('OpenAI');
      }
      try {
        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        const startTime = performance.now();
        const response = await openai.embeddings.create({
          model: "text-embedding-3-large",
          input: text,
          encoding_format: "float"
        });
        const endTime = performance.now();
        return { embedding: response.data[0].embedding, time: endTime - startTime };
      } catch (error) {
        throw new EmbeddingError(
          error instanceof Error ? error.message : 'Failed to generate embeddings',
          'OpenAI'
        );
      }
    }
  },
  'text-embedding-ada-002': {
    id: 'text-embedding-ada-002',
    name: 'OpenAI text-embedding-ada-002',
    description: "OpenAI's legacy text embedding model with 1536-dimensional vectors",
    dimensions: 1536,
    provider: 'OpenAI',
    isOpenSource: false,
    mtebScore: 60.9,
    maxTokens: 8191,
    languages: ['Multilingual'],
    costPerMillion: 0.1,
    specialties: ['General Purpose', 'Legacy Support'],
    embed: async (text: string) => {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new ApiKeyError('OpenAI');
      }
      try {
        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        const startTime = performance.now();
        const response = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: text,
          encoding_format: "float"
        });
        const endTime = performance.now();
        return { embedding: response.data[0].embedding, time: endTime - startTime };
      } catch (error) {
        throw new EmbeddingError(
          error instanceof Error ? error.message : 'Failed to generate embeddings',
          'OpenAI'
        );
      }
    }
  },
  'cohere-embed-v3': {
    id: 'cohere-embed-v3',
    name: 'Cohere Embed v3',
    description: "Cohere's latest multilingual embedding model with state-of-the-art performance",
    dimensions: 1024,
    provider: 'Cohere',
    isOpenSource: false,
    requiresApiKey: true,
    mtebScore: 65.8,
    maxTokens: 512,
    languages: ['Multilingual (100+ languages)'],
    costPerMillion: 0.15,
    specialties: ['Multilingual', 'Cross-lingual Understanding', 'Technical Documentation'],
    embed: async (text: string) => {
      // Try to get API key from window first (for runtime updates)
      const apiKey = (window as any).ENV_COHERE_API_KEY || import.meta.env.VITE_COHERE_API_KEY;
      
      if (!apiKey || apiKey.trim() === '') {
        throw new ApiKeyError('Cohere');
      }

      try {
        const startTime = performance.now();
        const response = await fetch('https://api.cohere.ai/v1/embed', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            texts: [text],
            model: 'embed-multilingual-v3.0',
            input_type: 'search_document',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const endTime = performance.now();

        if (!data.embeddings || !Array.isArray(data.embeddings) || data.embeddings.length === 0) {
          throw new Error('Invalid response format from Cohere API');
        }

        return { embedding: data.embeddings[0], time: endTime - startTime };
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          throw new ApiKeyError('Cohere');
        }
        throw new EmbeddingError(
          error instanceof Error ? error.message : 'Failed to generate embeddings',
          'Cohere'
        );
      }
    }
  }
}); 