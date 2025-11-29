import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Todo } from '../../types';
import { CheckSquareIcon, SquareIcon, Trash2Icon, PlusIcon } from '../icons';
import { Download, Upload } from 'lucide-react';
import { ThemeParticles } from '../ThemeParticles';

interface TodoListProps {
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const TodoList: React.FC<TodoListProps> = ({ theme = 'aurora', size = 'medium' }) => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('homeTabTodos', []);
  const [newTodo, setNewTodo] = useState('');

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
    <div className={`${isSmall ? 'p-2' : 'p-4'} h-full flex flex-col relative overflow-hidden`}>
      {/* Theme Particles */}
      <ThemeParticles theme={theme} density="low" />
      
      <div className={`relative z-10 flex items-center justify-between ${isSmall ? 'mb-2' : 'mb-3'}`}>
        <h3 className={`${isSmall ? 'text-base' : 'text-lg'} font-bold`}>To-Do List</h3>
        <div className="flex gap-2">
          <button
            onClick={exportTodos}
            title="Export todos"
            className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={importTodos}
              className="hidden"
            />
            <div className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors">
              <Upload className="w-4 h-4" />
            </div>
          </label>
        </div>
      </div>
      
      <div className={`flex gap-2 ${isSmall ? 'mb-2' : 'mb-3'}`}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className={`flex-1 bg-white/10 rounded px-3 ${isSmall ? 'py-1' : 'py-2'} text-sm outline-none focus:bg-white/20`}
        />
        <button
          onClick={addTodo}
          title="Add todo"
          className={`bg-white/20 hover:bg-white/30 rounded px-3 ${isSmall ? 'py-1' : 'py-2'} transition-colors`}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {todos.length === 0 ? (
          <div className="text-center text-sm opacity-50 mt-4">No tasks yet</div>
        ) : (
          todos.map((todo: Todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-2 bg-white/5 rounded ${isSmall ? 'p-1.5' : 'p-2'} hover:bg-white/10 transition-colors`}
            >
              <button onClick={() => toggleTodo(todo.id)} className="flex-shrink-0">
                {todo.completed ? (
                  <CheckSquareIcon className={`w-5 h-5 icon-color`} />
                ) : (
                  <SquareIcon className={`w-5 h-5`} />
                )}
              </button>
              <span className={`flex-1 text-sm ${todo.completed ? 'line-through opacity-50' : ''}`}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              >
                <Trash2Icon className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
