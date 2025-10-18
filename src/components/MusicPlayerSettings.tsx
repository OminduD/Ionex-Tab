// src/components/MusicPlayerSettings.tsx
// Music player integration settings for Spotify, SoundCloud, YouTube Music

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { SiSpotify, SiSoundcloud, SiYoutubemusic, SiApplemusic } from 'react-icons/si';

interface MusicPlatform {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  authUrl: string;
  description: string;
}

const platforms: MusicPlatform[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    icon: SiSpotify,
    color: '#1DB954',
    authUrl: 'https://accounts.spotify.com/authorize',
    description: 'Stream millions of songs and podcasts'
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    icon: SiSoundcloud,
    color: '#FF5500',
    authUrl: 'https://soundcloud.com/connect',
    description: 'Discover and share music'
  },
  {
    id: 'youtubemusic',
    name: 'YouTube Music',
    icon: SiYoutubemusic,
    color: '#FF0000',
    authUrl: 'https://music.youtube.com',
    description: 'Music streaming service by YouTube'
  },
  {
    id: 'applemusic',
    name: 'Apple Music',
    icon: SiApplemusic,
    color: '#FA243C',
    authUrl: 'https://music.apple.com',
    description: 'Apple\'s music streaming service'
  }
];

interface Props {
  connectedPlatforms: string[];
  onConnect: (platformId: string) => void;
  onDisconnect: (platformId: string) => void;
}

export const MusicPlayerSettings: React.FC<Props> = ({
  connectedPlatforms,
  onConnect,
  onDisconnect
}) => {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (platform: MusicPlatform) => {
    setConnecting(platform.id);
    
    // Open authentication in new window
    const authWindow = window.open(
      platform.authUrl,
      '_blank',
      'width=600,height=700'
    );

    // Simulate connection (in real app, would handle OAuth callback)
    setTimeout(() => {
      if (authWindow) authWindow.close();
      onConnect(platform.id);
      setConnecting(null);
    }, 2000);
  };

  const isConnected = (platformId: string) => connectedPlatforms.includes(platformId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-theme-primary" />
        <h3 className="text-lg font-semibold text-white">Music Player Connections</h3>
      </div>

      <p className="text-white/70 text-sm mb-4">
        Connect your music streaming accounts to play your favorite playlists directly in Focus Mode
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => {
          const IconComponent = platform.icon;
          const connected = isConnected(platform.id);
          const isConnecting = connecting === platform.id;

          return (
            <motion.div
              key={platform.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-start gap-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${platform.color}20` }}
                >
                  <IconComponent
                    className="w-6 h-6"
                    style={{ color: platform.color }}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{platform.name}</h4>
                    {connected && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <p className="text-white/60 text-xs mb-3">
                    {platform.description}
                  </p>

                  {connected ? (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDisconnect(platform.id)}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3 h-3" />
                        Disconnect
                      </motion.button>
                      <motion.a
                        href={platform.authUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </motion.a>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConnect(platform)}
                      disabled={isConnecting}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: isConnecting ? '#666' : platform.color,
                        color: 'white'
                      }}
                    >
                      {isConnecting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          Connect
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-4">
        <p className="text-blue-300 text-sm">
          <strong>Note:</strong> Music platform connections are simulated for demo purposes. 
          In a production environment, this would use OAuth 2.0 authentication flows.
        </p>
      </div>
    </div>
  );
};

export default MusicPlayerSettings;
