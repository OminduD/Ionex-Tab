// src/components/AISidePanel.tsx
// AI Assistant as a side panel that slides in from the right

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

// Dynamically import the AI widget for the side panel
const AIWidget = React.lazy(() => import('./widgets/AIWidgetImproved'));

interface AISidePanelProps {
  isEnabled: boolean;
  groqKey: string;
  theme: string;
}

export const AISidePanel: React.FC<AISidePanelProps> = ({ isEnabled, groqKey, theme }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isEnabled) return null;

  return (
    <>
      {/* Toggle Button - Fixed on right side */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={() => setIsOpen(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 px-3 py-4 bg-gradient-to-r from-primary/80 to-accent/80 backdrop-blur-md rounded-l-2xl border border-white/20 border-r-0 shadow-2xl hover:pr-5 transition-all group"
            title="Open AI Assistant"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileHover={{ width: 'auto', opacity: 1 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="text-white font-medium text-sm">AI Assistant</span>
            </motion.div>
            <ChevronLeft className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Side Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg z-50 flex flex-col"
            >
              {/* Panel Header with Close Button */}
              <div className="absolute top-4 left-0 z-10 -translate-x-full">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-3 bg-gradient-to-r from-primary to-accent rounded-l-xl shadow-lg border border-white/20 border-r-0 flex items-center gap-2 group"
                  title="Close AI Assistant"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* AI Widget Container */}
              <div className="h-full bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl shadow-2xl border-l border-white/10">
                <React.Suspense
                  fallback={
                    <div className="h-full flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-8 h-8 text-primary" />
                      </motion.div>
                    </div>
                  }
                >
                  <AIWidget groqKey={groqKey} theme={theme} />
                </React.Suspense>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AISidePanel;
