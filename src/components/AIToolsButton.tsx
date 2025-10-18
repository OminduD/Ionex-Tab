// src/components/AIToolsButton.tsx
// Fixed AI Tools button in bottom-left corner

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiOpenai, SiGoogle, SiMeta } from 'react-icons/si';
import { Sparkles, Bot, Lightbulb } from 'lucide-react';

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
            className="mb-3 space-y-2"
          >
            {aiTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <motion.button
                  key={tool.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToolClick(tool.url)}
                  className="flex items-center gap-3 px-4 py-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:border-white/30 transition-all group w-40"
                  title={tool.name}
                >
                  <IconComponent 
                    className="w-5 h-5 transition-colors" 
                    style={{ color: tool.color }}
                  />
                  <span className="text-white text-sm font-medium">{tool.name}</span>
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
        className={`w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 shadow-lg flex items-center justify-center transition-all ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
};

export default AIToolsButton;
