# Text Embedding Models Comparison

A modern web application for comparing different text embedding models, including OpenAI's text embeddings, Cohere's multilingual embeddings, and Google's Universal Sentence Encoder.

## Features

- Compare text similarity using multiple embedding models
- Real-time comparison with cosine similarity, Euclidean distance, and Manhattan distance metrics
- Beautiful and responsive UI with animated background
- Support for multiple embedding models:
  - Universal Sentence Encoder (free, open-source)
  - OpenAI's text-embedding-3-small
  - Cohere's embed-v3
- Detailed model insights and comparisons
- API key management for third-party services

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (for OpenAI models)
- Cohere API key (for Cohere models)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/text-embedding-comparison.git
   cd text-embedding-comparison
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Usage

1. Enter two text snippets you want to compare
2. Select one or more embedding models
3. For Cohere models, you'll need to enter your API key in the model card
4. Click "Compare Texts" to see the results
5. View the "Model Insights" tab for detailed comparisons and analysis

## Project Structure

```
src/
  ├── components/
  │   ├── common/
  │   │   ├── Button.tsx
  │   │   └── TextArea.tsx
  │   └── models/
  │       ├── ModelCard.tsx
  │       └── InsightsTab.tsx
  ├── constants/
  │   └── models.ts
  ├── context/
  │   └── ApiKeyContext.tsx
  ├── styles/
  │   └── dots.css
  ├── types/
  │   └── index.ts
  ├── utils/
  │   └── vectorCalculations.ts
  └── App.tsx
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TensorFlow.js](https://www.tensorflow.org/js) for the Universal Sentence Encoder
- [OpenAI](https://openai.com/) for their text embedding models
- [Cohere](https://cohere.ai/) for their multilingual embedding model
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
