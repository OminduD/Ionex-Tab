// src/components/QuoteAndIP.tsx
// Component to display random inspirational quotes and user's IP address

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, MapPin } from 'lucide-react';

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Any fool can write code that a computer can understand.", author: "Martin Fowler" },
  { text: "Good code is its own best documentation.", author: "Steve McConnell" },
  { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
  { text: "The function of good software is to make the complex appear simple.", author: "Grady Booch" },
  { text: "It's not a bug; it's an undocumented feature.", author: "Anonymous" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Code never lies, comments sometimes do.", author: "Ron Jeffries" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Learning to write programs stretches your mind.", author: "Bill Gates" },
  { text: "Software is a great combination between artistry and engineering.", author: "Bill Gates" },
  { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
  { text: "Perfection is achieved not when there is nothing more to add.", author: "Antoine de Saint-Exupéry" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
];

export const QuoteAndIP: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);
  const [ipAddress, setIpAddress] = useState<string>('Loading...');
  const [location, setLocation] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  // Fetch IP address on mount
  useEffect(() => {
    fetchIPAddress();
  }, []);

  const fetchIPAddress = async () => {
    try {
      // Using ipapi.co for free IP geolocation
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.ip) {
        setIpAddress(data.ip);
        if (data.city && data.country_name) {
          setLocation(`${data.city}, ${data.country_name}`);
        }
      }
    } catch (error) {
      console.error('Failed to fetch IP address:', error);
      setIpAddress('Unable to fetch IP');
    }
  };

  const handleRefreshQuote = () => {
    setIsRefreshing(true);
    setCurrentQuote(getRandomQuote());
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Change quote every 30 seconds
  useEffect(() => {
    setCurrentQuote(getRandomQuote());
    
    const interval = setInterval(() => {
      setCurrentQuote(getRandomQuote());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mt-8 mb-6"
    >
      {/* Quote Section */}
      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-4">
        <div className="flex items-start justify-between gap-4">
          <motion.div
            key={currentQuote.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <p className="text-white/90 text-lg font-light italic mb-2">
              "{currentQuote.text}"
            </p>
            <p className="text-white/60 text-sm">
              — {currentQuote.author}
            </p>
          </motion.div>
          
          <motion.button
            onClick={handleRefreshQuote}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
            aria-label="Get new quote"
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.6 }}
          >
            <RefreshCw className="w-5 h-5 text-white/70" />
          </motion.button>
        </div>
      </div>

      {/* IP Address Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex items-center justify-center gap-6 text-white/70 text-sm"
      >
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
          <span className="material-icons text-primary" style={{ fontSize: '18px' }}>
            computer
          </span>
          <span>IP: {ipAddress}</span>
        </div>
        
        {location && (
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
            <MapPin className="w-4 h-4 text-secondary" />
            <span>{location}</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
