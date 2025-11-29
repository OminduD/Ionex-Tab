import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Todo } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Plus, Download, Upload } from 'lucide-react';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface TodoListProps {
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const TodoList: React.FC<TodoListProps> = ({ size = 'medium', theme = 'aurora' }) => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('homeTabTodos', []);
  const [newTodo, setNewTodo] = useState('');
  const { variants, containerStyle } = useThemeAnimation(theme);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo: Todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo: Todo) => todo.id !== id));
  };

  const exportTodos = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedTodos = JSON.parse(event.target?.result as string);
          setTodos(importedTodos);
        } catch (error) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
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
        <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-bold text-white tracking-wide`}>Tasks</h3>
        <div className="flex gap-1">
          <button
            onClick={exportTodos}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Export"
          >
            <Download className="w-4 h-4" />
          </button>
          <label className="cursor-pointer">
            <input type="file" accept=".json" onChange={importTodos} className="hidden" />
            <div className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Import">
              <Upload className="w-4 h-4" />
            </div>
          </label>
        </div>
      </div>

      {/* Input */}
      <div className={`relative z-10 flex gap-2 ${isSmall ? 'mb-2' : 'mb-4'}`}>
        <div className="relative flex-1">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            className={`w-full bg-black/20 border border-white/10 rounded-xl px-3 ${isSmall ? 'py-1.5 text-xs' : 'py-2 text-sm'} text-white placeholder-white/40 outline-none focus:border-primary/50 focus:bg-black/40 transition-all`}
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 pointer-events-none transition-opacity duration-300" />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addTodo}
          className={`bg-gradient-to-r from-primary to-accent rounded-xl px-3 flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all`}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Todo List */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence mode='popLayout'>
          {todos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-white/30 mt-8 italic"
            >
              No tasks pending...
            </motion.div>
          ) : (
            todos.map((todo: Todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
                className={`group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl ${isSmall ? 'p-2 mb-1.5' : 'p-3 mb-2'} transition-all`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${todo.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-white/30 text-transparent hover:border-primary'
                    }`}
                >
                  <Check className="w-3 h-3" />
                </button>

                <span className={`flex-1 text-sm text-white/90 ${todo.completed ? 'line-through text-white/40' : ''}`}>
                  {todo.text}
                </span>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TodoList;
