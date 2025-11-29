import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
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
  { name: 'Yellow', bg: 'from-yellow-400/20 to-yellow-600/20', border: 'border-yellow-500/30', text: 'text-yellow-100' },
  { name: 'Pink', bg: 'from-pink-400/20 to-pink-600/20', border: 'border-pink-500/30', text: 'text-pink-100' },
  { name: 'Blue', bg: 'from-blue-400/20 to-blue-600/20', border: 'border-blue-500/30', text: 'text-blue-100' },
  { name: 'Green', bg: 'from-green-400/20 to-green-600/20', border: 'border-green-500/30', text: 'text-green-100' },
  { name: 'Purple', bg: 'from-purple-400/20 to-purple-600/20', border: 'border-purple-500/30', text: 'text-purple-100' },
  { name: 'Orange', bg: 'from-orange-400/20 to-orange-600/20', border: 'border-orange-500/30', text: 'text-orange-100' },
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
      color: noteColors[newNote.color].bg, // Store just the gradient part or index? Storing gradient for now
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
      {/* Header */}
      <div className={`relative z-10 flex items-center justify-between ${isSmall ? 'mb-2' : 'mb-4'}`}>
        <div className="flex items-center gap-2">
          <StickyNote className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
          <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-bold text-white tracking-wide`}>Notes</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAddingNote(true)}
          className={`p-1.5 bg-primary/20 hover:bg-primary/40 rounded-lg transition-colors border border-primary/30`}
        >
          <Plus className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} text-primary`} />
        </motion.button>
      </div>

      {/* Notes Grid */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence mode='popLayout'>
          {/* New Note Form */}
          {isAddingNote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className={`bg-gradient-to-br ${noteColors[newNote.color].bg} border ${noteColors[newNote.color].border} rounded-xl p-3 mb-3 shadow-lg backdrop-blur-md`}
            >
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Title..."
                className={`w-full bg-transparent border-none outline-none font-bold text-white placeholder-white/40 mb-2 ${isSmall ? 'text-sm' : 'text-base'}`}
                autoFocus
              />
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Content..."
                className={`w-full bg-transparent border-none outline-none resize-none text-white/90 placeholder-white/40 ${isSmall ? 'text-xs' : 'text-sm'}`}
                rows={3}
              />

              <div className="flex gap-1.5 mt-2 mb-2 overflow-x-auto pb-1 scrollbar-none">
                {noteColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setNewNote({ ...newNote, color: index })}
                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${color.bg} border border-white/20 ${newNote.color === index ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent scale-110' : ''
                      } transition-all`}
                  />
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={addNote}
                  className="flex-1 bg-white/10 hover:bg-white/20 rounded-lg py-1 text-xs font-medium text-white transition-colors flex items-center justify-center gap-1"
                >
                  <Check className="w-3 h-3" /> Save
                </button>
                <button
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote({ title: '', content: '', color: 0 });
                  }}
                  className="bg-white/10 hover:bg-white/20 rounded-lg py-1 px-3 text-xs text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Existing Notes */}
          {notes.length === 0 && !isAddingNote ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-32 text-center"
            >
              <StickyNote className="w-8 h-8 text-white/10 mb-2" />
              <p className="text-white/30 text-xs">No notes yet</p>
            </motion.div>
          ) : (
            notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
                className={`group relative bg-gradient-to-br ${note.color.includes('from-') ? note.color : 'from-white/5 to-white/10'} border border-white/10 rounded-xl ${isSmall ? 'p-2 mb-2' : 'p-3 mb-3'} shadow-lg hover:shadow-xl transition-all hover:border-white/20`}
              >
                {editingNoteId === note.id ? (
                  <EditNoteForm
                    note={note}
                    onSave={(title, content) => updateNote(note.id, title, content)}
                    onCancel={() => setEditingNoteId(null)}
                    isSmall={isSmall}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`font-bold text-white ${isSmall ? 'text-sm' : 'text-base'} truncate`}>{note.title}</h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingNoteId(note.id)}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                          <Edit2 className="w-3 h-3 text-white/70" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-white/70 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className={`text-white/80 whitespace-pre-wrap line-clamp-3 ${isSmall ? 'text-xs' : 'text-sm'}`}>{note.content}</p>
                    <p className="text-[10px] text-white/30 mt-2 text-right">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
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
