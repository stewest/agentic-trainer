import React, { useState, useRef, useEffect } from 'react';
import { Ollama } from 'ollama';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI agent. I can help you with questions and tasks. How can I assist you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelName, setModelName] = useState('llama3.2:3b');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ollama = new Ollama({
    host: 'http://localhost:11434'
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await ollama.chat({
        model: modelName,
        messages: [
          {
            role: 'user',
            content: inputValue
          }
        ]
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message.content,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error communicating with Ollama:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while processing your request. Please make sure Ollama is running and try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Jarvis AI Agent</h1>
        <p className="text-gray-600">Powered by local LLM with Ollama</p>

        <div className="mt-4">
          <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Model:
          </label>
          <select
            id="model-select"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="llama3.2:3b">Llama 3.2 (3B)</option>
            <option value="llama3.2:8b">Llama 3.2 (8B)</option>
            <option value="mistral:7b">Mistral (7B)</option>
            <option value="codellama:7b">Code Llama (7B)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 min-h-[500px] max-h-[600px] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                message.isUser ? 'bg-blue-500' : 'bg-green-500'
              }`}>
                {message.isUser ? 'U' : 'AI'}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  {message.isUser ? 'You' : 'AI Agent'} • {message.timestamp.toLocaleTimeString()}
                </p>
                <div className="prose prose-sm max-w-none">
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message ai-message">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-green-500">
                AI
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">AI Agent • Thinking...</p>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything..."
          className="chat-input"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          className="send-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Make sure Ollama is running locally on port 11434</p>
        <p className="mt-1">Current model: {modelName}</p>
      </div>
    </div>
  );
};

export default AIAgent;
