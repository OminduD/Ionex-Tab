import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Trash2, Copy, Check } from 'lucide-react';

interface AIWidgetProps {
  groqKey: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIWidgetImproved: React.FC<AIWidgetProps> = ({ groqKey }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    const currentKey = groqKey?.trim();
    if (!input.trim() || !currentKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setLoading(true);

    try {
      // Groq API
      console.log('⚡ Using Groq API with key:', currentKey.substring(0, 10) + '...');
      
      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'user',
                content: userInput,
              },
            ],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        }
      );

      console.log('📡 Response status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (!response.ok) {
        console.error('❌ Groq API error:', data);
        console.error('Status code:', response.status);
        console.error('Full error:', JSON.stringify(data, null, 2));
        
        // Extract the actual error message from the API response
        const apiErrorMessage = data.error?.message || data.message || 'Unknown error';
        
        let errorMsg = `Groq API Error (${response.status}): ${apiErrorMessage}`;
        
        // Add helpful hints based on status code
        if (response.status === 401) {
          errorMsg += '\n\n💡 This usually means:\n- Invalid API key\n- API key is not active\n- Go to https://console.groq.com to check your API key';
        } else if (response.status === 429) {
          errorMsg += '\n\n💡 Rate limit exceeded. Free tier has limited requests per minute.';
        } else if (response.status === 404) {
          errorMsg += '\n\n💡 The model might not be available or the endpoint changed.';
        }
        
        throw new Error(errorMsg);
      }
      
      const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('💥 AI Error:', error);
      console.error('Error type:', typeof error);
      console.error('Error details:', error);
      
      let errorContent = 'Sorry, there was an error processing your request.';
      
      if (error instanceof Error) {
        // Check if it's a network error
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorContent = '🌐 Network Error: Unable to connect to the AI service.\n\n💡 Possible causes:\n- No internet connection\n- Firewall blocking the request\n- VPN interfering with the connection\n- API service is down\n\nPlease check your connection and try again.';
        } else if (error.message.includes('CORS')) {
          errorContent = '🚫 CORS Error: Browser blocked the request.\n\n💡 This is a browser security issue. The API might not support direct browser requests.';
        } else {
          errorContent = error.message;
        }
      } else if (typeof error === 'string') {
        errorContent = error;
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-md rounded-lg overflow-hidden border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-6 h-6 icon-color" />
          </motion.div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Assistant (Groq)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4 text-white/60 group-hover:text-red-400 transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full space-y-4"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl"
                />
                <Sparkles className="w-16 h-16 icon-color relative z-10" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-white/80">How can I help you today?</p>
                <p className="text-sm text-white/50 mt-2">Ask me anything!</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  'Explain quantum computing',
                  'Write a poem about code',
                  'Tips for productivity',
                  'Fun facts about space',
                ].map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white/80 hover:text-white transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary to-accent text-white'
                      : 'bg-white/10 backdrop-blur-md text-white/90'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
                        title="Copy"
                      >
                        {copied === message.id ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80" />
                        )}
                      </button>
                      <span className="text-xs text-white/40">{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-theme-primary rounded-full"
                  />
                ))}
              </div>
              <span className="text-sm text-white/70">Thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/10 backdrop-blur-md border-t border-white/10">
        {!groqKey ? (
          <div className="text-center text-sm text-yellow-400 bg-yellow-400/10 rounded-lg p-3">
            ⚠️ Please add your Groq API key in Settings to use AI Assistant
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit()}
              placeholder="Type your message..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white outline-none focus:bg-white/15 focus:border-theme-primary transition-all placeholder:text-white/40"
              disabled={loading}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-6 py-3 transition-all transform hover:scale-105 active:scale-95"
              title="Send message"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWidgetImproved;
