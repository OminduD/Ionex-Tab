import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Trash2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIWidgetProps {
  groqKey: string;
  theme?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Theme-based particle configurations
const getThemeParticles = (theme: string = 'aurora'): { emoji: string; count: number; animation: string } => {
  const configs: Record<string, { emoji: string; count: number; animation: string }> = {
    ocean: { emoji: '🫧', count: 15, animation: 'bubbles' },
    forest: { emoji: '🍃', count: 12, animation: 'leaves' },
    sunset: { emoji: '✨', count: 20, animation: 'sparkles' },
    midnight: { emoji: '⭐', count: 25, animation: 'stars' },
    neon: { emoji: '⚡', count: 18, animation: 'electric' },
    aurora: { emoji: '🌈', count: 10, animation: 'waves' },
    cherry: { emoji: '🌸', count: 15, animation: 'petals' },
    mint: { emoji: '💎', count: 12, animation: 'sparkles' },
  };
  return configs[theme] || configs.aurora;
};

const AIWidgetImproved: React.FC<AIWidgetProps> = ({ groqKey, theme = 'aurora' }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const themeConfig = getThemeParticles(theme);

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

  // Generate particles for background animation
  const particles = Array.from({ length: themeConfig.count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="h-full flex flex-col relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl" />
      
      {/* Theme-based Particle Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-2xl opacity-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.size}px`,
            }}
            animate={{
              y: themeConfig.animation === 'bubbles' ? [0, -400] : 
                 themeConfig.animation === 'leaves' ? [0, 400] :
                 themeConfig.animation === 'petals' ? [0, 400] :
                 [0, -20, 0],
              x: themeConfig.animation === 'leaves' || themeConfig.animation === 'petals' 
                 ? [0, Math.random() * 100 - 50] 
                 : [0, Math.random() * 20 - 10, 0],
              rotate: themeConfig.animation === 'leaves' || themeConfig.animation === 'petals'
                     ? [0, 360] : 0,
              opacity: [0.1, 0.3, 0.1],
              scale: themeConfig.animation === 'stars' ? [1, 1.5, 1] : 1,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {themeConfig.emoji}
          </motion.div>
        ))}
      </div>

      {/* Glowing Border Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-50"
        style={{
          background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color), var(--primary-color))',
          filter: 'blur(20px)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-5 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center gap-3">
          <motion.div
            className="relative"
            animate={{
              rotate: [0, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-50" />
            <Sparkles className="w-7 h-7 icon-color relative z-10" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              AI Assistant
            </h3>
            <p className="text-xs text-white/50">Powered by Groq LLaMA 3.3</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearChat}
              className="p-2.5 bg-white/10 hover:bg-red-500/20 rounded-xl transition-all group border border-white/10 hover:border-red-400/30"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4 text-white/60 group-hover:text-red-400 transition-colors" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="relative z-10 flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/50">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center h-full space-y-6 px-4"
            >
              {/* Animated Icon */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full blur-2xl opacity-60"
                />
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <Sparkles className="w-20 h-20 icon-color drop-shadow-2xl" />
                </motion.div>
              </div>
              
              {/* Welcome Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-3"
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Welcome to AI Assistant
                </h2>
                <p className="text-base text-white/70 max-w-md">
                  I'm powered by Groq's LLaMA 3.3 70B model. Ask me anything!
                </p>
              </motion.div>
              
              {/* Suggestion Chips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-3 max-w-lg w-full"
              >
                {[
                  { icon: '🧠', text: 'Explain quantum computing' },
                  { icon: '✍️', text: 'Write a poem about code' },
                  { icon: '⚡', text: 'Tips for productivity' },
                  { icon: '🚀', text: 'Fun facts about space' },
                ].map((prompt, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInput(prompt.text)}
                    className="px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-xl text-sm text-white/80 hover:text-white transition-all backdrop-blur-sm border border-white/10 hover:border-white/30 shadow-lg flex items-center gap-2"
                  >
                    <span className="text-lg">{prompt.icon}</span>
                    <span className="flex-1 text-left">{prompt.text}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
              >
                {/* Assistant Avatar */}
                {message.role === 'assistant' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    className="flex-shrink-0 mr-2 mt-1"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>
                )}
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`max-w-[75%] rounded-2xl p-4 shadow-xl relative ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary via-accent to-secondary text-white border border-white/20'
                      : 'bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl text-white/95 border border-white/20'
                  }`}
                >
                  {/* Message glow effect */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity blur-xl ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-primary to-accent' 
                      : 'bg-white/20'
                  }`} />
                  
                  <div className="relative z-10">
                    {message.role === 'assistant' ? (
                      <div className="markdown-content text-sm leading-relaxed">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Headings
                            h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-3 mt-4 text-white border-b border-white/20 pb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-2 mt-3 text-white" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-lg font-semibold mb-2 mt-3 text-white/90" {...props} />,
                            h4: ({node, ...props}) => <h4 className="text-base font-semibold mb-2 mt-2 text-white/90" {...props} />,
                            h5: ({node, ...props}) => <h5 className="text-sm font-semibold mb-1 mt-2 text-white/80" {...props} />,
                            h6: ({node, ...props}) => <h6 className="text-sm font-semibold mb-1 mt-2 text-white/70" {...props} />,
                            
                            // Paragraphs
                            p: ({node, ...props}) => <p className="mb-3 text-white/95 leading-relaxed" {...props} />,
                            
                            // Lists
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1 text-white/90 ml-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1 text-white/90 ml-2" {...props} />,
                            li: ({node, ...props}) => <li className="ml-2 leading-relaxed" {...props} />,
                            
                            // Code
                            code: ({node, inline, ...props}: any) => 
                              inline ? (
                                <code className="bg-black/30 text-cyan-300 px-2 py-0.5 rounded text-xs font-mono border border-cyan-500/30" {...props} />
                              ) : (
                                <code className="block bg-black/40 text-green-300 p-3 rounded-lg text-xs font-mono overflow-x-auto border border-green-500/20 my-2 leading-relaxed" {...props} />
                              ),
                            pre: ({node, ...props}) => <pre className="bg-black/40 rounded-lg p-3 overflow-x-auto border border-white/10 my-3 shadow-lg" {...props} />,
                            
                            // Links
                            a: ({node, ...props}) => <a className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                            
                            // Blockquotes
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary/60 pl-4 py-2 my-3 bg-white/5 rounded-r italic text-white/80" {...props} />,
                            
                            // Tables
                            table: ({node, ...props}) => <div className="overflow-x-auto my-3"><table className="min-w-full border-collapse border border-white/20 rounded-lg overflow-hidden" {...props} /></div>,
                            thead: ({node, ...props}) => <thead className="bg-white/10" {...props} />,
                            tbody: ({node, ...props}) => <tbody {...props} />,
                            tr: ({node, ...props}) => <tr className="border-b border-white/10 hover:bg-white/5 transition-colors" {...props} />,
                            th: ({node, ...props}) => <th className="px-4 py-2 text-left font-semibold text-white border border-white/20" {...props} />,
                            td: ({node, ...props}) => <td className="px-4 py-2 text-white/90 border border-white/10" {...props} />,
                            
                            // Horizontal rule
                            hr: ({node, ...props}) => <hr className="my-4 border-white/20" {...props} />,
                            
                            // Strong/Bold
                            strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                            
                            // Emphasis/Italic
                            em: ({node, ...props}) => <em className="italic text-white/95" {...props} />,
                            
                            // Strikethrough
                            del: ({node, ...props}) => <del className="line-through text-white/70" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                        {message.content}
                      </div>
                    )}
                    {message.role === 'assistant' && (
                      <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-white/20">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-all group/btn backdrop-blur-sm"
                          title="Copy message"
                        >
                          {copied === message.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-white/60 group-hover/btn:text-white/90" />
                          )}
                        </motion.button>
                        <span className="text-xs text-white/50 font-mono">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    {message.role === 'user' && (
                      <div className="flex justify-end mt-2">
                        <span className="text-xs text-white/70 font-mono">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
                
                {/* User Avatar */}
                {message.role === 'user' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    className="flex-shrink-0 ml-2 mt-1"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                      <span className="text-sm">👤</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex justify-start group"
          >
            {/* AI Avatar */}
            <div className="flex-shrink-0 mr-2 mt-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </div>
            
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 border border-white/20 shadow-xl">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -12, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ 
                      duration: 0.8, 
                      repeat: Infinity, 
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                    className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg"
                  />
                ))}
              </div>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-sm text-white/80 font-medium"
              >
                AI is thinking...
              </motion.span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-5 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-md border-t border-white/20">
        {!groqKey ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-yellow-300 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 backdrop-blur-sm border border-yellow-400/30 shadow-lg"
          >
            <span className="text-lg mr-2">⚠️</span>
            <span className="font-medium">Please add your Groq API key in Settings to use AI Assistant</span>
          </motion.div>
        ) : (
          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit()}
                placeholder="Type your message... (Press Enter to send)"
                className="w-full bg-white/10 border-2 border-white/20 focus:border-primary rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:bg-white/15 transition-all placeholder:text-white/40 font-medium backdrop-blur-sm shadow-lg"
                disabled={loading}
              />
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))',
                  filter: 'blur(15px)',
                  zIndex: -1,
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="relative bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-7 py-3.5 transition-all shadow-xl border border-white/20 overflow-hidden group"
              title="Send message"
            >
              {/* Button glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
              <Send className="w-5 h-5 text-white relative z-10" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWidgetImproved;
