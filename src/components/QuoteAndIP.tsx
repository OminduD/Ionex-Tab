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

  useEffect(() => {
    // Set random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    // Fetch IP address
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        setIp(data.ip);
        // Get location info
        return fetch(`https://ipapi.co/${data.ip}/json/`);
      })
      .then(response => response.json())
      .then(data => {
        if (data.city && data.country_name) {
          setLocation(`${data.city}, ${data.country_name}`);
        }
      })
      .catch(error => {
        console.error('Error fetching IP:', error);
        setIp('Unable to fetch IP');
      });
  }, []);

  // Don't render if both are hidden
  if (!showQuotes && !showIP) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-8 space-y-6 text-center flex flex-col items-center"
    >
      {/* Quote Card */}
      {showQuotes && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative group max-w-3xl w-full"
        >
          {/* Holographic Border */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-xl opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="relative px-8 py-6 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            {/* Scanning Line */}
            <motion.div
              className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            <div className="flex flex-col items-center gap-3 relative z-10">
              <span className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.3em] mb-1">Daily Transmission</span>
              <p className="text-white/90 text-lg md:text-xl font-light italic leading-relaxed text-center drop-shadow-md">
                "{quote.split('-')[0].trim()}"
              </p>
              <div className="w-12 h-[1px] bg-white/20 my-1" />
              <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {quote.split('-')[1]?.trim() || 'Unknown'}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* IP Status Bar */}
      {showIP && ip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-4 px-6 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">IP Address</span>
          </div>

          <div className="w-[1px] h-4 bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="material-icons text-primary text-sm">public</span>
            <span className="text-xs font-mono text-white/80">{ip}</span>
          </div>

          {location && (
            <>
              <div className="w-[1px] h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="material-icons text-accent text-sm">place</span>
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
