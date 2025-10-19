// src/components/QuoteAndIP.tsx
// Display random inspirational quotes and IP address

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
      className="mt-8 space-y-4 text-center"
    >
      {/* Quote */}
      {showQuotes && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative px-8 py-4 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 max-w-3xl mx-auto shadow-2xl hover:border-white/30 transition-all duration-300">
            <div className="flex items-start gap-3">
              <span className="material-icons text-primary mt-1 flex-shrink-0 text-2xl">
                format_quote
              </span>
              <p className="text-white/95 text-sm md:text-base italic font-light leading-relaxed flex-1">
                {quote}
              </p>
              <span className="material-icons text-accent mt-1 flex-shrink-0 rotate-180 text-2xl">
                format_quote
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* IP Address - Enhanced with Animation */}
      {showIP && ip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
          className="relative group"
        >
          {/* Animated gradient glow */}
          <motion.div 
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-full blur-2xl"
          />
          
          <div className="relative flex items-center justify-center gap-5 px-8 py-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/30 max-w-xl mx-auto shadow-2xl hover:border-white/40 hover:shadow-primary/20 transition-all duration-300">
            <div className="flex items-center gap-3">
              {/* Animated globe icon */}
              <motion.span 
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity,
                  ease: "linear" 
                }}
                className="material-icons text-primary text-2xl drop-shadow-lg"
              >
                public
              </motion.span>
              
              <span className="text-white/80 text-sm font-medium tracking-wide">IP:</span>
              
              {/* IP Address with pulse effect */}
              <motion.span 
                animate={{ 
                  boxShadow: [
                    '0 0 10px rgba(var(--primary-color-rgb, 167, 139, 250), 0.3)',
                    '0 0 20px rgba(var(--primary-color-rgb, 167, 139, 250), 0.6)',
                    '0 0 10px rgba(var(--primary-color-rgb, 167, 139, 250), 0.3)'
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="text-white font-mono text-sm font-bold bg-gradient-to-r from-white/15 to-white/10 px-4 py-1.5 rounded-lg border border-white/20 backdrop-blur-sm"
              >
                {ip}
              </motion.span>
            </div>
            
            {location && (
              <>
                {/* Animated divider */}
                <motion.div 
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scaleY: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="w-px h-6 bg-gradient-to-b from-transparent via-white/40 to-transparent"
                />
                
                <div className="flex items-center gap-2">
                  {/* Animated location pin */}
                  <motion.span 
                    animate={{ 
                      y: [0, -3, 0],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                    className="material-icons text-accent text-2xl drop-shadow-lg"
                  >
                    location_on
                  </motion.span>
                  
                  <span className="text-white/95 text-sm font-medium">{location}</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuoteAndIP;
