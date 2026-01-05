// Optimized Theme-Based Particle Animation Component
// Uses CSS animations instead of JS-driven Framer Motion for better performance
import React, { useMemo } from 'react';

interface ThemeParticlesProps {
  theme?: string;
  density?: 'low' | 'medium' | 'high';
  className?: string;
}

type ParticleType = 'bubble' | 'firefly' | 'haze' | 'star' | 'cyber' | 'aurora' | 'petal' | 'crystal';

interface ThemeConfig {
  type: ParticleType;
  count: number;
  colors: string[];
}

// Reduced particle counts for better performance
const themeConfigs: Record<string, ThemeConfig> = {
  ocean: { type: 'bubble', count: 8, colors: ['#60a5fa', '#67e8f9', '#bae6fd'] },
  forest: { type: 'firefly', count: 10, colors: ['#4ade80', '#6ee7b7', '#bef264'] },
  sunset: { type: 'haze', count: 4, colors: ['#fb923c', '#fb7185', '#fcd34d'] },
  midnight: { type: 'star', count: 15, colors: ['#ffffff', '#c7d2fe', '#dbeafe'] },
  neon: { type: 'cyber', count: 6, colors: ['#d946ef', '#22d3ee', '#8b5cf6'] },
  aurora: { type: 'aurora', count: 5, colors: ['#c084fc', '#5eead4', '#818cf8'] },
  cherry: { type: 'petal', count: 8, colors: ['#f9a8d4', '#fecdd3', '#fee2e2'] },
  mint: { type: 'crystal', count: 6, colors: ['#5eead4', '#6ee7b7', '#a5f3fc'] },
  cyberpunk: { type: 'cyber', count: 4, colors: ['#d946ef', '#22d3ee', '#8b5cf6'] },
};

// CSS keyframe animations - injected once
const styleId = 'theme-particles-styles';
const injectStyles = () => {
  if (typeof document === 'undefined' || document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes particle-bubble {
      0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
      10% { opacity: 0.4; }
      90% { opacity: 0.4; }
      100% { transform: translateY(-120px) translateX(var(--tx, 20px)) scale(0.8); opacity: 0; }
    }
    @keyframes particle-firefly {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
      25% { transform: translate(var(--tx, 30px), var(--ty, -30px)) scale(1.3); opacity: 0.8; }
      50% { transform: translate(var(--tx2, -20px), var(--ty2, 20px)) scale(1); opacity: 0.4; }
      75% { transform: translate(var(--tx3, 15px), var(--ty3, 10px)) scale(1.2); opacity: 0.6; }
    }
    @keyframes particle-haze {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
      50% { transform: translate(30px, -30px) scale(1.2); opacity: 0.25; }
    }
    @keyframes particle-star {
      0%, 100% { transform: scale(0.5); opacity: 0.2; }
      50% { transform: scale(1.3); opacity: 0.9; }
    }
    @keyframes particle-cyber {
      0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 0.3; }
      25% { transform: translate(8px, -8px) rotate(90deg) scale(1.1); opacity: 0.7; }
      50% { transform: translate(-8px, 8px) rotate(180deg) scale(0.9); opacity: 0.5; }
      75% { transform: translate(5px, 5px) rotate(270deg) scale(1.05); opacity: 0.6; }
    }
    @keyframes particle-aurora {
      0%, 100% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); opacity: 0.15; }
      50% { transform: translateY(-40px) translateX(var(--tx, 30px)) scale(1.4) rotate(45deg); opacity: 0.35; }
    }
    @keyframes particle-petal {
      0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
      10% { opacity: 0.7; }
      90% { opacity: 0.7; }
      100% { transform: translateY(180px) translateX(var(--tx, 40px)) rotate(360deg); opacity: 0; }
    }
    @keyframes particle-crystal {
      0%, 100% { transform: translateY(0) rotate(45deg) scale(1); opacity: 0.25; }
      50% { transform: translateY(-25px) rotate(135deg) scale(1.15); opacity: 0.5; }
    }
    .particle-base {
      position: absolute;
      will-change: transform, opacity;
      contain: strict;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
};

// Seeded random for consistent particles across renders
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

