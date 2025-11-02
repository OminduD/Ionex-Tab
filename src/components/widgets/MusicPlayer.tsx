import React from 'react';
import { ThemeParticles } from '../ThemeParticles';

interface MusicPlayerProps {
  theme?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ theme = 'aurora' }) => {
  return (
    <div className="p-4 h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Theme Particles */}
      <ThemeParticles theme={theme} density="medium" />
      
      <div className="text-4xl mb-3 relative z-10">🎵</div>
      <h3 className="text-lg font-bold mb-2">Music Player</h3>
      <p className="text-xs opacity-50 text-center">
        Feature coming soon!
      </p>
    </div>
  );
};

export default MusicPlayer;
