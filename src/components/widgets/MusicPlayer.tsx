import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Music2, Play, SkipBack, SkipForward } from 'lucide-react';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface MusicPlayerProps {
  size?: 'small' | 'medium' | 'large';
  theme?: string;
  embedUrl?: string;
}

function getEmbedConfig(rawUrl?: string):
  | { provider: 'spotify' | 'soundcloud' | 'youtube'; embedSrc: string; openUrl: string }
  | null {
  const input = (rawUrl || '').trim();
  if (!input) return null;

  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, '');
  const openUrl = parsed.toString();

  // SoundCloud
  if (host === 'soundcloud.com' || host === 'snd.sc' || host === 'm.soundcloud.com') {
    const embedSrc = `https://w.soundcloud.com/player/?url=${encodeURIComponent(openUrl)}&auto_play=false&visual=true`;
    return { provider: 'soundcloud', embedSrc, openUrl };
  }

  // Spotify
  if (host === 'open.spotify.com') {
    // Handle international URLs (e.g., /intl-ja/track/...)
    // Regex matches: /optional-locale/type/id
    const match = parsed.pathname.match(/^(?:\/[a-z]{2,}(?:-[a-z]{2,})?)?\/(track|album|playlist|artist|episode|show)\/([a-zA-Z0-9]+)/);

    if (match) {
      const [, type, id] = match;
      const embedSrc = `https://open.spotify.com/embed/${type}/${id}`;
      return { provider: 'spotify', embedSrc, openUrl };
    }

    // Handle existing embed URLs
    if (parsed.pathname.startsWith('/embed')) {
      return { provider: 'spotify', embedSrc: openUrl, openUrl };
    }
  }

  // YouTube / YouTube Music
  if (host === 'youtube.com' || host === 'music.youtube.com' || host === 'youtu.be') {
    let videoId = '';

    if (host === 'youtu.be') {
      videoId = parsed.pathname.slice(1);
    } else {
      videoId = parsed.searchParams.get('v') || '';
    }

    if (videoId) {
      const embedSrc = `https://www.youtube.com/embed/${videoId}`;
      return { provider: 'youtube', embedSrc, openUrl };
    }

    // Handle Playlist
    const listId = parsed.searchParams.get('list');
    if (listId) {
      const embedSrc = `https://www.youtube.com/embed/videoseries?list=${listId}`;
      return { provider: 'youtube', embedSrc, openUrl };
    }
  }

  return null;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ size = 'medium', theme = 'aurora', embedUrl }) => {
  const isSmall = size === 'small';
  const { variants, containerStyle } = useThemeAnimation(theme);
  const embed = getEmbedConfig(embedUrl);

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`h-full flex flex-col relative overflow-hidden ${isSmall ? 'p-2' : 'p-4'} rounded-3xl ${containerStyle}`}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
        {!embed ? (
          <>
            {/* Holographic Vinyl */}
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className={`rounded-full border-2 border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-center relative overflow-hidden ${isSmall ? 'w-20 h-20' : 'w-32 h-32'} shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
              >
                <div className="absolute inset-0 bg-[repeating-radial-gradient(#111_0,#111_2px,#222_3px)] opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45" />
                <div className={`rounded-full bg-white/10 border border-white/10 ${isSmall ? 'w-8 h-8' : 'w-12 h-12'} flex items-center justify-center`}>
                  <Music2 className={isSmall ? 'w-4 h-4 text-white/70' : 'w-5 h-5 text-white/70'} />
                </div>
              </motion.div>

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1 h-10">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-primary to-accent rounded-t-full shadow-[0_0_10px_rgba(var(--primary-color-rgb),0.5)]"
                    animate={{
                      height: ['20%', '80%', '40%', '100%', '30%'],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.1,
                      repeatType: "mirror"
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <h3 className={`font-bold text-white ${isSmall ? 'text-xs' : 'text-sm'}`}>Music Player</h3>
              <p className={`text-white/50 ${isSmall ? 'text-[10px]' : 'text-xs'}`}>Paste a Spotify/SoundCloud link in Settings</p>
            </div>

            {!isSmall && (
              <div className="flex items-center gap-4 opacity-70">
                <SkipBack className="w-4 h-4 text-white/50" />
                <div className="p-2 rounded-full bg-white/10 border border-white/10">
                  <Play className="w-4 h-4 text-white fill-current" />
                </div>
                <SkipForward className="w-4 h-4 text-white/50" />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="w-full flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className={`font-bold text-white ${isSmall ? 'text-xs' : 'text-sm'}`}>Music Player</h3>
                <p className={`text-white/50 ${isSmall ? 'text-[10px]' : 'text-xs'} truncate`}>{embed.provider === 'spotify' ? 'Spotify' : 'SoundCloud'}</p>
              </div>

              <a
                href={embed.openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {!isSmall ? (
              <div className="w-full flex-1 min-h-0">
                <iframe
                  title="Music Embed"
                  src={embed.embedSrc}
                  className="w-full h-full rounded-2xl border border-white/10 bg-black/30"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full">
                <a
                  href={embed.openUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Open Player
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
