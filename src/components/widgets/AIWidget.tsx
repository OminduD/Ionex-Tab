import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Trash2, Copy, Check, Zap, Bot } from 'lucide-react';

interface AIWidgetProps {
  apiKey: string;
  groqKey?: string;
  size?: 'small' | 'medium' | 'large';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type AIProvider = 'gemini' | 'groq';

const AIWidget: React.FC<AIWidgetProps> = ({ apiKey, groqKey, size = 'medium' }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSmall = size === 'small';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    const currentKey = provider === 'gemini' ? apiKey : groqKey;
    if (!input.trim() || !currentKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let aiResponse = '';

      if (provider === 'gemini') {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: input.trim(),
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error('Gemini API error:', data);
          throw new Error(data.error?.message || 'Gemini API request failed');
        }

        aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
      } else {
        // Groq API
        const response = await fetch(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [
                {
                  role: 'user',
                  content: input.trim(),
                },
              ],
              temperature: 0.7,
              max_tokens: 1024,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error('Groq API error:', data);
          throw new Error(data.error?.message || 'Groq API request failed');
        }

        aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, there was an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key and console for details.`,
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
    <div className={`h-full flex flex-col relative overflow-hidden ${isSmall ? 'p-2' : 'p-4'}`}>
      {/* Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-3xl border border-white/10 shadow-lg" />

      {/* Header */}
      <div className={`relative z-10 flex items-center justify-between ${isSmall ? 'mb-2' : 'mb-4'}`}>
        <div className="flex items-center gap-2">
          <Bot className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
          <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-bold text-white tracking-wide`}>AI Assistant</h3>
        </div>

        <div className="flex items-center gap-1">
          {/* Provider Selector */}
          <div className="flex bg-black/20 rounded-lg p-0.5 border border-white/10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setProvider('gemini')}
              className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${provider === 'gemini'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'text-white/60 hover:text-white/80'
                }`}
              title="Google Gemini AI"
            >
              Gemini
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setProvider('groq')}
              className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1 ${provider === 'groq'
                  ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg'
                  : 'text-white/60 hover:text-white/80'
                }`}
              title="Groq AI (Ultra Fast)"
            >
              <Zap className="w-2 h-2" />
              Groq
            </motion.button>
          </div>

          {messages.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearChat}
              className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors group border border-transparent hover:border-red-500/30 ml-1"
              title="Clear chat history"
            >
              <Trash2 className="w-3.5 h-3.5 text-white/60 group-hover:text-red-400 transition-colors" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence mode='popLayout'>
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
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-xl"
                />
                <Sparkles className={`${isSmall ? 'w-12 h-12' : 'w-16 h-16'} text-primary relative z-10 drop-shadow-2xl`} />
              </div>
              <div className="text-center space-y-1">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`${isSmall ? 'text-sm' : 'text-base'} font-bold text-white`}
                >
                  How can I help?
                </motion.p>
              </div>

              {!isSmall && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-2 w-full max-w-xs"
                >
                  {[
                    { icon: '🧠', text: 'Explain quantum' },
                    { icon: '✍️', text: 'Write a poem' },
                    { icon: '⚡', text: 'Productivity tips' },
                    { icon: '🚀', text: 'Space facts' },
                  ].map((prompt, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setInput(prompt.text)}
                      className="px-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-xs text-white/70 hover:text-white transition-all text-left"
                    >
                      <span className="mr-1">{prompt.icon}</span>
                      <span>{prompt.text}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-3 shadow-lg ${message.role === 'user'
                      ? 'bg-gradient-to-br from-primary via-secondary to-accent text-white'
                      : 'bg-white/10 backdrop-blur-md text-white/90 border border-white/10'
                    }`}
                >
                  <div className={`whitespace-pre-wrap leading-relaxed ${isSmall ? 'text-xs' : 'text-sm'}`}>{message.content}</div>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors group"
                        title="Copy"
                      >
                        {copied === message.id ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-white/40 group-hover:text-white/80" />
                        )}
                      </motion.button>
                      <span className="text-[10px] text-white/30 ml-auto">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
            className="flex justify-start mb-3"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-2 border border-white/10">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -5, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`relative z-10 ${isSmall ? 'mt-2' : 'mt-3'}`}>
        {!(provider === 'gemini' ? apiKey : groqKey) ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2"
          >
            <p className="text-yellow-200/80">
              API Key Required
            </p>
          </motion.div>
        ) : (
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit()}
              placeholder="Ask AI..."
              className={`flex-1 bg-black/20 border border-white/10 rounded-xl px-3 ${isSmall ? 'py-1.5 text-xs' : 'py-2 text-sm'} text-white outline-none focus:border-primary/50 focus:bg-black/40 transition-all placeholder:text-white/30`}
              disabled={loading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className={`bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl ${isSmall ? 'p-1.5' : 'p-2'} transition-all shadow-lg flex items-center justify-center`}
            >
              <Send className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-white`} />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWidget;
