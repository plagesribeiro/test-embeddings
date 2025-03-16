import { useState, useEffect } from 'react';
import { EmbeddingModel } from '../../types';
import { useApiKey } from '../../context/ApiKeyContext';

interface ModelCardProps {
    model: EmbeddingModel;
    isSelected: boolean;
    onToggle: () => void;
}

export function ModelCard({ model, isSelected, onToggle }: ModelCardProps) {
    const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const { apiKeys, setApiKey } = useApiKey();
    const providerKey = model.provider.toLowerCase();
    const needsApiKey = model.requiresApiKey && (!apiKeys[providerKey] || apiKeys[providerKey].trim() === '');

    // Reset validation state when API key changes
    useEffect(() => {
        setIsValidating(false);
    }, [apiKeys[providerKey]]);

    const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newKey = event.target.value.trim();
        setApiKey(providerKey, newKey);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const input = event.currentTarget;
            if (input.value.trim()) {
                setApiKey(providerKey, input.value.trim());
                setIsApiKeyVisible(false);
            }
        }
    };

    return (
        <div
            className={`p-4 rounded-lg cursor-pointer transition-all ${isSelected
                    ? 'bg-blue-900 border-2 border-blue-400'
                    : 'bg-gray-700 border-2 border-gray-600 hover:border-blue-500'
                }`}
            onClick={onToggle}
        >
            <div className="flex items-center mb-2">
                <div
                    className={`w-4 h-4 rounded mr-2 flex items-center justify-center ${isSelected ? 'bg-blue-400' : 'bg-gray-600'
                        }`}
                >
                    {isSelected && (
                        <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </div>
                <span className={`font-medium ${isSelected ? 'text-blue-300' : 'text-gray-200'}`}>
                    {model.name}
                </span>
            </div>
            <div className={`text-sm ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
                {model.dimensions} dimensions
            </div>
            <p
                className={`text-xs mt-1 ${isSelected ? 'text-blue-200 opacity-80' : 'text-gray-500'
                    }`}
            >
                {model.description}
            </p>

            {model.requiresApiKey && (
                <div className="mt-3 border-t border-gray-600 pt-3">
                    {needsApiKey && (
                        <div className="mb-2 text-xs text-red-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            API key required
                        </div>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsApiKeyVisible(!isApiKeyVisible);
                        }}
                        className={`text-sm ${needsApiKey ? 'text-red-400 hover:text-red-300' : 'text-blue-400 hover:text-blue-300'
                            }`}
                    >
                        {isApiKeyVisible ? 'Hide API Key' : 'Set API Key'}
                    </button>
                    {isApiKeyVisible && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2"
                        >
                            <input
                                type="password"
                                value={apiKeys[providerKey] || ''}
                                onChange={handleApiKeyChange}
                                onKeyDown={handleKeyDown}
                                placeholder={`Enter ${model.provider} API Key`}
                                className={`w-full px-3 py-2 bg-gray-800 border rounded text-sm text-gray-200 focus:ring-1 focus:outline-none ${needsApiKey
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                                    }`}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Press Enter to save the API key
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 