import React from 'react';
import { motion } from 'framer-motion';
import { EmbeddingResult } from '../../types';

interface ResultCardProps {
    result: EmbeddingResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
    const getSimilarityColor = (similarity: number) => {
        if (similarity >= 0.8) return 'text-green-400';
        if (similarity >= 0.6) return 'text-blue-400';
        if (similarity >= 0.4) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getDistanceColor = (distance: number, type: 'euclidean' | 'manhattan') => {
        // Normalize distances - lower is better
        const threshold = type === 'euclidean' ? 2 : 4;
        if (distance <= threshold * 0.25) return 'text-green-400';
        if (distance <= threshold * 0.5) return 'text-blue-400';
        if (distance <= threshold * 0.75) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-750 rounded-lg p-6 border border-gray-700"
        >
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-medium text-blue-300">{result.model}</h3>
                    <span className="text-sm text-gray-400">
                        {result.dimensions} dimensions | {result.timeTaken.toFixed(0)}ms
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {/* Cosine Similarity */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Cosine Similarity</span>
                            <span className={`text-lg font-medium ${getSimilarityColor(result.cosineSimilarity)}`}>
                                {result.cosineSimilarity.toFixed(4)}
                            </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${result.cosineSimilarity * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Euclidean Distance */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-400">Euclidean Distance</span>
                            <span className={`text-lg font-medium ${getDistanceColor(result.euclideanDistance, 'euclidean')}`}>
                                {result.euclideanDistance.toFixed(4)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">Lower values indicate higher similarity</p>
                    </div>

                    {/* Manhattan Distance */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-400">Manhattan Distance</span>
                            <span className={`text-lg font-medium ${getDistanceColor(result.manhattanDistance, 'manhattan')}`}>
                                {result.manhattanDistance.toFixed(4)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">Lower values indicate higher similarity</p>
                    </div>
                </div>

                {/* Text Preview */}
                <div className="mt-4 space-y-2">
                    <div className="text-xs text-gray-400">Compared Texts:</div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="bg-gray-800/30 p-2 rounded">
                            {result.text1.length > 100 ? `${result.text1.slice(0, 100)}...` : result.text1}
                        </div>
                        <div className="bg-gray-800/30 p-2 rounded">
                            {result.text2.length > 100 ? `${result.text2.slice(0, 100)}...` : result.text2}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}; 