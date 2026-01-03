import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Trash2, Copy, Check, X, Bot, Cpu, Zap } from 'lucide-react';
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
            initial={{ x: '100%', rotateY: -10 }}
            animate={{ x: 0, rotateY: 0 }}
            exit={{ x: '100%', rotateY: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ perspective: 1000 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#050a14]/95 backdrop-blur-2xl border-l border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.15)] z-[70] flex flex-col overflow-hidden"
          >
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* Decorative Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-5 border-b border-cyan-500/10 bg-black/20 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050a14] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                    IONEX AI
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/20">BETA</span>
                  </h3>
                  <p className="text-[10px] text-cyan-300/60 font-mono tracking-wider">SYSTEM ONLINE • LLaMA 3.3</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearChat}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group border border-transparent hover:border-red-500/20"
                    title="Clear chat history"
                  >
                    <Trash2 className="w-4 h-4 text-white/40 group-hover:text-red-400 transition-colors" />
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
            <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
              <AnimatePresence mode='popLayout'>
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full space-y-8"
                  >
                    <div className="relative group">
                      <motion.div
                        animate={{
                          rotate: 360,
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"
                      />
                      <div className="relative w-24 h-24 rounded-2xl bg-black/40 border border-cyan-500/30 flex items-center justify-center backdrop-blur-xl">
                        <Cpu className="w-12 h-12 text-cyan-400" />
                      </div>
                    </div>

                    <div className="text-center space-y-2 max-w-[280px]">
                      <h2 className="text-2xl font-bold text-white tracking-tight">
                        System Ready
                      </h2>
                      <p className="text-sm text-cyan-200/50">
                        Initiate conversation. I can assist with code, analysis, or creative tasks.
                      </p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="grid grid-cols-2 gap-3 w-full max-w-sm px-4"
                    >
                      {[
                        { icon: <Zap className="w-4 h-4 text-yellow-400" />, text: 'Brainstorm ideas' },
                        { icon: <Cpu className="w-4 h-4 text-cyan-400" />, text: 'Explain code' },
                        { icon: <Sparkles className="w-4 h-4 text-purple-400" />, text: 'Write a story' },
                        { icon: <Bot className="w-4 h-4 text-green-400" />, text: 'Just chat' },
                      ].map((prompt, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setInput(prompt.text)}
                          className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 rounded-xl text-xs text-white/70 hover:text-white transition-all backdrop-blur-sm flex flex-col items-center gap-2 text-center group"
                        >
                          <div className="p-2 rounded-lg bg-black/30 group-hover:bg-black/50 transition-colors">
                            {prompt.icon}
                          </div>
                          {prompt.text}
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: message.role === 'user' ? 50 : -50, y: 20 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 mr-3 mt-1">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-cyan-400" />
                          </div>
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-4 shadow-lg relative ${message.role === 'user'
                          ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-[0_4px_20px_rgba(6,182,212,0.2)]'
                          : 'bg-[#0A101F]/80 backdrop-blur-md text-gray-100 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
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
                                    <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs font-mono text-cyan-300" {...props} />
                                  ) : (
                                    <code className="block bg-[#050a14] p-3 rounded-lg text-xs font-mono overflow-x-auto my-2 border border-white/5 text-gray-300" {...props} />
                                  ),
                                a: ({ node, ...props }) => <a className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-cyan-500/50 pl-3 italic text-white/60 my-2" {...props} />,
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          ) : (
                            message.content
                          )}
                        </div>

                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(message.content, message.id)}
                              className="p-1.5 hover:bg-white/5 rounded-md transition-colors group/btn flex items-center gap-1.5"
                              title="Copy"
                            >
                              {copied === message.id ? (
                                <Check className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-white/30 group-hover/btn:text-cyan-400 transition-colors" />
                              )}
                              <span className="text-[10px] text-white/30 group-hover/btn:text-white/50">Copy</span>
                            </motion.button>
                            <span className="text-[10px] text-white/20 ml-auto font-mono">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div className="flex-shrink-0 ml-3 mt-1">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                            <span className="text-xs font-bold text-white">YOU</span>
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
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>

                  <div className="bg-[#0A101F]/80 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                    <span className="text-xs text-cyan-400 font-mono animate-pulse">PROCESSING</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            height: [4, 12, 4],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                          className="w-1 bg-cyan-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="relative z-10 p-5 bg-[#050a14]/80 backdrop-blur-xl border-t border-cyan-500/10">
              {!groqKey ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4"
                >
                  <p className="text-yellow-200/80 font-medium">
                    ⚠️ API Key Required
                  </p>
                  <p className="text-yellow-200/50 mt-1">
                    Please add your Groq API key in Settings &gt; Network
                  </p>
                </motion.div>
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity blur" />
                  <div className="relative flex gap-2 bg-[#0A101F] rounded-xl p-1.5 border border-white/10 group-focus-within:border-cyan-500/50 transition-colors">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit()}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/20 font-medium"
                      disabled={loading}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      disabled={loading || !input.trim()}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-2.5 transition-all shadow-lg flex items-center justify-center"
                      title="Send message"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>
              )}
              <div className="text-[10px] text-center mt-3 text-white/20 font-mono">
                AI can make mistakes. Verify important information.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChatSidebar;
