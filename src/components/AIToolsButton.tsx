// src/components/AIToolsButton.tsx
// Fixed AI Tools button in bottom-left corner - Futuristic AI Core Design

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiOpenai, SiGoogle, SiMeta } from 'react-icons/si';
import { Bot, Lightbulb, MessageSquare, Zap, Brain, Code, Search, Cpu } from 'lucide-react';

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

import { getThemeStyles } from '../utils/themeStyles';

interface AIToolsButtonProps {
  theme: string;
}

export const AIToolsButton: React.FC<AIToolsButtonProps> = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const styles = getThemeStyles(theme);

  const handleToolClick = (url: string) => {
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 left-8 z-50 flex items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            className={`mb-2 grid grid-cols-3 gap-3 p-4 bg-black/80 backdrop-blur-xl rounded-2xl border shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[60vh] overflow-y-auto scrollbar-thin ${styles.aiButton.border}`}
          >
            {aiTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <motion.button
                  key={tool.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToolClick(tool.url)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div
                    className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors relative z-10"
                    style={{ boxShadow: `0 0 15px ${tool.color}20` }}
                  >
                    <IconComponent
                      className="w-5 h-5 transition-transform group-hover:rotate-12"
                      style={{ color: tool.color }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-white/70 group-hover:text-white transition-colors">{tool.name}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main AI Core Button */}
      <div className="relative group">
        {/* Pulsing Aura */}
        <div className={`absolute inset-0 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse opacity-50 ${styles.aiButton.glow}`} />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-xl border shadow-2xl overflow-hidden ${styles.aiButton.border}`}
        >
          {/* Rotating Reactor Ring */}
          <motion.div
            className={`absolute inset-0 rounded-full border-2 border-dashed opacity-50 ${styles.aiButton.border}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner Core */}
          <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-black shadow-inner border border-white/10`}>
            <Cpu className={`w-5 h-5 transition-all duration-300 ${isOpen ? 'rotate-180 scale-110' : ''} ${styles.aiButton.text}`} />
          </div>

          {/* Scanning Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent -translate-y-full group-hover:animate-[scan_2s_infinite]" />
        </motion.button>

        {/* Label Tooltip */}
        <div className={`absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg border text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none ${styles.aiButton.border} ${styles.aiButton.text}`}>
          AI_NEXUS
        </div>
      </div>
    </div>
  );
};

export default AIToolsButton;
