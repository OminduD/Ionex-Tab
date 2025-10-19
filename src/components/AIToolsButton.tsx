// src/components/AIToolsButton.tsx
// Fixed AI Tools button in bottom-left corner

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiOpenai, SiGoogle, SiMeta } from 'react-icons/si';
import { Sparkles, Bot, Lightbulb, MessageSquare, Zap, Brain, Code, Search } from 'lucide-react';

interface AITool {
  name: string;
  url: string;
  icon: React.ElementType;
  color: string;
}

const aiTools: AITool[] = [
  { name: 'ChatGPT', url: 'https://chat.openai.com', icon: SiOpenai, color: '#10a37f' },
  { name: 'Gemini', url: 'https://gemini.google.com', icon: SiGoogle, color: '#4285f4' },
  { name: 'Claude', url: 'https://claude.ai', icon: Lightbulb, color: '#d97757' },
  { name: 'Copilot', url: 'https://copilot.microsoft.com', icon: Bot, color: '#00a4ef' },
  { name: 'Meta AI', url: 'https://www.meta.ai', icon: SiMeta, color: '#0668e1' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai', icon: Search, color: '#20808d' },
  { name: 'You.com', url: 'https://you.com', icon: MessageSquare, color: '#00a3ff' },
  { name: 'Mistral', url: 'https://chat.mistral.ai', icon: Zap, color: '#ff7000' },
  { name: 'Pi AI', url: 'https://pi.ai', icon: Brain, color: '#ff6b6b' },
  { name: 'DeepSeek', url: 'https://chat.deepseek.com', icon: Code, color: '#4a9eff' },
  { name: 'Grok AI', url: 'https://x.com/i/grok', icon: Zap, color: '#f97316' },
  { name: 'HuggingChat', url: 'https://huggingface.co/chat', icon: MessageSquare, color: '#ffbe0b' },
];

export const AIToolsButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToolClick = (url: string) => {
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="mb-3 grid grid-cols-2 gap-2 max-h-[70vh] overflow-y-auto scrollbar-thin p-2 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10"
          >
            {aiTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <motion.button
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToolClick(tool.url)}
                  className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/30 transition-all group"
                  title={tool.name}
                >
                  <IconComponent 
                    className="w-4 h-4 transition-colors flex-shrink-0" 
                    style={{ color: tool.color }}
                  />
                  <span className="text-white text-xs font-medium truncate">{tool.name}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isOpen ? 'rotate-180' : ''
        }`}
        style={{
          background: `linear-gradient(to bottom right, var(--primary-color), var(--secondary-color), var(--accent-color))`
        }}
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
};

export default AIToolsButton;
