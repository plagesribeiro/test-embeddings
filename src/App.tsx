import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { Button } from './components/common/Button';
import { TextArea } from './components/common/TextArea';
import { ModelCard } from './components/models/ModelCard';
import { InsightsTab } from './components/models/InsightsTab';
import { ErrorDisplay } from './components/common/ErrorDisplay';
import { createModels } from './constants/models';
import { ApiKeyProvider } from './context/ApiKeyContext';
import { cosineSimilarity, euclideanDistance, manhattanDistance } from './utils/vectorCalculations';
import { getErrorMessage } from './utils/errorHandling';
import type { EmbeddingResult, TabState } from './types';
import { ResultCard } from './components/models/ResultCard';

function App() {
  const [text1, setText1] = useState<string>('');
  const [text2, setText2] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(['use']);
  const [results, setResults] = useState<EmbeddingResult[]>([]);
  const [useModel, setUseModel] = useState<use.UniversalSentenceEncoder | null>(null);
  const [activeTab, setActiveTab] = useState<TabState['activeTab']>('compare');
  const [error, setError] = useState<string | null>(null);
  const [modelLoadingError, setModelLoadingError] = useState<string | null>(null);

  // Load Universal Sentence Encoder model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend('cpu'); // Fallback to CPU if WebGL is not available
        await tf.ready();
        const loadedModel = await use.load();
        setUseModel(loadedModel);
        setModelLoadingError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load Universal Sentence Encoder model';
        setModelLoadingError(errorMessage);
        console.error('Failed to load model:', error);
      }
    };

    loadModel();
  }, []);

  const models = createModels(useModel);

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else {
        return [...prev, modelId];
      }
    });
  };

  const compareTexts = async () => {
    if (!text1 || !text2 || selectedModels.length === 0) return;

    setIsLoading(true);
    setError(null);
    const newResults: EmbeddingResult[] = [];

    try {
      for (const modelId of selectedModels) {
        const model = models[modelId];
        const [embedding1, embedding2] = await Promise.all([
          model.embed(text1),
          model.embed(text2)
        ]);

        newResults.push({
          text1,
          text2,
          model: model.name,
          cosineSimilarity: cosineSimilarity(embedding1.embedding, embedding2.embedding),
          euclideanDistance: euclideanDistance(embedding1.embedding, embedding2.embedding),
          manhattanDistance: manhattanDistance(embedding1.embedding, embedding2.embedding),
          timeTaken: embedding1.time + embedding2.time,
          dimensions: model.dimensions
        });
      }

      setResults(newResults);
    } catch (error) {
      setError(getErrorMessage(error));
      console.error('Error comparing texts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ApiKeyProvider>
      <div className="min-h-screen bg-gray-900 text-gray-100 pb-20 overflow-x-hidden">
        <ErrorDisplay error={error} onDismiss={() => setError(null)} />
        {modelLoadingError && (
          <div className="bg-yellow-900 text-yellow-100 p-4">
            <div className="container mx-auto">
              <p className="font-medium">Warning: Universal Sentence Encoder Model Loading Error</p>
              <p className="text-sm mt-1">{modelLoadingError}</p>
              <p className="text-sm mt-1">The model will run on CPU instead of GPU, which may be slower.</p>
            </div>
          </div>
        )}

        {/* Background dots animation */}
        <div className="absolute inset-0 z-0 pointer-events-none min-h-[200vh]">
          {Array.from({ length: 2000 }).map((_, i) => {
            const size = Math.random() > 0.97 ? 'dot-large' : Math.random() > 0.85 ? 'dot-medium' : 'dot';
            const color = Math.random() > 0.92 ? 'bg-purple-400' : Math.random() > 0.84 ? 'bg-blue-300' :
              Math.random() > 0.76 ? 'bg-indigo-400' : 'bg-blue-400';
            const row = Math.floor(i / 50);
            const col = i % 50;
            const randomOffsetX = Math.random() * 2;
            const randomOffsetY = Math.random() * 2;
            const verticalPos = (row * 2) + randomOffsetY;

            return (
              <div
                key={i}
                className={`${size} ${color}`}
                style={{
                  top: `${verticalPos}%`,
                  left: `${(col * 2) + randomOffsetX}%`,
                  animationDelay: `${(i % 20) * 0.3}s`,
                  opacity: Math.random() * 0.18 + 0.08
                }}
              />
            );
          })}
        </div>

        {/* Header */}
        <header className="relative z-10 bg-gradient-to-r from-blue-900 to-purple-900 text-white py-8 shadow-lg">
          <div className="container mx-auto px-4">
            <motion.h1
              className="text-4xl font-bold mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Text Embedding Comparison
            </motion.h1>
            <motion.p
              className="text-lg opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Compare the semantic similarity between two text inputs using multiple models
            </motion.p>
          </div>
        </header>

        <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            <Button
              variant={activeTab === 'compare' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('compare')}
            >
              Compare Models
            </Button>
            <Button
              variant={activeTab === 'insights' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('insights')}
            >
              Model Insights
            </Button>
          </div>

          {/* Insights Tab */}
          {activeTab === 'insights' && <InsightsTab models={models} />}

          {/* Compare Tab Content */}
          {activeTab === 'compare' && (
            <motion.div
              className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-blue-300">Input Texts</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextArea
                  id="text1"
                  label="Text 1"
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  placeholder="Enter your first text here..."
                />
                <TextArea
                  id="text2"
                  label="Text 2"
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  placeholder="Enter your second text here..."
                />
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-medium mb-4 text-blue-300">Model Selection</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.values(models).map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isSelected={selectedModels.includes(model.id)}
                      onToggle={() => toggleModelSelection(model.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={compareTexts}
                  disabled={isLoading || !text1 || !text2 || selectedModels.length === 0 || !useModel}
                  isLoading={isLoading}
                >
                  {`Compare Texts (${selectedModels.length} model${selectedModels.length !== 1 ? 's' : ''})`}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Results Section */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-blue-300">Results</h2>
                <div className="grid grid-cols-1 gap-6">
                  {results.map((result, index) => (
                    <ResultCard key={index} result={result} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </ApiKeyProvider>
  );
}

export default App;
