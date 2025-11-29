// src/components/AIChatSidebar.tsx
// AI Chat as a side panel

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Trash2, Copy, Check, X, MessageSquare } from 'lucide-react';

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
      inputRef.current?.focus();
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
      
      const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md border-b border-white/10">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="relative"
                >
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg"
                  />
                  <Sparkles className="w-6 h-6 text-primary relative z-10 drop-shadow-lg" />
                </motion.div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  AI Assistant
                </h3>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
              <AnimatePresence>
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full space-y-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-2xl"
                      />
                      <MessageSquare className="w-20 h-20 text-primary relative z-10 drop-shadow-2xl" />
                    </div>
                    <div className="text-center space-y-2">
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                      >
                        How can I help you?
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-white/60"
                      >
                        Ask me anything!
                      </motion.p>
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
                          className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-sm text-white/80 hover:text-white transition-all backdrop-blur-sm text-left group"
                        >
                          <span className="text-lg mr-2 group-hover:scale-110 inline-block transition-transform">{prompt.icon}</span>
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
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-primary via-secondary to-accent text-white'
                            : 'bg-white/15 backdrop-blur-md text-white/95 border border-white/20'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/20">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(message.content, message.id)}
                              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
                              title="Copy to clipboard"
                            >
                              {copied === message.id ? (
                                <Check className="w-3.5 h-3.5 text-green-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80" />
                              )}
                            </motion.button>
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/20">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -12, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-accent rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-white/80 font-medium">Thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 backdrop-blur-md border-t border-white/10">
              {!groqKey ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4"
                >
                  <p className="text-yellow-300 font-semibold">⚠️ API Key Required</p>
                  <p className="text-yellow-200/80 mt-1">
                    Please add your Groq API key in Settings
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
                    className="flex-1 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-sm text-white outline-none focus:bg-white/15 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-white/40 backdrop-blur-sm"
                    disabled={loading}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-6 py-3 transition-all shadow-lg"
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
