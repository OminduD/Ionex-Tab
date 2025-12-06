// src/components/QuoteAndIP.tsx
// Display random inspirational quotes and IP address - Futuristic Data Card Design

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Code is like humor. When you have to explain it, it's bad. - Cory House",
  "First, solve the problem. Then, write the code. - John Johnson",
  "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
  "In order to be irreplaceable, one must always be different. - Coco Chanel",
  "Simplicity is the soul of efficiency. - Austin Freeman",
  "Make it work, make it right, make it fast. - Kent Beck",
  "The best error message is the one that never shows up. - Thomas Fuchs",
  "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away. - Antoine de Saint-Exupery",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
  "The most disastrous thing that you can ever learn is your first programming language. - Alan Kay",
  "Programming isn't about what you know; it's about what you can figure out. - Chris Pine",
  "The best way to predict the future is to invent it. - Alan Kay",
  "Stay hungry, stay foolish. - Steve Jobs",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  "Be yourself; everyone else is already taken. - Oscar Wilde",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The only impossible journey is the one you never begin. - Tony Robbins",
  "Life is what happens when you're busy making other plans. - John Lennon",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "It is during our darkest moments that we must focus to see the light. - Aristotle",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson"
];

interface QuoteAndIPProps {
  showQuotes?: boolean;
  showIP?: boolean;
}

export const QuoteAndIP: React.FC<QuoteAndIPProps> = ({ showQuotes = true, showIP = true }) => {
  const [quote, setQuote] = useState('');
  const [ip, setIp] = useState('');
  const [location, setLocation] = useState('');
  const [loadingQuote, setLoadingQuote] = useState(false);

  const generateQuote = () => {
    setLoadingQuote(true);
    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
      setLoadingQuote(false);
    }, 300);
  };

  useEffect(() => {
    generateQuote();

    // Fetch IP address with fallback
    const fetchIP = async () => {
      try {
        // Try primary service
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) throw new Error('Primary IP fetch failed');
        const data = await response.json();
        setIp(data.ip);

        // Get location info
        try {
          const locResponse = await fetch(`https://ipapi.co/${data.ip}/json/`);
          if (locResponse.ok) {
            const locData = await locResponse.json();
            if (locData.city && locData.country_name) {
              setLocation(`${locData.city}, ${locData.country_name}`);
            }
          }
        } catch (e) {
          console.warn('Location fetch failed', e);
        }

      } catch (error) {
        console.warn('Primary IP fetch failed, trying fallback...', error);
        try {
          // Fallback service (HTTPS)
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          setIp(data.ip);
          setLocation(`${data.city}, ${data.country_name}`);
        } catch (fallbackError) {
          console.error('All IP fetch attempts failed', fallbackError);
          setIp('Unavailable');
        }
      }
    };

    fetchIP();
  }, []);

  // Don't render if both are hidden
  if (!showQuotes && !showIP) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-8 space-y-6 text-center flex flex-col items-center w-full max-w-4xl mx-auto px-4"
    >
      {/* Quote Card */}
      {showQuotes && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative group w-full"
        >
          <div className="relative p-8 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:bg-black/30 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.2)]">

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            {/* Quote Content */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-primary/50" />
                <span className="text-[10px] font-mono text-primary/80 uppercase tracking-[0.3em]">Daily Insight</span>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-primary/50" />
              </div>

              <motion.div
                key={quote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <span className="absolute -top-4 -left-6 text-4xl text-white/10 font-serif">"</span>
                <p className="text-white/90 text-xl md:text-2xl font-light leading-relaxed text-center drop-shadow-md max-w-2xl mx-auto">
                  {quote.split('-')[0].trim()}
                </p>
                <span className="absolute -bottom-8 -right-6 text-4xl text-white/10 font-serif">"</span>
              </motion.div>

              <div className="mt-4 flex flex-col items-center gap-2">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-accent">
                  {quote.split('-')[1]?.trim() || 'Unknown'}
                </span>
              </div>

              {/* Controls */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                <button
                  onClick={generateQuote}
                  disabled={loadingQuote}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  title="New Quote"
                >
                  <span className={`material-icons text-sm ${loadingQuote ? 'animate-spin' : ''}`}>refresh</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* IP Status Bar */}
      {showIP && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="inline-flex items-center gap-6 px-8 py-3 bg-black/40 backdrop-blur-md rounded-full border border-white/5 shadow-lg hover:border-primary/30 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-20" />
            </div>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Network Status</span>
          </div>

          <div className="w-[1px] h-4 bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="material-icons text-primary/80 text-sm group-hover:text-primary transition-colors">public</span>
            <span className="text-xs font-mono text-white/80 tracking-wide">{ip || 'Connecting...'}</span>
          </div>

          {location && (
            <>
              <div className="w-[1px] h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="material-icons text-accent/80 text-sm group-hover:text-accent transition-colors">place</span>
                <span className="text-xs font-medium text-white/80">{location}</span>
              </div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuoteAndIP;
