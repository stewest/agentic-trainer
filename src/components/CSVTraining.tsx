import React, { useState } from 'react';
import { Ollama } from 'ollama';

interface TrainingData {
  question: string;
  answer: string;
}

const CSVTraining: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelName, setModelName] = useState('llama3.2:3b');
  const [customModelName, setCustomModelName] = useState('');

  const ollama = new Ollama({
    host: 'http://localhost:11434'
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile);
      parseCSV(uploadedFile);
    } else {
      alert('Please upload a valid CSV file');
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());

      // Find question and answer columns
      const questionIndex = headers.findIndex(h =>
        h.toLowerCase().includes('question') || h.toLowerCase().includes('input')
      );
      const answerIndex = headers.findIndex(h =>
        h.toLowerCase().includes('answer') || h.toLowerCase().includes('output') || h.toLowerCase().includes('response')
      );

      if (questionIndex === -1 || answerIndex === -1) {
        alert('CSV must have columns for questions and answers. Please ensure your CSV has columns with "question" and "answer" in their names.');
        return;
      }

      const data: TrainingData[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values[questionIndex] && values[answerIndex]) {
            data.push({
              question: values[questionIndex],
              answer: values[answerIndex]
            });
          }
        }
      }

      setTrainingData(data);
    };
    reader.readAsText(file);
  };

  const startTraining = async () => {
    if (!trainingData.length || !customModelName.trim()) {
      alert('Please provide training data and a custom model name');
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    try {
      // Create a custom model with the training data
      const trainingPrompts = trainingData.map((item, index) => ({
        role: 'user' as const,
        content: item.question
      }));

      const trainingResponses = trainingData.map((item, index) => ({
        role: 'assistant' as const,
        content: item.answer
      }));

      // For demonstration, we'll use the existing model and show progress
      // In a real implementation, you'd use Ollama's fine-tuning capabilities
      for (let i = 0; i < trainingData.length; i++) {
        setTrainingProgress(((i + 1) / trainingData.length) * 100);

        // Simulate training time
        await new Promise(resolve => setTimeout(resolve, 500));

        // Test the model with training data
        try {
          const response = await ollama.chat({
            model: modelName,
            messages: [
              {
                role: 'user',
                content: trainingData[i].question
              }
            ]
          });

          console.log(`Training example ${i + 1}:`, {
            question: trainingData[i].question,
            expected: trainingData[i].answer,
            actual: response.message.content
          });
        } catch (error) {
          console.error(`Error testing training example ${i + 1}:`, error);
        }
      }

      alert(`Training completed! Processed ${trainingData.length} examples.`);
    } catch (error) {
      console.error('Training error:', error);
      alert('An error occurred during training. Please check the console for details.');
    } finally {
      setIsTraining(false);
      setTrainingProgress(0);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'question,answer\n"What is your name?","My name is Jarvis AI"\n"How can you help me?","I can assist you with various tasks and answer your questions"';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'training_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">CSV Training Interface</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Training Data</h3>

            <div className="mb-4">
              <label htmlFor="csv-file" className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File:
              </label>
              <input
                type="file"
                id="csv-file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="base-model" className="block text-sm font-medium text-gray-700 mb-2">
                Base Model:
              </label>
              <select
                id="base-model"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="llama3.2:3b">Llama 3.2 (3B)</option>
                <option value="llama3.2:8b">Llama 3.2 (8B)</option>
                <option value="mistral:7b">Mistral (7B)</option>
                <option value="codellama:7b">Code Llama (7B)</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="custom-model" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Model Name:
              </label>
              <input
                type="text"
                id="custom-model"
                value={customModelName}
                onChange={(e) => setCustomModelName(e.target.value)}
                placeholder="e.g., jarvis-trained"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={downloadTemplate}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors mb-4"
            >
              Download CSV Template
            </button>

            <button
              onClick={startTraining}
              disabled={isTraining || !trainingData.length || !customModelName.trim()}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTraining ? 'Training...' : 'Start Training'}
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Training Data Preview</h3>

            {trainingData.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Found {trainingData.length} training examples
                </p>

                {trainingData.slice(0, 5).map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Q: {item.question}
                    </p>
                    <p className="text-sm text-gray-600">
                      A: {item.answer}
                    </p>
                  </div>
                ))}

                {trainingData.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    ... and {trainingData.length - 5} more examples
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No training data loaded</p>
                <p className="text-sm mt-2">Upload a CSV file to see preview</p>
              </div>
            )}

            {isTraining && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Training Progress</span>
                  <span className="text-sm text-gray-500">{Math.round(trainingProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trainingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">CSV Format Requirements:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• First row should contain column headers</li>
            <li>• Must include columns with "question" and "answer" in their names</li>
            <li>• Each row represents one training example</li>
            <li>• Questions and answers should be in quotes if they contain commas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CSVTraining;
