import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, RefreshCw, ExternalLink, TrendingUp } from 'lucide-react';

interface NewsItem {
  title: string;
  source: string;
  time: string;
  url?: string;
  description?: string;
}

interface NewsFeedProps {
  apiKey?: string;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ apiKey }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fallbackNews: NewsItem[] = [
    { 
      title: 'AI Technology Continues to Advance Rapidly', 
      source: 'Tech News', 
      time: '2h ago',
      description: 'New developments in artificial intelligence are reshaping industries worldwide.'
    },
    { 
      title: 'Climate Summit Brings Global Leaders Together', 
      source: 'World News', 
      time: '4h ago',
      description: 'International cooperation on climate action reaches new milestones.'
    },
    { 
      title: 'Breakthrough in Space Exploration Announced', 
      source: 'Science Daily', 
      time: '6h ago',
      description: 'Scientists discover new insights about our solar system.'
    },
    { 
      title: 'Tech Giants Release New Innovation Updates', 
      source: 'Business', 
      time: '8h ago',
      description: 'Major technology companies unveil their latest products and services.'
    },
    { 
      title: 'Renewable Energy Adoption Reaches Record High', 
      source: 'Environment', 
      time: '10h ago',
      description: 'Clean energy sources continue to gain momentum globally.'
    }
  ];

  const fetchNews = async () => {
    if (!apiKey) {
      setNews(fallbackNews);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Using NewsAPI.org - Free tier allows 100 requests per day
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      
      if (data.status === 'ok' && data.articles) {
        const formattedNews: NewsItem[] = data.articles.map((article: any) => ({
          title: article.title,
          source: article.source.name,
          time: getTimeAgo(new Date(article.publishedAt)),
          url: article.url,
          description: article.description
        }));
        setNews(formattedNews);
      } else {
        setNews(fallbackNews);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Using sample news. Add News API key in settings for real-time updates.');
      setNews(fallbackNews);
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
    <div className="p-4 h-full flex flex-col relative overflow-hidden">
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
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Newspaper className="w-6 h-6 text-primary" />
          </motion.div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Latest News
          </h3>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={fetchNews}
          disabled={loading}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
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
            <p className="text-xs mt-1">Add News API key in settings</p>
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
                className="relative p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                onClick={() => item.url && window.open(item.url, '_blank')}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-sm leading-tight text-white/95 group-hover:text-white transition-colors flex-1">
                    {item.title}
                  </h4>
                  {item.url && (
                    <ExternalLink className="w-3.5 h-3.5 text-accent opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  )}
                </div>
                
                {item.description && (
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
      
      {/* Footer */}
      {!apiKey && (
        <div className="relative z-10 mt-3 text-center">
          <p className="text-xs text-white/40">
            💡 Add News API key in Settings for live updates
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
