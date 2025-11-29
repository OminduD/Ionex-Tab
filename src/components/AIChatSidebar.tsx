import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Trash2, Copy, Check, X, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  groqKey: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIChatSidebar: React.FC<AIChatSidebarProps> = ({ isOpen, onClose, groqKey }) => {
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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!input.trim() || !groqKey) return;

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
        throw new Error(`Error (${response.status}): ${apiErrorMessage}`);
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-[70] flex flex-col overflow-hidden"
          >
            {/* Glass Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-4 bg-white/5 backdrop-blur-md border-b border-white/10">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">AI Assistant</h3>
                  <p className="text-[10px] text-white/50">Powered by Groq LLaMA 3.3</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearChat}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group border border-transparent hover:border-red-500/30"
                    title="Clear chat history"
                  >
                    <Trash2 className="w-4 h-4 text-white/60 group-hover:text-red-400 transition-colors" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5 text-white/70" />
                </motion.button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
              <AnimatePresence mode='popLayout'>
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full space-y-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-2xl"
                      />
                      <Sparkles className="w-16 h-16 text-primary relative z-10 drop-shadow-2xl" />
                    </div>
                    <div className="text-center space-y-2">
                      <h2 className="text-xl font-bold text-white">
                        How can I help you?
                      </h2>
                      <p className="text-sm text-white/60">
                        Ask me anything!
                      </p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="grid gap-2 mt-6 w-full"
                    >
                      {[
                        { icon: '🧠', text: 'Explain quantum computing' },
                        { icon: '✍️', text: 'Write a poem' },
                        { icon: '⚡', text: 'Tips for productivity' },
                        { icon: '🚀', text: 'Fun facts about space' },
                      ].map((prompt, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setInput(prompt.text)}
                          className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-sm text-white/80 hover:text-white transition-all backdrop-blur-sm text-left flex items-center gap-3"
                        >
                          <span className="text-lg">{prompt.icon}</span>
                          <span className="text-xs">{prompt.text}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4 group`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 mr-3 mt-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-4 shadow-lg relative ${message.role === 'user'
                          ? 'bg-gradient-to-br from-primary via-accent to-secondary text-white border border-white/20'
                          : 'bg-white/10 backdrop-blur-md text-white/90 border border-white/10'
                          }`}
                      >
                        <div className="markdown-content text-sm leading-relaxed">
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

                      {message.role === 'user' && (
                        <div className="flex-shrink-0 ml-3 mt-1">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                            <span className="text-sm">👤</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start mb-4"
                >
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-2 border border-white/10">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -5, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
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
            <div className="relative z-10 p-4 bg-white/5 backdrop-blur-md border-t border-white/10">
              {!groqKey ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3"
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
                    placeholder="Type your message..."
                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary/50 focus:bg-black/40 transition-all placeholder:text-white/30"
                    disabled={loading}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 transition-all shadow-lg flex items-center justify-center"
                    title="Send message"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChatSidebar;
