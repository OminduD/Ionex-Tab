import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Plus, Trash2, Edit2, Check, X, Sparkles, FileText, Clock } from 'lucide-react';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesWidgetProps {
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const noteColors = [
  { name: 'Primary', bg: 'from-primary/30 to-primary/10', border: 'border-primary/40', accent: 'bg-primary' },
  { name: 'Yellow', bg: 'from-yellow-500/30 to-amber-600/10', border: 'border-yellow-500/40', accent: 'bg-yellow-500' },
  { name: 'Pink', bg: 'from-pink-500/30 to-rose-600/10', border: 'border-pink-500/40', accent: 'bg-pink-500' },
  { name: 'Blue', bg: 'from-blue-500/30 to-cyan-600/10', border: 'border-blue-500/40', accent: 'bg-blue-500' },
  { name: 'Green', bg: 'from-green-500/30 to-emerald-600/10', border: 'border-green-500/40', accent: 'bg-green-500' },
  { name: 'Purple', bg: 'from-purple-500/30 to-violet-600/10', border: 'border-purple-500/40', accent: 'bg-purple-500' },
];

const NotesWidget: React.FC<NotesWidgetProps> = ({ size = 'medium', theme = 'aurora' }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: 0 });
  const { variants, containerStyle } = useThemeAnimation(theme);

  useEffect(() => {
    const savedNotes = localStorage.getItem('quickNotes');
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        setNotes(parsed.map((note: Note) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        })));
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('quickNotes', JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title.trim() || 'Untitled',
      content: newNote.content.trim(),
      color: noteColors[newNote.color].bg,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', color: 0 });
    setIsAddingNote(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, title: title || 'Untitled', content, updatedAt: new Date() }
        : note
    ));
    setEditingNoteId(null);
  };

  const isSmall = size === 'small';

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`h-full flex flex-col relative overflow-hidden ${isSmall ? 'p-2' : 'p-4'} rounded-3xl ${containerStyle}`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"
        />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`relative z-10 flex items-center justify-between ${isSmall ? 'mb-2' : 'mb-4'}`}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
            className="p-2 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20"
          >
            <StickyNote className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
          </motion.div>
          <div>
            <h3 className={`${isSmall ? 'text-sm' : 'text-base'} font-bold text-white`}>Quick Notes</h3>
            <p className="text-[10px] text-white/40">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAddingNote(true)}
          className={`p-2 bg-gradient-to-br from-primary/30 to-primary/10 hover:from-primary/50 hover:to-primary/30 rounded-xl transition-all border border-primary/30 shadow-lg shadow-primary/10`}
        >
          <Plus className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
        </motion.button>
      </motion.div>

      {/* Notes Grid */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence mode='popLayout'>
          {/* New Note Form */}
          {isAddingNote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className={`bg-gradient-to-br ${noteColors[newNote.color].bg} border ${noteColors[newNote.color].border} rounded-2xl p-4 mb-3 shadow-xl backdrop-blur-md`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-white/60" />
                <span className="text-xs text-white/60 font-medium">New Note</span>
              </div>
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Title..."
                className={`w-full bg-black/20 rounded-lg px-3 py-2 border border-white/10 outline-none font-bold text-white placeholder-white/30 mb-2 ${isSmall ? 'text-sm' : 'text-base'} focus:border-primary/50 transition-colors`}
                autoFocus
              />
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Write your note..."
                className={`w-full bg-black/20 rounded-lg px-3 py-2 border border-white/10 outline-none resize-none text-white/90 placeholder-white/30 ${isSmall ? 'text-xs' : 'text-sm'} focus:border-primary/50 transition-colors`}
                rows={3}
              />

              <div className="flex items-center gap-2 mt-3 mb-3">
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Color:</span>
                <div className="flex gap-2">
                  {noteColors.map((color, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNewNote({ ...newNote, color: index })}
                      className={`w-5 h-5 rounded-full ${color.accent} border-2 ${newNote.color === index ? 'border-white scale-110' : 'border-transparent'} transition-all shadow-lg`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addNote}
                  className="flex-1 bg-primary/30 hover:bg-primary/50 rounded-xl py-2 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 border border-primary/30"
                >
                  <Check className="w-4 h-4" /> Save Note
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote({ title: '', content: '', color: 0 });
                  }}
                  className="bg-white/10 hover:bg-white/20 rounded-xl py-2 px-4 text-sm text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {notes.length === 0 && !isAddingNote ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-40 text-center"
            >
              <motion.div
                animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FileText className="w-12 h-12 text-white/10 mb-3" />
              </motion.div>
              <p className="text-white/40 text-sm font-medium">No notes yet</p>
              <p className="text-white/20 text-xs mt-1">Click + to create your first note</p>
            </motion.div>
          ) : (
            notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, x: -50, transition: { duration: 0.3 } }}
                transition={{ delay: index * 0.05 }}
                layout
                whileHover={{ scale: 1.02, y: -2 }}
                className={`group relative bg-gradient-to-br ${note.color.includes('from-') ? note.color : 'from-white/10 to-white/5'} border border-white/10 rounded-2xl ${isSmall ? 'p-3 mb-2' : 'p-4 mb-3'} shadow-lg hover:shadow-xl transition-all hover:border-white/20 backdrop-blur-md overflow-hidden`}
              >
                {/* Glow Effect */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-white/5 pointer-events-none"
                />
                
                {/* Shine Effect */}
                <motion.div
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
                />

                {editingNoteId === note.id ? (
                  <EditNoteForm
                    note={note}
                    onSave={(title, content) => updateNote(note.id, title, content)}
                    onCancel={() => setEditingNoteId(null)}
                    isSmall={isSmall}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2 mb-2 relative z-10">
                      <h4 className={`font-bold text-white ${isSmall ? 'text-sm' : 'text-base'} truncate flex-1`}>{note.title}</h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setEditingNoteId(note.id)}
                          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-white/70" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteNote(note.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white/70 hover:text-red-400" />
                        </motion.button>
                      </div>
                    </div>
                    <p className={`text-white/80 whitespace-pre-wrap line-clamp-3 ${isSmall ? 'text-xs' : 'text-sm'} relative z-10 leading-relaxed`}>{note.content}</p>
                    <div className="flex items-center gap-1 mt-3 text-[10px] text-white/30 font-mono relative z-10">
                      <Clock className="w-3 h-3" />
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                  </>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const EditNoteForm: React.FC<{
  note: Note;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
  isSmall: boolean;
}> = ({ note, onSave, onCancel, isSmall }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  return (
    <div className="w-full">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`w-full bg-transparent border-b border-white/10 outline-none font-bold text-white mb-2 ${isSmall ? 'text-sm' : 'text-base'}`}
        autoFocus
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={`w-full bg-transparent border-none outline-none resize-none text-white/90 ${isSmall ? 'text-xs' : 'text-sm'}`}
        rows={3}
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onSave(title, content)}
          className="flex-1 bg-white/10 hover:bg-white/20 rounded py-1 text-xs text-white transition-colors"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-white/10 hover:bg-white/20 rounded py-1 px-2 text-xs text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NotesWidget;
