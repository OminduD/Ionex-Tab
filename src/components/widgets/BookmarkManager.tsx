import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Plus, Trash2, ExternalLink, FolderOpen, Star, Search, X } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folder?: string;
  isFavorite: boolean;
  createdAt: string;
}

interface BookmarkManagerProps {
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const BookmarkManager: React.FC<BookmarkManagerProps> = ({ theme = 'aurora', size = 'medium' }) => {
  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkItem[]>('ionex_bookmarks', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', folder: '' });
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const { variants, containerStyle } = useThemeAnimation(theme);

  const isSmall = size === 'small';

  // Get unique folders
  const folders = [...new Set(bookmarks.filter(b => b.folder).map(b => b.folder))];

  // Filter bookmarks
  const filteredBookmarks = bookmarks.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = activeFolder ? b.folder === activeFolder : true;
    return matchesSearch && matchesFolder;
  });

  // Sort: favorites first, then by date
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const addBookmark = () => {
    if (!newBookmark.title.trim() || !newBookmark.url.trim()) return;

    const bookmark: BookmarkItem = {
      id: Date.now().toString(),
      title: newBookmark.title.trim(),
      url: newBookmark.url.startsWith('http') ? newBookmark.url : `https://${newBookmark.url}`,
      favicon: getFavicon(newBookmark.url) || undefined,
      folder: newBookmark.folder.trim() || undefined,
      isFavorite: false,
      createdAt: new Date().toISOString()
    };

    setBookmarks([...bookmarks, bookmark]);
    setNewBookmark({ title: '', url: '', folder: '' });
    setShowAddForm(false);
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setBookmarks(bookmarks.map(b =>
      b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
    ));
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`h-full flex flex-col relative overflow-hidden ${isSmall ? 'p-3' : 'p-4'} rounded-3xl ${containerStyle}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-primary" />
          <h3 className={`font-bold text-white ${isSmall ? 'text-sm' : 'text-base'}`}>Bookmarks</h3>
          <span className="text-xs text-white/40 bg-white/10 px-1.5 py-0.5 rounded">{bookmarks.length}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 outline-none focus:border-primary/50"
        />
      </div>

      {/* Folder Tabs */}
      {folders.length > 0 && (
        <div className="flex gap-1 mb-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveFolder(null)}
            className={`px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap transition-colors ${
              !activeFolder ? 'bg-primary/30 text-primary' : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            All
          </button>
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setActiveFolder(folder || null)}
              className={`px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeFolder === folder ? 'bg-primary/30 text-primary' : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              <FolderOpen className="w-3 h-3" />
              {folder}
            </button>
          ))}
        </div>
      )}

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-3 bg-black/30 rounded-xl border border-white/10 space-y-2"
          >
            <input
              type="text"
              placeholder="Title"
              value={newBookmark.title}
              onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/40 outline-none focus:border-primary/50"
            />
            <input
              type="url"
              placeholder="URL (e.g., example.com)"
              value={newBookmark.url}
              onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/40 outline-none focus:border-primary/50"
            />
            <input
              type="text"
              placeholder="Folder (optional)"
              value={newBookmark.folder}
              onChange={(e) => setNewBookmark({ ...newBookmark, folder: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/40 outline-none focus:border-primary/50"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addBookmark}
              className="w-full py-1.5 bg-primary/30 hover:bg-primary/50 rounded-lg text-xs font-medium text-white transition-colors"
            >
              Add Bookmark
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookmarks List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <AnimatePresence>
          {sortedBookmarks.map((bookmark) => (
            <motion.div
              key={bookmark.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="group relative flex items-center gap-2 p-2 bg-black/20 hover:bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-all"
            >
              {/* Favicon */}
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {bookmark.favicon ? (
                  <img src={bookmark.favicon} alt="" className="w-4 h-4" onError={(e) => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <Bookmark className="w-3 h-3 text-white/50" />
                )}
              </div>

              {/* Content */}
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0"
              >
                <div className="text-xs font-medium text-white truncate group-hover:text-primary transition-colors">
                  {bookmark.title}
                </div>
                <div className="text-[10px] text-white/40 truncate">
                  {bookmark.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </div>
              </a>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleFavorite(bookmark.id)}
                  className={`p-1 rounded hover:bg-white/10 transition-colors ${bookmark.isFavorite ? 'text-yellow-400' : 'text-white/40'}`}
                >
                  <Star className="w-3.5 h-3.5" fill={bookmark.isFavorite ? 'currentColor' : 'none'} />
                </button>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="p-1 rounded text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Favorite Indicator */}
              {bookmark.isFavorite && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {sortedBookmarks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-white/40">
            <Bookmark className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">{searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}</p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Add your first bookmark
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookmarkManager;
