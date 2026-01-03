import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Trash2, Copy, Check, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface AIWidgetProps {
  groqKey: string;
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIWidgetImproved: React.FC<AIWidgetProps> = ({ groqKey, size = 'medium', theme = 'aurora' }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { variants, containerStyle } = useThemeAnimation(theme);

  const isSmall = size === 'small';

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

      const data = await response.json();

      if (!response.ok) {
        const apiErrorMessage = data.error?.message || data.message || 'Unknown error';
        let errorMsg = `Error (${response.status}): ${apiErrorMessage}`;

        if (response.status === 401) {
          errorMsg += '\n\n💡 Invalid API key';
        } else if (response.status === 429) {
          errorMsg += '\n\n💡 Rate limit exceeded';
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
      let errorContent = 'Sorry, there was an error processing your request.';

      if (error instanceof Error) {
        errorContent = error.message;
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
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`h-full flex flex-col relative overflow-hidden ${isSmall ? 'p-2' : 'p-4'} rounded-3xl ${containerStyle}`}
    >
      {/* Header */}
      <div className={`relative z-10 flex items-center justify-between ${isSmall ? 'mb-2' : 'mb-4'}`}>
        <div className="flex items-center gap-2">
          <Bot className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
          <div>
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-bold text-white tracking-wide`}>AI Assistant</h3>
            {!isSmall && <p className="text-[10px] text-white/50">Powered by Groq LLaMA 3.3</p>}
          </div>
        </div>

        {messages.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearChat}
            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors group border border-transparent hover:border-red-500/30"
            title="Clear chat"
          >
            <Trash2 className="w-3.5 h-3.5 text-white/60 group-hover:text-red-400 transition-colors" />
          </motion.button>
        )}
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
                <h2 className={`${isSmall ? 'text-sm' : 'text-xl'} font-bold text-white`}>
                  How can I help?
                </h2>
                {!isSmall && (
                  <p className="text-xs text-white/60 max-w-xs mx-auto">
                    I'm powered by Groq's LLaMA 3.3 70B model.
                  </p>
                )}
              </div>

              {!isSmall && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
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
                      className="px-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-xs text-white/70 hover:text-white transition-all text-left flex items-center gap-2"
                    >
                      <span>{prompt.icon}</span>
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
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3 group`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 mr-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-lg relative overflow-hidden ${message.role === 'user'
                    ? 'bg-gradient-to-br from-primary via-accent to-secondary text-white border border-white/20'
                    : 'bg-white/10 backdrop-blur-md text-white/90 border border-white/10'
                    }`}
                >
                  {/* Processing Glow for Assistant */}
                  {message.role === 'assistant' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-50 animate-pulse pointer-events-none" />
                  )}

                  <div className={`markdown-content leading-relaxed relative z-10 ${isSmall ? 'text-xs' : 'text-sm'}`}>
                    {message.role === 'assistant' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          code: ({ node, inline, ...props }: any) =>
                            inline ? (
                              <code className="bg-black/30 px-1 py-0.5 rounded text-xs font-mono" {...props} />
                            ) : (
                              <code className="block bg-black/40 p-2 rounded-lg text-xs font-mono overflow-x-auto my-2" {...props} />
                            ),
                          a: ({ node, ...props }) => <a className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>

                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors group/btn"
                        title="Copy"
                      >
                        {copied === message.id ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-white/40 group-hover/btn:text-white/80" />
                        )}
                      </motion.button>
                      <span className="text-[10px] text-white/30 ml-auto">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
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
            <div className="flex-shrink-0 mr-2 mt-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-2 border border-white/10">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -5, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                    className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-accent"
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
        {!groqKey ? (
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
    </motion.div>
  );
};

export default AIWidgetImproved;
