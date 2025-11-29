import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, RefreshCw, ExternalLink, TrendingUp } from 'lucide-react';
import { ThemeParticles } from '../ThemeParticles';

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

const NewsFeed: React.FC<NewsFeedProps> = ({ apiKey, theme = 'aurora', size = 'medium' }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    console.log('📰 Fetching real-time news from RSS feed...');
    setLoading(true);
    setError(null);

    try {
      // Using RSS2JSON API (free, no API key required)
      // Fetching from Google News RSS feed
      const rssUrl = 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB'; // World news
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=10`;
      
      console.log('📡 Fetching from RSS2JSON API...');
      
      const response = await fetch(apiUrl);
      
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        console.log('✅ Successfully fetched', data.items.length, 'news articles');
        
        const formattedNews: NewsItem[] = data.items
          .filter((item: any) => item.title && item.title.trim() !== '')
          .slice(0, 10)
          .map((item: any) => {
            // Parse the publication date
            let timeAgo = '1h ago';
            try {
              const pubDate = new Date(item.pubDate);
              if (!isNaN(pubDate.getTime())) {
                timeAgo = getTimeAgo(pubDate);
              }
            } catch (e) {
              console.warn('Failed to parse date:', item.pubDate);
            }

            // Extract source from content or use feed title
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
          console.log('✅ News feed updated successfully');
        } else {
          console.warn('⚠️ No valid articles found, using fallback');
          setNews(fallbackNews);
          setError(null);
        }
      } else if (data.status === 'error') {
        console.error('❌ RSS API error:', data.message);
        setNews(fallbackNews);
        setError('Unable to fetch news. Using sample news.');
      } else {
        console.warn('⚠️ Unexpected response format, using fallback');
        setNews(fallbackNews);
        setError(null);
      }
    } catch (err) {
      console.error('💥 Error fetching news:', err);
      console.log('Using fallback news due to error');
      setNews(fallbackNews);
      
      // Don't show error to user, just use fallback silently
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
    // Refresh news every 15 minutes
    const interval = setInterval(fetchNews, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [apiKey]);

  return (
    <div className={`${isSmall ? 'p-2' : 'p-4'} h-full flex flex-col relative overflow-hidden`}>
      {/* Theme Particles */}
      <ThemeParticles theme={theme} density="low" />
      
      {/* Animated background gradient */}
      <motion.div 
        animate={{ 
          background: [
            'radial-gradient(circle at 20% 30%, rgba(var(--primary-color-rgb, 167, 139, 250), 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 70%, rgba(var(--accent-color-rgb, 192, 132, 252), 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 30%, rgba(var(--primary-color-rgb, 167, 139, 250), 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Header */}
      <div className={`relative z-10 flex items-center justify-between ${isSmall ? 'mb-2' : 'mb-4'}`}>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Newspaper className={`${isSmall ? 'w-4 h-4' : 'w-6 h-6'} text-primary`} />
          </motion.div>
          <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`}>
            Latest News
          </h3>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={fetchNews}
          disabled={loading}
          className={`${isSmall ? 'p-1' : 'p-2'} rounded-lg bg-white/5 hover:bg-white/10 transition-colors`}
        >
          <RefreshCw className={`w-4 h-4 text-accent ${loading ? 'animate-spin' : ''}`} />
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
      <div className="relative z-10 flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {loading && news.length === 0 ? (
          <div className="text-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full"
            />
            <p className="text-sm text-white/50 mt-3">Loading news...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center text-sm opacity-50 mt-8">
            <Newspaper className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No news available</p>
            <p className="text-xs mt-1">Click refresh to try again</p>
          </div>
        ) : (
          news.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="group relative"
            >
              {/* Gradient border effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
              
              <div 
                className={`relative ${isSmall ? 'p-2' : 'p-3'} bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer`}
                onClick={() => item.url && window.open(item.url, '_blank')}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className={`font-semibold ${isSmall ? 'text-xs' : 'text-sm'} leading-tight text-white/95 group-hover:text-white transition-colors flex-1`}>
                    {item.title}
                  </h4>
                  {item.url && (
                    <ExternalLink className="w-3.5 h-3.5 text-accent opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  )}
                </div>
                
                {item.description && !isSmall && (
                  <p className="text-xs text-white/60 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-white/50">
                    <TrendingUp className="w-3 h-3" />
                    <span>{item.source}</span>
                  </div>
                  <span className="text-white/40">{item.time}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