const getParticleStyles = (type: ParticleType, color: string): React.CSSProperties => {
  const base: React.CSSProperties = {
    backgroundColor: color,
    mixBlendMode: 'screen',
  };

  switch (type) {
    case 'bubble':
      return { ...base, borderRadius: '50%', boxShadow: '0 0 10px rgba(255,255,255,0.3)' };
    case 'firefly':
      return { ...base, borderRadius: '50%', boxShadow: `0 0 8px ${color}` };
    case 'haze':
      return { ...base, borderRadius: '50%', filter: 'blur(24px)' };
    case 'star':
      return { ...base, borderRadius: '50%', boxShadow: `0 0 4px ${color}` };
    case 'cyber':
      return { 
        border: `2px solid ${color}`, 
        backgroundColor: `${color}20`,
        boxShadow: `0 0 5px ${color}`,
        mixBlendMode: 'screen',
      };
    case 'aurora':
      return { ...base, borderRadius: '50%', filter: 'blur(16px)' };
    case 'petal':
      return { ...base, borderRadius: '12px 0 12px 0', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' };
    case 'crystal':
      return { ...base, transform: 'rotate(45deg)', boxShadow: '0 0 5px rgba(255,255,255,0.4)' };
    default:
      return { ...base, borderRadius: '50%' };
  }
};

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  tx: number;
  ty: number;
  tx2: number;
  ty2: number;
  tx3: number;
  ty3: number;
}

// Memoized particle component to prevent re-renders
const ParticleElement = React.memo<{
  particle: Particle;
  type: ParticleType;
}>(({ particle, type }) => {
  const style: React.CSSProperties = {
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    width: particle.size,
    height: particle.size,
    animation: `particle-${type} ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
    '--tx': `${particle.tx}px`,
    '--ty': `${particle.ty}px`,
    '--tx2': `${particle.tx2}px`,
    '--ty2': `${particle.ty2}px`,
    '--tx3': `${particle.tx3}px`,
    '--ty3': `${particle.ty3}px`,
    ...getParticleStyles(type, particle.color),
  } as React.CSSProperties;

  return <div className="particle-base" style={style} />;
});

ParticleElement.displayName = 'ParticleElement';

export const ThemeParticles: React.FC<ThemeParticlesProps> = React.memo(({
  theme = 'aurora',
  density = 'medium',
  className = ''
}) => {
  // Inject styles once on mount
  React.useEffect(() => {
    injectStyles();
  }, []);

  const config = themeConfigs[theme] || themeConfigs.aurora;

  // Memoize particles to prevent recreation on every render
  const particles = useMemo(() => {
    const densityMultiplier = density === 'low' ? 0.4 : density === 'high' ? 1.2 : 0.8;
    const particleCount = Math.floor(config.count * densityMultiplier);

    return Array.from({ length: particleCount }, (_, i) => {
      const seed = i + 1;
      const size = config.type === 'firefly' || config.type === 'star'
        ? seededRandom(seed * 1.1) * 4 + 2
        : config.type === 'haze'
          ? seededRandom(seed * 1.2) * 80 + 40
          : seededRandom(seed * 1.3) * 16 + 8;

      return {
        id: i,
        x: seededRandom(seed * 2) * 100,
        y: seededRandom(seed * 3) * 100,
        size,
        color: config.colors[Math.floor(seededRandom(seed * 4) * config.colors.length)],
        duration: seededRandom(seed * 5) * 8 + 12, // Slower animations = less CPU
        delay: seededRandom(seed * 6) * 5,
        tx: (seededRandom(seed * 7) - 0.5) * 60,
        ty: (seededRandom(seed * 8) - 0.5) * 60,
        tx2: (seededRandom(seed * 9) - 0.5) * 40,
        ty2: (seededRandom(seed * 10) - 0.5) * 40,
        tx3: (seededRandom(seed * 11) - 0.5) * 30,
        ty3: (seededRandom(seed * 12) - 0.5) * 30,
      };
    });
  }, [theme, density, config.count, config.type, config.colors]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <ParticleElement
          key={particle.id}
          particle={particle}
          type={config.type}
        />
      ))}
    </div>
  );
});

ThemeParticles.displayName = 'ThemeParticles';

