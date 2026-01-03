// src/components/QuoteAndIP.tsx
// Display random inspirational quotes and IP address - Futuristic Data Card Design

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlitchText } from './GlitchText';
import { Globe, MapPin, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
  const [displayedIP, setDisplayedIP] = useState('INITIALIZING...');
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  const [lastKnownNetwork, setLastKnownNetwork] = useLocalStorage<{
    ip: string;
    location: string;
    updatedAt: string;
  } | null>('ionex_last_known_network_v1', null);

  const hasLastKnown = useMemo(() => {
    return Boolean(lastKnownNetwork?.ip);
  }, [lastKnownNetwork?.ip]);

  const generateQuote = useCallback(() => {
    setLoadingQuote(true);
    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
      setLoadingQuote(false);
    }, 500);
  }, []);

  // Generate quote once on mount (prevents quote refreshing when IP state changes)
  useEffect(() => {
    if (!showQuotes) return;
    generateQuote();
  }, [generateQuote, showQuotes]);

  // Matrix-style decoding animation for IP
  useEffect(() => {
    if (!ip) return;

    if (ip === 'OFFLINE' || ip === 'Unavailable') {
      setDisplayedIP(ip);
      return;
    }

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayedIP(() =>
        ip.split('')
          .map((char, index) => {
            if (index < iterations) return char;
            return String.fromCharCode(48 + Math.floor(Math.random() * 10)); // Random digits
          })
          .join('')
      );

      if (iterations >= ip.length) clearInterval(interval);
      iterations += 1 / 2;
    }, 30);

    return () => clearInterval(interval);
  }, [ip]);

  const applyOfflineState = useCallback(() => {
    if (lastKnownNetwork?.ip) {
      setIp(lastKnownNetwork.ip);
      setLocation(lastKnownNetwork.location || '');
      setDisplayedIP(lastKnownNetwork.ip);
      return;
    }

    setIp('OFFLINE');
    setLocation('');
    setDisplayedIP('OFFLINE');
  }, [lastKnownNetwork]);

  const applyLastKnownState = useCallback(() => {
    if (!lastKnownNetwork?.ip) return false;
    setIp(lastKnownNetwork.ip);
    setLocation(lastKnownNetwork.location || '');
    setDisplayedIP(lastKnownNetwork.ip);
    return true;
  }, [lastKnownNetwork]);

  const fetchWithTimeout = useCallback(async (url: string, timeoutMs: number) => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(url, {
        signal: controller.signal,
        cache: 'no-store',
      });
    } finally {
      window.clearTimeout(timer);
    }
  }, []);

  const fetchIP = useCallback(async () => {
    if (!navigator.onLine) {
      applyOfflineState();
      return;
    }

    try {
      let resolvedIp: string | null = null;

      // 1) Primary: ipify JSON
      try {
        const response = await fetchWithTimeout('https://api.ipify.org?format=json', 4500);
        if (!response.ok) throw new Error(`ipify json status ${response.status}`);
        const data = await response.json();
        if (typeof data?.ip === 'string' && data.ip.trim()) {
          resolvedIp = data.ip.trim();
        }
      } catch (e) {
        console.warn('IP fetch: ipify JSON failed', e);
      }

      // 2) Fallback: ipify plain text
      if (!resolvedIp) {
        try {
          const response = await fetchWithTimeout('https://api.ipify.org', 4500);
          if (!response.ok) throw new Error(`ipify text status ${response.status}`);
          const text = (await response.text()).trim();
          if (text) resolvedIp = text;
        } catch (e) {
          console.warn('IP fetch: ipify text failed', e);
        }
      }

      // 3) Fallback: AWS checkip (very simple text)
      if (!resolvedIp) {
        try {
          const response = await fetchWithTimeout('https://checkip.amazonaws.com/', 4500);
          if (!response.ok) throw new Error(`checkip status ${response.status}`);
          const text = (await response.text()).trim();
          if (text) resolvedIp = text;
        } catch (e) {
          console.warn('IP fetch: checkip failed', e);
        }
      }

      // 4) Last resort: ipapi.co JSON (sometimes blocked for some users)
      if (!resolvedIp) {
        try {
          const response = await fetchWithTimeout('https://ipapi.co/json/', 4500);
          if (!response.ok) throw new Error(`ipapi json status ${response.status}`);
          const data = await response.json();
          if (typeof data?.ip === 'string' && data.ip.trim()) {
            resolvedIp = data.ip.trim();
          }
        } catch (e) {
          console.warn('IP fetch: ipapi JSON failed', e);
        }
      }

      if (!resolvedIp) {
        if (applyLastKnownState()) return;
        setIp('Unavailable');
        setLocation('');
        return;
      }

      setIp(resolvedIp);
      setLastKnownNetwork(prev => ({
        ip: resolvedIp,
        location: prev?.location || '',
        updatedAt: new Date().toISOString(),
      }));

      // Get location info
      try {
        const locResponse = await fetchWithTimeout(`https://ipapi.co/${resolvedIp}/json/`, 4500);
        if (locResponse.ok) {
          const locData = await locResponse.json();
          if (locData.city && locData.country_name) {
            const nextLocation = `${locData.city}, ${locData.country_name}`;
            setLocation(nextLocation);

            setLastKnownNetwork({
              ip: resolvedIp,
              location: nextLocation,
              updatedAt: new Date().toISOString(),
            });
          }
        }
      } catch (e) {
        console.warn('Location fetch failed', e);
      }
    } catch (error) {
      console.error('All IP fetch attempts failed', error);
      if (applyLastKnownState()) return;
      setIp('Unavailable');
      setLocation('');
    }
  }, [applyLastKnownState, applyOfflineState, fetchWithTimeout, setLastKnownNetwork]);

  useEffect(() => {
    if (!showIP) return;

    fetchIP();

    const handleOnline = () => {
      setIsOnline(true);
      fetchIP();
    };
    const handleOffline = () => {
      setIsOnline(false);
      applyOfflineState();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [applyOfflineState, fetchIP, showIP]);

  // Don't render if both are hidden
  if (!showQuotes && !showIP) return null;

  const { quoteText, quoteAuthor } = useMemo(() => {
    if (!quote) return { quoteText: '', quoteAuthor: '' };

    // Prefer splitting on the last " - " so hyphens in the quote don't break parsing.
    const separator = ' - ';
    const lastSepIndex = quote.lastIndexOf(separator);
    if (lastSepIndex === -1) {
      return { quoteText: quote.trim(), quoteAuthor: '' };
    }

    const text = quote.slice(0, lastSepIndex).trim();
    const author = quote.slice(lastSepIndex + separator.length).trim();
    return { quoteText: text, quoteAuthor: author };
  }, [quote]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-8 space-y-8 text-center flex flex-col items-center w-full max-w-4xl mx-auto px-4"
    >
      {/* Quote Card */}
      {showQuotes && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative group w-full max-w-3xl"
        >
          {/* Holographic Card Container */}
          <div className="relative p-8 md:p-10 bg-[#050a14]/60 backdrop-blur-xl rounded-2xl border border-cyan-500/20 overflow-hidden hover:border-cyan-500/50 transition-all duration-500 shadow-[0_0_40px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_60px_rgba(6,182,212,0.2)]">

            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />

            {/* Scanning Light Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-fuchsia-500/30 rounded-br-lg" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  Daily Transmission
                </span>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={quote}
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <span className="absolute -top-6 -left-8 text-6xl text-cyan-500/10 font-serif">"</span>
                  <p className="text-white/90 text-xl md:text-3xl font-light leading-relaxed text-center drop-shadow-lg max-w-2xl mx-auto tracking-wide">
                    {quoteText || '…'}
                  </p>
                  <span className="absolute -bottom-10 -right-8 text-6xl text-cyan-500/10 font-serif">"</span>
                </motion.div>
              </AnimatePresence>

              <div className="mt-2 flex flex-col items-center gap-2">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                <GlitchText
                  text={quoteAuthor || 'Unknown'}
                  className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-400 tracking-widest uppercase"
                />
              </div>

              {/* Refresh Button */}
              <button
                onClick={generateQuote}
                disabled={loadingQuote}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-white/30 hover:text-cyan-400 transition-all duration-300 opacity-0 group-hover:opacity-100"
                title="Refresh Transmission"
              >
                <RefreshCw className={`w-4 h-4 ${loadingQuote ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* IP Status Terminal */}
      {showIP && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="group relative"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500" />
          <div className="relative flex items-center gap-6 px-8 py-3 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 shadow-xl">

            {/* Status Indicator */}
            <div className="flex items-center gap-3 border-r border-white/10 pr-6">
              <AnimatePresence mode="wait" initial={false}>
                {isOnline ? (
                  <motion.div
                    key="online"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    className="flex items-center gap-3"
                  >
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                    <span className="text-[10px] font-mono text-green-400 uppercase tracking-wider">Online</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="offline"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      className="relative inline-flex rounded-full h-3 w-3 bg-red-500"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider">Offline</span>

                    {!isOnline && hasLastKnown && (
                      <motion.span
                        initial={{ opacity: 0, y: 2 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="ml-2 text-[9px] font-mono uppercase tracking-wider text-white/70 bg-white/5 border border-white/10 rounded px-2 py-0.5"
                      >
                        Last known
                      </motion.span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* IP Address */}
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-mono text-cyan-100 tracking-wider min-w-[120px] text-left">
                {displayedIP}
              </span>
            </div>

            {/* Location */}
            {location && (
              <>
                <div className="w-[1px] h-4 bg-white/10" />
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-fuchsia-400" />
                  <span className="text-xs font-medium text-fuchsia-100 tracking-wide">{location}</span>
                </div>
              </>
            )}

            {/* Connection Type Icon (Decorative) */}
            <div className="pl-4 border-l border-white/10">
              <motion.div
                animate={isOnline ? { y: [0, -1, 0] } : { rotate: [0, -6, 6, 0] }}
                transition={isOnline ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.6, repeat: Infinity, repeatDelay: 2.2 }}
              >
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                ) : (
                  <WifiOff className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuoteAndIP;
