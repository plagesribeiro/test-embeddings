import React from 'react';
import { motion } from 'framer-motion';
import { EmbeddingModel } from '../../types';

interface InsightsTabProps {
    models: Record<string, EmbeddingModel>;
}

export const InsightsTab: React.FC<InsightsTabProps> = ({ models }) => {
    return (
        <motion.div
            className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold mb-6 text-blue-300">Model Insights</h2>

            <div className="p-6 space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">Performance Insights</h2>
                    <div className="space-y-4">
                        <p>
                            Among the available models, Cohere's Embed v3 leads with an MTEB score of 65.8, followed by OpenAI's text-embedding-3-large at 64.2 and text-embedding-3-small at 63.5. The Universal Sentence Encoder and text-embedding-ada-002 show competitive performance at 62.4 and 60.9 respectively.
                        </p>
                        <p>
                            OpenAI's models offer different trade-offs:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>text-embedding-3-large: Highest accuracy but also highest cost at $0.13/M tokens</li>
                            <li>text-embedding-3-small: Great balance of performance and cost at $0.02/M tokens</li>
                            <li>text-embedding-ada-002: Legacy model, still competitive but being phased out</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Language Support</h2>
                    <div className="space-y-4">
                        <p>
                            Most models in our collection offer multilingual support:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Cohere Embed v3: Best-in-class multilingual support with 100+ languages</li>
                            <li>OpenAI models (all three): Strong multilingual capabilities</li>
                            <li>Universal Sentence Encoder: English-focused, but handles some multilingual content</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Dimensions Trade-off</h2>
                    <div className="space-y-4">
                        <p>
                            The models offer different vector dimensions, each with its own trade-offs:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>text-embedding-3-large: 3072 dimensions - highest accuracy but more storage and computation needed</li>
                            <li>text-embedding-3-small & ada-002: 1536 dimensions - good balance of accuracy and efficiency</li>
                            <li>Cohere Embed v3: 1024 dimensions - efficient while maintaining high performance</li>
                            <li>Universal Sentence Encoder: 512 dimensions - most compact, good for resource-constrained environments</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">API vs Open Source</h2>
                    <div className="space-y-4">
                        <p>
                            Our collection includes both API-based and open-source solutions:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>API-based (OpenAI, Cohere): Higher accuracy, regular updates, usage-based pricing</li>
                            <li>Open Source (Universal Sentence Encoder): Free to use, runs locally, no API key needed</li>
                        </ul>
                        <p>
                            Consider your specific needs around privacy, cost, and performance when choosing between these options.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Cost Considerations</h2>
                    <div className="space-y-4">
                        <p>
                            API-based models have different pricing structures:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>OpenAI text-embedding-3-small: Most cost-effective at $0.02/M tokens</li>
                            <li>OpenAI text-embedding-3-large: Premium pricing at $0.13/M tokens</li>
                            <li>OpenAI text-embedding-ada-002: Mid-range at $0.10/M tokens</li>
                            <li>Cohere Embed v3: Competitive at $0.15/M tokens</li>
                            <li>Universal Sentence Encoder: Free, only computational costs</li>
                        </ul>
                    </div>
                </section>
            </div>

            {/* MTEB Leaderboard */}
            <div className="mb-8">
                <h3 className="text-xl font-medium mb-4 text-blue-300">MTEB Leaderboard Rankings</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left">
                                <th className="py-2 text-blue-300">Model</th>
                                <th className="py-2 text-blue-300">MTEB Score</th>
                                <th className="py-2 text-blue-300">Provider</th>
                                <th className="py-2 text-blue-300">Open Source</th>
                                <th className="py-2 text-blue-300">Dimensions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(models)
                                .sort((a, b) => (b.mtebScore || 0) - (a.mtebScore || 0))
                                .map((model) => (
                                    <tr key={model.id} className="border-t border-gray-700">
                                        <td className="py-3">{model.name}</td>
                                        <td className="py-3">{model.mtebScore?.toFixed(2) || 'N/A'}</td>
                                        <td className="py-3">{model.provider}</td>
                                        <td className="py-3">{model.isOpenSource ? '✓' : '✗'}</td>
                                        <td className="py-3">{model.dimensions}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Model Comparison Matrix */}
            <div className="mb-8">
                <h3 className="text-xl font-medium mb-4 text-blue-300">Model Comparison Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(models).map((model) => (
                        <div key={model.id} className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                            <h4 className="font-medium text-lg mb-2 text-blue-300">{model.name}</h4>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-gray-400">Max Tokens:</span> {model.maxTokens}</p>
                                <p><span className="text-gray-400">Languages:</span> {model.languages?.join(', ')}</p>
                                <p>
                                    <span className="text-gray-400">Cost:</span>{' '}
                                    {model.costPerMillion ? `$${model.costPerMillion}/M tokens` : 'N/A'}
                                </p>
                                <p><span className="text-gray-400">Specialties:</span></p>
                                <div className="flex flex-wrap gap-2">
                                    {model.specialties?.map((specialty) => (
                                        <span
                                            key={specialty}
                                            className="px-2 py-1 bg-gray-700 rounded-full text-xs"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Key Insights */}
            <div>
                <h3 className="text-xl font-medium mb-4 text-blue-300">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-medium text-lg mb-2 text-indigo-300">Performance vs Cost</h4>
                        <p className="text-gray-300">
                            OpenAI's text-embedding-3-small offers an excellent balance of performance and cost,
                            while Cohere's Embed v3 provides superior multilingual capabilities. The Universal
                            Sentence Encoder is a great free alternative for English-only use cases.
                        </p>
                    </div>
                    <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-medium text-lg mb-2 text-green-300">Language Support</h4>
                        <p className="text-gray-300">
                            Cohere Embed v3 and OpenAI's models excel in multilingual support, making them ideal
                            for global applications. For English-only use cases, USE provides good performance
                            without any API costs.
                        </p>
                    </div>
                    <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-medium text-lg mb-2 text-purple-300">Dimensions Trade-off</h4>
                        <p className="text-gray-300">
                            Higher dimensions (like OpenAI's 1536d) can capture more nuanced relationships but
                            require more storage. Models with 1024 dimensions often provide a good balance of
                            accuracy and efficiency.
                        </p>
                    </div>
                    <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-medium text-lg mb-2 text-amber-300">Open Source vs API</h4>
                        <p className="text-gray-300">
                            API-based solutions like OpenAI and Cohere offer easier implementation but have costs.
                            Open-source options like USE provide free alternatives with good performance for specific use cases.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}; 