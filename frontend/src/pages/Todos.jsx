import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaListUl } from 'react-icons/fa';
import DatePickerField from '../components/DatePickerField';
import { useForm, Controller } from 'react-hook-form';
import { useSocketEmit, useSocketOn } from '../hooks/useSocket';
import { useProject } from '../store/project';
import Loader from '../components/Loader';

export default function Todos() {
  const { projectId } = useParams();
  const { roomID } = useProject();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState('list'); // 'list' or 'board'
  const socketEmit = useSocketEmit();
  
  // Initialize react-hook-form
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      task: '',
      dueDate: new Date(),
      priority: 'medium'
    }
  });

  // Priority options with their styling
  const priorityOptions = {
    high: { label: 'high', bg: 'bg-red-100', text: 'text-red-800', darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-300' },
    medium: { label: 'medium', bg: 'bg-amber-100', text: 'text-amber-800', darkBg: 'dark:bg-amber-900/30', darkText: 'dark:text-amber-300' },
    low: { label: 'low', bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900/30', darkText: 'dark:text-green-300' },
  };

  // Load todos on component mount
  useEffect(() => {
    // This would typically be a server fetch
    const mockTodos = [
      { id: '1', task: 'Complete project proposal', completed: false, priority: 'high', dueDate: '2025-01-15' },
      { id: '2', task: 'Review team feedback', completed: true, priority: 'medium', dueDate: '2025-01-14' },
      { id: '3', task: 'Schedule client meeting', completed: false, priority: 'low', dueDate: '2025-01-16' }
    ];
    
    setTodos(mockTodos);
    
    // In a real implementation, you'd use socket or fetch:
    // socketEmit('get-todos', { projectId, roomID });
  }, [projectId]);

  // Socket listeners for real-time updates
  useSocketOn('todos-updated', (updatedTodos) => {
    console.log('Received updated todos:', updatedTodos);
    setTodos(updatedTodos);
    setLoading(false);
  });

  // Handle adding a new todo
  const onSubmit = (data) => {
    setLoading(true);
    
    // Create new todo object
    const newTodo = {
      id: Date.now().toString(),
      task: data.task,
      completed: false,
      priority: data.priority,
      dueDate: data.dueDate.toISOString().split('T')[0]
    };
    
    // In a real app, emit to socket
    // socketEmit('add-todo', { projectId, roomID, todo: newTodo });
    
    // For now, update locally
    setTodos([...todos, newTodo]);
    setLoading(false);
    reset({ task: '', dueDate: new Date(), priority: 'medium' });
  };

  // Handle toggling todo completion
  const toggleComplete = (id) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    // In a real app, emit to socket
    // socketEmit('update-todo', { projectId, roomID, todoId: id, completed: !todos.find(t => t.id === id).completed });
    
    setTodos(updatedTodos);
  };

  // Handle deleting a todo
  const deleteTodo = (id, e) => {
    e.stopPropagation(); // Prevent triggering toggleComplete
    
    const updatedTodos = todos.filter(todo => todo.id !== id);
    
    // In a real app, emit to socket
    // socketEmit('delete-todo', { projectId, roomID, todoId: id });
    
    setTodos(updatedTodos);
  };

  // Format date to display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-purple-100">My Todos</h1>
          <button 
            onClick={() => setViewType(viewType === 'list' ? 'board' : 'list')}
            className="px-3 py-1.5 flex items-center gap-2 bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#2a283a] rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium"
          >
            <FaListUl className="text-[#6229b3] dark:text-[#c2a7fb]" /> List
          </button>
        </div>
        
        {/* Add Todo Form */}
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="flex flex-col sm:flex-row items-end gap-2 mb-6"
        >
          {/* Task input */}
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Add a new todo..."
              {...register('task', { required: true, minLength: 3 })}
              className={`w-full px-4 py-3 border ${errors.task ? 'border-red-500' : 'border-gray-300 dark:border-[#2a283a]'} rounded-lg bg-white dark:bg-[#13111d] text-gray-800 dark:text-purple-100 focus:outline-none focus:ring-1 focus:ring-[#6229b3]`}
            />
          </div>
          
          {/* Due date picker */}
          <div className="w-full sm:w-40 flex-shrink-0">
            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => (
                <DatePickerField
                  value={field.value}
                  onChange={field.onChange}
                  calendarWidth={280}
                />
              )}
            />
          </div>
          
          {/* Add button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center px-4 py-3 bg-[#6229b3] text-white rounded-lg hover:bg-[#4c1f8e] disabled:opacity-70"
          >
            {loading ? <Loader className="w-5 h-5" /> : <FaPlus />}
          </button>
        </form>
        
        {/* Priority selector - below form */}
        <div className="flex gap-2 mb-4">
          {Object.keys(priorityOptions).map(priority => (
            <label
              key={priority}
              className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer ${
                priorityOptions[priority].bg + ' ' + priorityOptions[priority].text + ' ' + 
                priorityOptions[priority].darkBg + ' ' + priorityOptions[priority].darkText
              }`}
            >
              <input
                type="radio"
                value={priority}
                {...register('priority')}
                className="sr-only"
              />
              <div className={`w-3 h-3 rounded-full ${
                priority === 'high' ? 'bg-red-600 dark:bg-red-500' :
                priority === 'medium' ? 'bg-amber-600 dark:bg-amber-500' :
                'bg-green-600 dark:bg-green-500'
              }`} />
              {priorityOptions[priority].label}
            </label>
          ))}
        </div>
        
        {/* Todo List */}
        <div className="mt-4">
          <AnimatePresence mode="popLayout">
            {todos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/10 dark:to-transparent rounded-lg border border-gray-200 dark:border-[#2a283a]"
              >
                <p className="text-gray-500 dark:text-gray-400">No todos yet. Add your first task above.</p>
              </motion.div>
            ) : (
              todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/10 dark:to-transparent border border-gray-200 dark:border-[#2a283a] rounded-lg mb-3 p-4 flex items-center gap-3"
                  onClick={() => toggleComplete(todo.id)}
                >
                  {/* Checkbox */}
                  <div 
                    className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center ${
                      todo.completed 
                        ? 'bg-[#6229b3] border-[#6229b3]' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {todo.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Todo content */}
                  <div className="flex-1">
                    <p className={`text-gray-800 dark:text-purple-100 ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                      {todo.task}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {/* Priority badge */}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        priorityOptions[todo.priority].bg + ' ' + priorityOptions[todo.priority].text + ' ' + 
                        priorityOptions[todo.priority].darkBg + ' ' + priorityOptions[todo.priority].darkText
                      }`}>
                        {todo.priority}
                      </span>
                      
                      {/* Due date */}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(todo.dueDate)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => deleteTodo(todo.id, e)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1.5"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
