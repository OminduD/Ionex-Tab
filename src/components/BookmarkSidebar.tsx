import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, 
  FolderOpen, 
  Star, 
  Search, 
  X, 
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Globe,
  Folder
} from 'lucide-react';

interface BookmarkNode {
  id: string;
  title: string;
  url?: string;
  children?: BookmarkNode[];
  dateAdded?: number;
}

interface BookmarkSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

const BookmarkSidebar: React.FC<BookmarkSidebarProps> = ({ isOpen, onClose, theme: _theme = 'aurora' }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '2']));
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('ionex_bookmark_favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bookmarks from Chrome API
  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check if Chrome bookmarks API is available
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        chrome.bookmarks.getTree((tree) => {
          if (tree && tree.length > 0) {
            setBookmarks(tree[0].children || []);
          }
          setIsLoading(false);
        });
      } else {
        // Fallback: Load from localStorage for development/testing
        const saved = localStorage.getItem('ionex_bookmarks');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Convert flat bookmarks to tree structure
          const otherBookmarks: BookmarkNode = {
            id: 'local',
            title: 'My Bookmarks',
            children: parsed.map((b: any) => ({
              id: b.id,
              title: b.title,
              url: b.url
            }))
          };
          setBookmarks([otherBookmarks]);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchBookmarks();
    }
  }, [isOpen, fetchBookmarks]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('ionex_bookmark_favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  // Flatten bookmarks for search
  const flattenBookmarks = (nodes: BookmarkNode[]): BookmarkNode[] => {
    const result: BookmarkNode[] = [];
    const traverse = (items: BookmarkNode[]) => {
      for (const item of items) {
        if (item.url) {
          result.push(item);
        }
        if (item.children) {
          traverse(item.children);
        }
      }
    };
    traverse(nodes);
    return result;
  };

  const filteredBookmarks = searchQuery
    ? flattenBookmarks(bookmarks).filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.url?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  // Get favorite bookmarks
  const favoriteBookmarks = flattenBookmarks(bookmarks).filter(b => favorites.has(b.id));

  const renderBookmarkItem = (item: BookmarkNode, depth: number = 0) => {
    const isFolder = !item.url && item.children;
    const isExpanded = expandedFolders.has(item.id);
    const isFavorite = favorites.has(item.id);

    if (isFolder) {
      return (
        <div key={item.id}>
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => toggleFolder(item.id)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all group"
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-3 h-3 text-white/40" />
            </motion.div>
            <Folder className="w-4 h-4 text-yellow-400/80" />
            <span className="text-sm text-white/80 truncate flex-1 text-left">{item.title || 'Untitled Folder'}</span>
            <span className="text-[10px] text-white/30">{item.children?.length || 0}</span>
          </motion.button>
          
          <AnimatePresence>
            {isExpanded && item.children && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {item.children.map(child => renderBookmarkItem(child, depth + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <motion.a
        key={item.id}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.1)' }}
        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all group"
        style={{ paddingLeft: `${28 + depth * 16}px` }}
      >
        {item.url ? (
          <img 
            src={getFavicon(item.url) || ''} 
            alt=""
            className="w-4 h-4 rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <Globe className={`w-4 h-4 text-white/40 ${item.url ? 'hidden' : ''}`} />
        <span className="text-sm text-white/70 truncate flex-1 group-hover:text-white transition-colors">
          {item.title || item.url}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => toggleFavorite(item.id, e)}
            className={`p-1 rounded hover:bg-white/10 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-white/40 hover:text-white'}`}
          >
            <Star className="w-3 h-3" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <ExternalLink className="w-3 h-3 text-white/40" />
        </div>
      </motion.a>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-br from-black/90 via-black/85 to-black/80 backdrop-blur-2xl border-r border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20">
                    <Bookmark className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg">Bookmarks</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Browser Collection</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bookmarks..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full"
                  />
                </div>
              ) : searchQuery && filteredBookmarks ? (
                <div className="p-2">
                  <p className="text-xs text-white/40 px-3 py-2">
                    {filteredBookmarks.length} result{filteredBookmarks.length !== 1 ? 's' : ''}
                  </p>
                  {filteredBookmarks.map(b => renderBookmarkItem(b, 0))}
                </div>
              ) : (
                <div className="p-2">
                  {/* Favorites Section */}
                  {favoriteBookmarks.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 px-3 py-2 text-xs text-white/40 uppercase tracking-wider">
                        <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                        Favorites
                      </div>
                      {favoriteBookmarks.map(b => renderBookmarkItem(b, 0))}
                    </div>
                  )}

                  {/* All Bookmarks */}
                  <div>
                    <div className="flex items-center gap-2 px-3 py-2 text-xs text-white/40 uppercase tracking-wider">
                      <FolderOpen className="w-3 h-3" />
                      All Bookmarks
                    </div>
                    {bookmarks.map(node => renderBookmarkItem(node, 0))}
                  </div>
                </div>
              )}

              {!isLoading && bookmarks.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-center p-4">
                  <Bookmark className="w-12 h-12 text-white/20 mb-3" />
                  <p className="text-sm text-white/40">No bookmarks found</p>
                  <p className="text-xs text-white/30 mt-1">
                    Your browser bookmarks will appear here
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white/40">
                <span>{flattenBookmarks(bookmarks).length} bookmarks</span>
                <button
                  onClick={fetchBookmarks}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-3 h-3" />
                  </motion.div>
                  Refresh
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookmarkSidebar;
