import React, { useState, memo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Todo } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Plus, Download, Upload, Sparkles, Zap, Trophy, Target } from 'lucide-react';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';
import { useGamification } from '../../context/GamificationContext';

interface TodoListProps {
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const TodoList: React.FC<TodoListProps> = ({ size = 'medium', theme = 'aurora' }) => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('homeTabTodos', []);
  const [newTodo, setNewTodo] = useState('');
  const { variants } = useThemeAnimation(theme);
  const { completeTask } = useGamification();
  const [showXpPopup, setShowXpPopup] = useState<string | null>(null);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo: Todo) => {
      if (todo.id === id) {
        const isCompleting = !todo.completed;
        if (isCompleting) {
          completeTask();
          setShowXpPopup(id);
          setTimeout(() => setShowXpPopup(null), 2000);
        }
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    }));
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

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isSmall = size === 'small';

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`h-full flex flex-col relative overflow-hidden ${isSmall ? 'p-3' : 'p-5'} rounded-3xl bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-2xl border border-white/10 shadow-2xl`}
    >
      {/* Animated Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-secondary/20 via-primary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Scan Lines Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-accent/30 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-secondary/30 rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/30 rounded-br-3xl" />

      {/* Header with Stats */}
      <div className={`relative z-10 ${isSmall ? 'mb-3' : 'mb-4'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-lg opacity-50" />
              <div className="relative bg-gradient-to-br from-primary via-accent to-secondary p-2 rounded-xl">
                <Target className="w-5 h-5 text-white" />
              </div>
            </motion.div>
            <div>
              <h3 className={`${isSmall ? 'text-base' : 'text-xl'} font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-accent tracking-wide`}>
                MISSION CONTROL
              </h3>
              <p className="text-[10px] text-white/40 font-mono tracking-wider">TASK_PROTOCOL_ACTIVE</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={exportTodos}
              className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-white/60 hover:text-primary border border-white/10 hover:border-primary/50 transition-all backdrop-blur-sm"
              title="Export Missions"
            >
              <Download className="w-3.5 h-3.5" />
            </motion.button>
            <label className="cursor-pointer">
              <input type="file" accept=".json" onChange={importTodos} className="hidden" />
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-white/5 hover:bg-accent/20 text-white/60 hover:text-accent border border-white/10 hover:border-accent/50 transition-all backdrop-blur-sm"
                title="Import Missions"
              >
                <Upload className="w-3.5 h-3.5" />
              </motion.div>
            </label>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/60 mb-1.5">
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              PROGRESS
            </span>
            <span className="font-bold">{completedCount}/{totalCount} COMPLETED</span>
          </div>
          <div className="relative h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/40 to-transparent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ filter: 'blur(4px)' }}
            />
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className={`relative z-10 ${isSmall ? 'mb-3' : 'mb-4'}`}>
        <div className="relative group">
          {/* Glowing border on focus */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-accent to-secondary rounded-xl opacity-0 group-focus-within:opacity-50 blur transition-opacity duration-300" />
          
          <div className="relative flex gap-2 bg-black/40 border border-white/10 rounded-xl p-1.5 backdrop-blur-sm group-focus-within:border-primary/50 transition-all">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Initialize new mission..."
              className={`flex-1 bg-transparent px-3 ${isSmall ? 'py-1.5 text-xs' : 'py-2 text-sm'} text-white placeholder-white/30 outline-none font-mono`}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addTodo}
              className="relative group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-lg blur group-hover/btn:blur-md transition-all" />
              <div className="relative bg-gradient-to-r from-primary via-accent to-secondary rounded-lg px-4 py-2 flex items-center justify-center text-white font-bold shadow-lg">
                <Plus className="w-4 h-4" />
                <span className="ml-1 text-xs font-mono tracking-wider">ADD</span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50 transition-all">
        <AnimatePresence mode='popLayout'>
          {todos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mb-4"
              >
                <Sparkles className="w-12 h-12 text-primary/30" />
              </motion.div>
              <p className="text-sm text-white/40 font-mono tracking-wide">NO ACTIVE MISSIONS</p>
              <p className="text-xs text-white/20 mt-1">Initialize your first task above</p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {todos.map((todo: Todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, x: -50, rotateX: -90 }}
                  animate={{ opacity: 1, x: 0, rotateX: 0 }}
                  exit={{ opacity: 0, x: 50, rotateX: 90, transition: { duration: 0.2 } }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  layout
                  className="group relative"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/0 via-accent/50 to-primary/0 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                  
                  <div className={`relative flex items-center gap-3 bg-gradient-to-r from-black/60 via-black/40 to-black/60 hover:from-black/80 hover:via-black/60 hover:to-black/80 border border-white/10 hover:border-primary/30 rounded-xl ${isSmall ? 'p-2.5' : 'p-3'} transition-all overflow-hidden backdrop-blur-sm`}>
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)]" />
                    </div>

                    {/* XP Popup */}
                    <AnimatePresence>
                      {showXpPopup === todo.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 0, scale: 0.5 }}
                          animate={{ 
                            opacity: [0, 1, 1, 0], 
                            y: [-20, -40, -50, -70],
                            scale: [0.5, 1.2, 1.3, 1.5],
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 2 }}
                          className="absolute right-8 top-1/2 z-50 pointer-events-none"
                        >
                          <div className="relative">
                            <motion.div
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-50"
                            />
                            <div className="relative flex items-center gap-1 text-yellow-400 font-black text-sm">
                              <Zap className="w-4 h-4" />
                              <span>+10 XP</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Completion Slash Animation */}
                    <AnimatePresence>
                      {todo.completed && (
                        <motion.div
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          exit={{ scaleX: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-10 origin-left"
                          style={{ transform: 'translateY(-50%)' }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Checkbox */}
                    <motion.button
                      onClick={() => toggleTodo(todo.id)}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative flex-shrink-0 z-10"
                    >
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        todo.completed
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-lg shadow-green-500/50'
                          : 'border-white/30 hover:border-primary/50 hover:bg-primary/10'
                      }`}>
                        <AnimatePresence>
                          {todo.completed && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Checkbox Glow */}
                      {todo.completed && (
                        <motion.div
                          className="absolute inset-0 bg-green-500 rounded-lg blur-md"
                          animate={{ opacity: [0.5, 0.8, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>

                    {/* Todo Text */}
                    <motion.span 
                      className={`flex-1 text-sm z-10 transition-all duration-300 font-mono ${
                        todo.completed 
                          ? 'text-white/30' 
                          : 'text-white/90 group-hover:text-white'
                      }`}
                      animate={todo.completed ? {} : { 
                        x: [0, 2, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      {todo.text}
                    </motion.span>

                    {/* Delete Button */}
                    <motion.button
                      onClick={() => deleteTodo(todo.id)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 z-10 transition-all"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity" />
                        <div className="relative p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      {todos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mt-3 pt-3 border-t border-white/10"
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>SYSTEM_ACTIVE</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{completionPercentage.toFixed(0)}% EFFICIENCY</span>
              <span className="text-primary font-bold">{totalCount} MISSIONS</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default memo(TodoList);
