export class ApiKeyError extends Error {
  constructor(provider: string) {
    super(`${provider} API key is missing. Please set your API key in the model settings.`);
    this.name = 'ApiKeyError';
  }
}

export class EmbeddingError extends Error {
  constructor(message: string, public provider: string) {
    super(message);
    this.name = 'EmbeddingError';
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiKeyError) {
    return error.message;
  }
  if (error instanceof EmbeddingError) {
    return `Error from ${error.provider}: ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}; 