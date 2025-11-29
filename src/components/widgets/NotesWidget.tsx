import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { ThemeParticles } from '../ThemeParticles';

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
  { name: 'Yellow', bg: 'from-yellow-200 to-yellow-300', text: 'text-yellow-900' },
  { name: 'Pink', bg: 'from-pink-200 to-pink-300', text: 'text-pink-900' },
  { name: 'Blue', bg: 'from-blue-200 to-blue-300', text: 'text-blue-900' },
  { name: 'Green', bg: 'from-green-200 to-green-300', text: 'text-green-900' },
  { name: 'Purple', bg: 'from-purple-200 to-purple-300', text: 'text-purple-900' },
  { name: 'Orange', bg: 'from-orange-200 to-orange-300', text: 'text-orange-900' },
];

const NotesWidget: React.FC<NotesWidgetProps> = ({ theme = 'aurora', size = 'medium' }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: 0 });

  // Load notes from localStorage
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

  // Save notes to localStorage
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
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-md rounded-lg overflow-hidden border border-white/10 relative">
      {/* Theme Particles */}
      <ThemeParticles theme={theme} density="low" />
      
      {/* Header */}
      <div className={`relative z-10 flex items-center justify-between ${isSmall ? 'p-2' : 'p-4'} bg-white/10 backdrop-blur-md border-b border-white/10`}>
        <div className="flex items-center gap-2">
          <StickyNote className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} icon-color`} />
          <h3 className={`${isSmall ? 'text-base' : 'text-lg'} font-bold text-white`}>Quick Notes</h3>
        </div>
        <button
          onClick={() => setIsAddingNote(true)}
          className={`p-2 bg-theme-primary rounded-lg transition-colors group hover:opacity-80`}
          title="Add note"
        >
          <Plus className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-white group-hover:rotate-90 transition-transform duration-300`} />
        </button>
      </div>

      {/* Notes Grid */}
      <div className={`flex-1 overflow-y-auto ${isSmall ? 'p-2' : 'p-4'} scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent`}>
        <AnimatePresence>
          {/* New Note Form */}
          {isAddingNote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className={`bg-gradient-to-br ${noteColors[newNote.color].bg} rounded-xl p-4 mb-4 shadow-lg`}
            >
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Note title..."
                className={`w-full bg-transparent border-none outline-none font-semibold text-lg mb-2 ${noteColors[newNote.color].text} placeholder:opacity-50`}
                autoFocus
              />
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Write your note here..."
                className={`w-full bg-transparent border-none outline-none resize-none ${noteColors[newNote.color].text} placeholder:opacity-50 text-sm`}
                rows={4}
              />
              
              {/* Color Picker */}
              <div className="flex gap-2 mt-3 mb-3">
                {noteColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setNewNote({ ...newNote, color: index })}
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${color.bg} ${
                      newNote.color === index ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' : ''
                    } transition-all`}
                    title={color.name}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addNote}
                  className="flex-1 bg-white/20 hover:bg-white/30 rounded-lg py-2 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote({ title: '', content: '', color: 0 });
                  }}
                  className="bg-white/20 hover:bg-white/30 rounded-lg py-2 px-4 text-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Existing Notes */}
          {notes.length === 0 && !isAddingNote ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <StickyNote className={`${isSmall ? 'w-12 h-12' : 'w-16 h-16'} text-white/20 mb-4`} />
              <p className="text-white/50 text-lg">No notes yet</p>
              <p className="text-white/30 text-sm mt-2">Click the + button to create your first note</p>
            </motion.div>
          ) : (
            <div className="grid gap-3">
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className={`bg-gradient-to-br ${note.color} rounded-xl ${isSmall ? 'p-2' : 'p-4'} shadow-lg hover:shadow-xl transition-shadow`}
                >
                  {editingNoteId === note.id ? (
                    <EditNoteForm
                      note={note}
                      onSave={(title, content) => updateNote(note.id, title, content)}
                      onCancel={() => setEditingNoteId(null)}
                    />
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className={`font-semibold ${isSmall ? 'text-base' : 'text-lg'} flex-1`}>{note.title}</h4>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingNoteId(note.id)}
                            className="p-1.5 hover:bg-white/20 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-1.5 hover:bg-red-500/20 rounded transition-colors group"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 group-hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap opacity-80">{note.content}</p>
                      <p className="text-xs opacity-50 mt-3">
                        {note.updatedAt.toLocaleDateString()} {note.updatedAt.toLocaleTimeString()}
                      </p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Edit Note Form Component
const EditNoteForm: React.FC<{
  note: Note;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}> = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  return (
    <>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent border-none outline-none font-semibold text-lg mb-2 placeholder:opacity-50"
        autoFocus
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full bg-transparent border-none outline-none resize-none placeholder:opacity-50 text-sm"
        rows={4}
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onSave(title, content)}
          className="flex-1 bg-white/20 hover:bg-white/30 rounded-lg py-2 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-white/20 hover:bg-white/30 rounded-lg py-2 px-4 text-sm transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};

export default NotesWidget;
