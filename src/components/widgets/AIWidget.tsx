import React, { useState } from 'react';
import { callGeminiAPI } from '../../services/api';
import { SparklesIcon, SendIcon } from '../icons';

interface AIWidgetProps {
  apiKey: string;
}

const AIWidget: React.FC<AIWidgetProps> = ({ apiKey }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const result = await callGeminiAPI(input, apiKey);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <SparklesIcon className="w-5 h-5 icon-color" />
        <h3 className="text-lg font-bold">AI Assistant</h3>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit()}
          placeholder="Ask me anything..."
          className="flex-1 bg-white/10 rounded px-3 py-2 text-sm outline-none focus:bg-white/20"
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded px-3 py-2 transition-colors"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white/5 rounded p-3 text-sm scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse">Thinking...</div>
          </div>
        ) : response ? (
          <div className="whitespace-pre-wrap">{response}</div>
        ) : (
          <div className="flex items-center justify-center h-full opacity-50">
            Ask me anything!
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWidget;
