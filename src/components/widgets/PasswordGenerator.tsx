import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Copy, RefreshCw, Check, Eye, EyeOff, Shield, Sparkles, Lock, Zap } from 'lucide-react';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface PasswordGeneratorProps {
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ theme = 'aurora', size = 'medium' }) => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { variants, containerStyle } = useThemeAnimation(theme);

  const isSmall = size === 'small';

  const generatePassword = useCallback(() => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const chars = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
      };

      let availableChars = '';
      if (options.uppercase) availableChars += chars.uppercase;
      if (options.lowercase) availableChars += chars.lowercase;
      if (options.numbers) availableChars += chars.numbers;
      if (options.symbols) availableChars += chars.symbols;

      if (!availableChars) {
        availableChars = chars.lowercase;
      }

      let newPassword = '';
      const array = new Uint32Array(length);
      crypto.getRandomValues(array);

      for (let i = 0; i < length; i++) {
        newPassword += availableChars[array[i] % availableChars.length];
      }

      setPassword(newPassword);
      setCopied(false);
      setIsGenerating(false);
    }, 200);
  }, [length, options]);

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    if (!password) return { level: 0, text: 'Generate', color: 'text-white/40', bg: 'bg-white/10' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 1, text: 'Weak', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (score <= 4) return { level: 2, text: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (score <= 5) return { level: 3, text: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    return { level: 4, text: 'Strong', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const strength = getStrength();

  useEffect(() => {
    generatePassword();
  }, []);

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`h-full flex flex-col relative overflow-hidden ${isSmall ? 'p-3' : 'p-4'} rounded-3xl ${containerStyle}`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 mb-3 relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="p-2 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20"
        >
          <Key className="w-4 h-4 text-primary" />
        </motion.div>
        <div>
          <h3 className={`font-bold text-white ${isSmall ? 'text-sm' : 'text-base'}`}>Password Generator</h3>
          <p className="text-[10px] text-white/40">Secure • Random • Strong</p>
        </div>
      </motion.div>

      {/* GENERATE BUTTON - Now at top, prominent */}
      <motion.button
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(var(--primary-rgb), 0.3)' }}
        whileTap={{ scale: 0.98 }}
        onClick={generatePassword}
        disabled={isGenerating}
        className="relative overflow-hidden flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-primary/50 via-primary/40 to-primary/50 hover:from-primary/70 hover:via-primary/60 hover:to-primary/70 rounded-2xl text-base font-bold text-white transition-all duration-300 border border-primary/40 mb-4 z-10 shadow-lg shadow-primary/20"
      >
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
        />
        <motion.div
          animate={isGenerating ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5, repeat: isGenerating ? Infinity : 0, ease: 'linear' }}
        >
          <RefreshCw className="w-5 h-5" />
        </motion.div>
        <span className="relative z-10">{isGenerating ? 'Generating...' : 'Generate Password'}</span>
        <Sparkles className="w-4 h-4" />
      </motion.button>

      {/* Password Display */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mb-3 z-10"
      >
        <motion.div 
          className={`flex items-center bg-black/50 backdrop-blur-sm border rounded-xl p-3 gap-2 transition-all ${password ? 'border-primary/30' : 'border-white/10'}`}
          animate={isGenerating ? { borderColor: ['rgba(var(--primary-rgb), 0.3)', 'rgba(var(--primary-rgb), 0.6)', 'rgba(var(--primary-rgb), 0.3)'] } : {}}
        >
          <motion.div animate={isGenerating ? { rotate: 360 } : {}} transition={{ duration: 0.5, repeat: isGenerating ? Infinity : 0 }}>
            <Shield className={`w-4 h-4 flex-shrink-0 ${strength.color}`} />
          </motion.div>
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p 
                key={password}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                className={`font-mono text-sm text-white truncate ${!showPassword ? 'tracking-wider' : ''}`}
              >
                {isGenerating ? 'Generating...' : showPassword ? (password || 'Click generate') : '•'.repeat(password.length || 12)}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-1">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowPassword(!showPassword)} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={copyToClipboard} className={`p-1.5 rounded-lg transition-colors ${copied ? 'text-green-400 bg-green-500/20' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Strength Indicator */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 flex gap-1 h-1.5">
            {[1, 2, 3, 4].map((level) => (
              <motion.div
                key={level}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: level * 0.1 }}
                className={`flex-1 rounded-full transition-all ${level <= strength.level
                    ? level <= 1 ? 'bg-gradient-to-r from-red-500 to-red-400'
                      : level <= 2 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                        : level <= 3 ? 'bg-gradient-to-r from-blue-500 to-blue-400'
                          : 'bg-gradient-to-r from-green-500 to-green-400'
                    : 'bg-white/10'
                  }`}
              />
            ))}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${strength.bg} ${strength.color}`}>{strength.text}</span>
        </div>
      </motion.div>

      {/* Length Slider */}
      <div className="mb-3 z-10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/60 flex items-center gap-1"><Lock className="w-3 h-3" /> Length</span>
          <motion.span key={length} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{length}</motion.span>
        </div>
        <input type="range" min="8" max="32" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary" style={{ background: `linear-gradient(to right, var(--primary-color) ${((length - 8) / 24) * 100}%, rgba(255,255,255,0.1) ${((length - 8) / 24) * 100}%)` }} />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2 mb-3 z-10">
        {[
          { key: 'uppercase', label: 'ABC', desc: 'Uppercase' },
          { key: 'lowercase', label: 'abc', desc: 'Lowercase' },
          { key: 'numbers', label: '123', desc: 'Numbers' },
          { key: 'symbols', label: '#$%', desc: 'Symbols' }
        ].map(({ key, label, desc }) => (
          <motion.button key={key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setOptions({ ...options, [key]: !options[key as keyof typeof options] })} className={`relative flex items-center gap-2 p-2 rounded-xl border transition-all ${options[key as keyof typeof options] ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-black/20 border-white/10 text-white/50 hover:border-white/20'}`}>
            <span className="font-mono text-sm font-bold">{label}</span>
            <span className="text-[10px]">{desc}</span>
            {options[key as keyof typeof options] && <Check className="w-3 h-3 absolute top-1 right-1" />}
          </motion.button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 z-10">
        {[
          { len: 12, label: 'Quick', icon: Zap },
          { len: 20, label: 'Strong', icon: Shield },
          { len: 32, label: 'Max', icon: Lock }
        ].map(({ len, label, icon: Icon }) => (
          <motion.button key={len} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setLength(len); setTimeout(generatePassword, 50); }} className="flex-1 flex items-center justify-center gap-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-white/50 hover:text-white transition-colors border border-transparent hover:border-white/10">
            <Icon className="w-3 h-3" />
            <span>{label} ({len})</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default PasswordGenerator;
