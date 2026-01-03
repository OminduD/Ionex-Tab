import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ExternalLink, TrendingUp, Globe } from 'lucide-react';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface NewsItem {
  title: string;
  source: string;
  time: string;
  url?: string;
  description?: string;
}

interface NewsFeedProps {
  apiKey?: string;
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const NewsFeed: React.FC<NewsFeedProps> = ({ apiKey, size = 'medium', theme = 'aurora' }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { variants, containerStyle } = useThemeAnimation(theme);

  const isSmall = size === 'small';

  const fallbackNews: NewsItem[] = [
    {
      title: 'AI Revolution Transforms Global Industries',
      source: 'Tech News',
      time: '1h ago',
      description: 'Artificial intelligence breakthroughs are reshaping how businesses operate worldwide.',
      url: 'https://news.google.com'
    },
    {
      title: 'Global Leaders Address Climate Change Goals',
      source: 'World News',
      time: '3h ago',
      description: 'International climate summit sets ambitious targets for carbon reduction.',
      url: 'https://news.google.com'
    },
    {
      title: 'Space Agency Announces New Discovery',
      source: 'Science Daily',
      time: '5h ago',
      description: 'Astronomers make groundbreaking findings about distant galaxies.',
      url: 'https://news.google.com'
    },
    {
      title: 'Tech Companies Unveil Next-Gen Products',
      source: 'Business Today',
      time: '7h ago',
      description: 'Major technology firms showcase innovative solutions at annual conference.',
      url: 'https://news.google.com'
    },
    {
      title: 'Renewable Energy Sets New Global Record',
      source: 'Environment Weekly',
      time: '9h ago',
      description: 'Clean energy adoption surpasses fossil fuels in several major economies.',
      url: 'https://news.google.com'
    },
    {
      title: 'Medical Breakthrough Offers New Hope',
      source: 'Health News',
      time: '11h ago',
      description: 'Researchers develop promising treatment for previously incurable condition.',
      url: 'https://news.google.com'
    },
    {
      title: 'Digital Innovation Reshapes Education',
      source: 'Education Today',
      time: '13h ago',
      description: 'New technologies enhance learning experiences for students globally.',
      url: 'https://news.google.com'
    }
  ];

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      // Using RSS2JSON API (free, no API key required)
      const rssUrl = 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB'; // World news
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=10`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'ok' && data.items && data.items.length > 0) {
        const formattedNews: NewsItem[] = data.items
          .filter((item: any) => item.title && item.title.trim() !== '')
          .slice(0, 10)
          .map((item: any) => {
            let timeAgo = '1h ago';
            try {
              const pubDate = new Date(item.pubDate);
              if (!isNaN(pubDate.getTime())) {
                timeAgo = getTimeAgo(pubDate);
              }
            } catch (e) {
              console.warn('Failed to parse date:', item.pubDate);
            }

            let source = 'Google News';
            if (item.author) {
              source = item.author;
            }

            return {
              title: item.title,
              source: source,
              time: timeAgo,
              url: item.link,
              description: item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : undefined
            };
          });

        if (formattedNews.length > 0) {
          setNews(formattedNews);
          setError(null);
        } else {
          setNews(fallbackNews);
          setError(null);
        }
      } else {
        setNews(fallbackNews);
        setError('Unable to fetch news. Using sample news.');
      }
    } catch (err) {
      setNews(fallbackNews);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours === 1) return '1h ago';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [apiKey]);

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`h-full flex flex-col relative overflow-hidden ${isSmall ? 'p-2' : 'p-4'} rounded-3xl ${containerStyle}`}
    >
      {/* Header */}
      <div className={`relative z-10 flex items-center justify-between ${isSmall ? 'mb-2' : 'mb-4'}`}>
        <div className="flex items-center gap-2">
          <Globe className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
          <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-bold text-white tracking-wide`}>News Feed</h3>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={fetchNews}
          disabled={loading}
          className={`p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors`}
        >
          <RefreshCw className={`w-3.5 h-3.5 text-white/70 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mb-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
        >
          <p className="text-xs text-yellow-200/80">{error}</p>
        </motion.div>
      )}

      {/* News List */}
      <div className="relative z-10 flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence mode='popLayout'>
          {loading && news.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            news.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group relative"
              >
                <div
                  className={`relative ${isSmall ? 'p-2' : 'p-3'} bg-white/5 backdrop-blur-sm rounded-xl border border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all cursor-pointer overflow-hidden`}
                  onClick={() => item.url && window.open(item.url, '_blank')}
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`font-semibold ${isSmall ? 'text-xs' : 'text-sm'} leading-tight text-white/90 group-hover:text-white transition-colors flex-1 line-clamp-2`}>
                        {item.title}
                      </h4>
                      {item.url && (
                        <ExternalLink className="w-3 h-3 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5 transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
                      )}
                    </div>

                    {item.description && !isSmall && (
                      <p className="text-xs text-white/50 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-white/40">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-primary/70" />
                        <span className="truncate max-w-[80px] font-mono">{item.source}</span>
                      </div>
                      <span className="font-mono">{item.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default NewsFeed;
