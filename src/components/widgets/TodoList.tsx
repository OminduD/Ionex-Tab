import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Todo } from '../../types';
import { CheckSquareIcon, SquareIcon, Trash2Icon, PlusIcon } from '../icons';

const TodoList: React.FC = () => {
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

  return (
    <div className="p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold mb-3">To-Do List</h3>
      
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 bg-white/10 rounded px-3 py-2 text-sm outline-none focus:bg-white/20"
        />
        <button
          onClick={addTodo}
          className="bg-white/20 hover:bg-white/30 rounded px-3 py-2 transition-colors"
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
              className="flex items-center gap-2 bg-white/5 rounded p-2 hover:bg-white/10 transition-colors"
            >
              <button onClick={() => toggleTodo(todo.id)} className="flex-shrink-0">
                {todo.completed ? (
                  <CheckSquareIcon className="w-5 h-5 icon-color" />
                ) : (
                  <SquareIcon className="w-5 h-5" />
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
