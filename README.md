# Jarvis AI - Local LLM Agent with CSV Training

A React TypeScript application that creates an AI agent powered by local Large Language Models (LLMs) using Ollama, with the ability to train the model using custom CSV data.

## Features

- 🤖 **AI Chat Interface**: Interactive chat with local LLM models
- 📊 **CSV Training**: Upload CSV files to train the AI with custom data
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS 4
- 🔄 **Model Selection**: Choose from various Ollama models
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🚀 **Real-time Chat**: Instant responses with loading indicators

## Prerequisites

Before running this application, you need to:

1. **Install Ollama**: Download and install Ollama from [https://ollama.ai](https://ollama.ai)
2. **Start Ollama Service**: Run `ollama serve` in your terminal
3. **Download Models**: Pull the models you want to use:
   ```bash
   ollama pull llama3.2:3b
   ollama pull llama3.2:8b
   ollama pull mistral:7b
   ollama pull codellama:7b
   ```

## Installation

1. **Navigate to the project directory**:
   ```bash
   cd jarvis-ai
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

## Project Structure

```
jarvis-ai/
├── src/
│   ├── components/
│   │   ├── AIAgent.tsx      # Main chat interface
│   │   └── CSVTraining.tsx  # CSV upload and training
│   ├── App.tsx              # Main application with tabs
│   ├── index.css            # Tailwind CSS styles
│   └── main.tsx             # Application entry point
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies and scripts
```

## Usage

### AI Chat Tab

1. Select a model from the dropdown menu
2. Type your question in the input field
3. Press Enter or click Send
4. View the AI's response in the chat interface

### CSV Training Tab

1. **Prepare your CSV file** with the following format:
   ```csv
   question,answer
   "What is your name?","My name is Jarvis AI"
   "How can you help me?","I can assist you with various tasks"
   ```

2. **Upload the CSV file** using the file input
3. **Select a base model** for training
4. **Enter a custom model name** for your trained version
5. **Click Start Training** to begin the process

## CSV Format Requirements

Your CSV file must contain:
- **Headers**: First row with column names
- **Question Column**: Must contain "question" or "input" in the column name
- **Answer Column**: Must contain "answer", "output", or "response" in the column name
- **Data**: Each subsequent row represents one training example

Example:
```csv
question,answer
"What is the capital of France?","Paris"
"What is 2+2?","4"
```

## Available Models

The application supports these Ollama models:
- **Llama 3.2 (3B)**: Fast, lightweight model
- **Llama 3.2 (8B)**: Balanced performance and quality
- **Mistral (7B)**: High-quality general-purpose model
- **Code Llama (7B)**: Specialized for code-related tasks

## Development

### Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build

### Adding New Models

To add support for new models:

1. Update the model options in `AIAgent.tsx` and `CSVTraining.tsx`
2. Ensure the model is available in Ollama
3. Test the integration

## Troubleshooting

### Common Issues

1. **"Error communicating with Ollama"**
   - Make sure Ollama is running (`ollama serve`)
   - Check if Ollama is accessible at `http://localhost:11434`
   - Verify the model is downloaded (`ollama list`)

2. **CSV parsing errors**
   - Ensure your CSV has proper headers
   - Check that question and answer columns are named correctly
   - Verify CSV format (use the template download feature)

3. **Training not working**
   - Ensure you have sufficient system resources
   - Check browser console for error messages
   - Verify the base model is available

### Performance Tips

- Use smaller models (3B) for faster responses
- Limit CSV training data size for better performance
- Close other applications to free up system resources

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Ollama](https://ollama.ai) for local LLM capabilities
- [Tailwind CSS](https://tailwindcss.com) for styling
- [React](https://reactjs.org) and [TypeScript](https://www.typescriptlang.org) for the framework
- [Vite](https://vitejs.dev) for the build tool

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Ensure all prerequisites are met
4. Open an issue on the repository

---

**Happy AI Chatting! 🤖✨**

# agentic-trainer

Here's what Jarvis AI app does and how it works with Ollama:

##What the App Does
Jarvis AI is a local AI chat application with CSV training capabilities that runs entirely on your local machine using Ollama. It has two main features:

1. AI Chat Interface (AIAgent.tsx)
Connects to your local Ollama instance running on port 11434
Allows you to chat with various local LLM models (Llama 3.2, Mistral, Code Llama)
Provides a clean chat interface with message history
No data leaves your machine - everything is processed locally

2. CSV Training Interface (CSVTraining.tsx)
Upload CSV files with question-answer pairs for training
Parse and validate CSV format (requires "question" and "answer" columns)
Process training data through the selected model
Download CSV templates to get started
How It Works with Ollama
The app uses the official ollama npm package to communicate with your local Ollama server:
   `const ollama = new Ollama({
  host: 'http://localhost:11434'
});`

When you send a message, it calls:
    `const response = await ollama.chat({
  model: modelName,
  messages: [{ role: 'user', content: inputValue }]
});`


CSV Storage vs. Reference

The CSV data is NOT stored permanently in the app. Here's what actually happens:

Upload & Parse: When you upload a CSV, it's parsed in the browser and stored temporarily in React state (trainingData)
Training Process: The app goes through each Q&A pair and:
Sends the question to Ollama
Gets the model's response
Compares it with the expected answer
Logs the results to the console
No Persistent Storage: The CSV data exists only in memory during the session and is lost when you refresh the page

Model Testing: It's essentially testing how well your current model handles the training examples, not actually fine-tuning the model

Current Limitations
The current implementation is more of a model testing tool rather than true fine-tuning:
It doesn't actually modify the underlying model
It doesn't store training data persistently
It's testing the model's responses against your examples
The "training" is really just validation/testing
What You'd Need for True Fine-tuning
To actually fine-tune models with your CSV data, you'd need:
Ollama's fine-tuning capabilities (if available)
Persistent storage for training data
Model modification/creation features
Training data management
Your app is a great foundation for testing how well local models handle specific Q&A patterns, but it's not currently doing actual model training or fine-tuning.

