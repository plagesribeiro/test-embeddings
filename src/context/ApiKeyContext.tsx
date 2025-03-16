import { createContext, useContext, useState, ReactNode } from 'react';
import { ApiKeyContextType } from '../types';

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
    const [apiKeys, setApiKeys] = useState<Record<string, string>>({
        openai: import.meta.env.VITE_OPENAI_API_KEY || '',
        cohere: import.meta.env.VITE_COHERE_API_KEY || '',
    });

    const setApiKey = (provider: string, key: string) => {
        const normalizedProvider = provider.toLowerCase();
        setApiKeys(prev => ({ ...prev, [normalizedProvider]: key }));
        // Also update the environment variable
        if (normalizedProvider === 'cohere') {
            (window as any).ENV_COHERE_API_KEY = key;
        }
    };

    return (
        <ApiKeyContext.Provider value={{ apiKeys, setApiKey }}>
            {children}
        </ApiKeyContext.Provider>
    );
}

export function useApiKey() {
    const context = useContext(ApiKeyContext);
    if (context === undefined) {
        throw new Error('useApiKey must be used within an ApiKeyProvider');
    }
    return context;
} 