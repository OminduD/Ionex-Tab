import React, { useState } from 'react';

interface NewsItem {
  title: string;
  source: string;
  time: string;
}

const NewsFeed: React.FC = () => {
  const [news] = useState<NewsItem[]>([
    { title: 'AI Market Surges', source: 'Tech News', time: '2h ago' },
    { title: 'Climate Summit Updates', source: 'World News', time: '4h ago' },
    { title: 'New Space Discovery', source: 'Science Daily', time: '6h ago' },
  ]);

  return (
    <div className="p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold mb-3">News Feed</h3>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {news.length === 0 ? (
          <div className="text-center text-sm opacity-50 mt-4">No news available</div>
        ) : (
          news.map((item, index) => (
            <div
              key={index}
              className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
              <div className="flex justify-between text-xs opacity-60">
                <span>{item.source}</span>
                <span>{item.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-3 text-center">
        <button className="text-xs opacity-60 hover:opacity-100 transition-opacity">
          Refresh News
        </button>
      </div>
    </div>
  );
};

export default NewsFeed;
