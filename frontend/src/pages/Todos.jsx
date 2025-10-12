import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaListUl } from 'react-icons/fa';
import DatePickerField from '../components/DatePickerField';
import { useForm } from 'react-hook-form';
import { useSocketEmit } from '../hooks/useSocket';
import { useProject } from '../store/project';
import Loader from '../components/Loader';
import useUser from '../hooks/useUser';
import serverRequest from '../utils/axios';
import { showSuccessToast, showErrorToast } from '../utils/toastMethods';

export default function Todos() {
  const { projectId } = useParams();
  const { roomID, info, todos, setTodos, currentTodosDate } = useProject();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewType, setViewType] = useState('list');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const socketEmit = useSocketEmit();
  const { user } = useUser();
  const userId = user?.data?._id || '';

  // Get project creation date and current date for date range
  const projectCreatedDate = useMemo(() => {
    const date = info?.createdAt ? new Date(info.createdAt) : new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, [info?.createdAt]);

  const currentDate = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const selectedDateNormalized = useMemo(() => {
    const date = new Date(selectedDate);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [selectedDate]);

  const isCurrentDate = selectedDateNormalized.getTime() === currentDate.getTime();

  // Initialize react-hook-form
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium'
    }
  });

  // Priority options with their styling
  const priorityOptions = {
    high: { label: 'High', bg: 'bg-red-100', text: 'text-red-800', darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-300', icon: '🔴' },
    medium: { label: 'Medium', bg: 'bg-amber-100', text: 'text-amber-800', darkBg: 'dark:bg-amber-900/30', darkText: 'dark:text-amber-300', icon: '🟡' },
    low: { label: 'Low', bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900/30', darkText: 'dark:text-green-300', icon: '🟢' },
  };

  // Utility function to format date in local timezone for display and API
  const formatDateToLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch todos for selected date
  useEffect(() => {
    const fetchTodosForDate = async () => {
      // Use local date for formatting
      const dateString = formatDateToLocal(selectedDate);
      
      // Check if we already have this date's todos loaded
      if (currentTodosDate === dateString) {
        return;
      }
      
      setLoading(true);
      try {
        const { data } = await serverRequest.get(`/todos/${projectId}?date=${dateString}`);
        setTodos(data?.data || [], dateString);
      } catch (error) {
        showErrorToast('Failed to load tasks for the selected date');
        setTodos([], dateString);
      } finally {
        setLoading(false);
      }
    };

    if (projectId && roomID) {
      fetchTodosForDate();
    }
  }, [selectedDate, projectId, roomID, setTodos, currentTodosDate]);

  // Display todos (no filtering needed - todos in state are already for the selected date)
  const displayTodos = todos;

  // Check if current user is the creator of a todo
  const isCreator = (todo) => {
    const creatorId = todo.createdBy?._id || todo.createdBy;
    return userId === creatorId;
  };

  // Generate a consistent color based on username
  const getAvatarColor = (username) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = username ? username.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // ========== HANDLERS ========== //

  // Handle adding a new todo
  const onSubmit = async (data) => {
    if (!isCurrentDate) {
      showErrorToast('You can only add tasks for today');
      return;
    }

    if (!userId || !projectId || !roomID) {
      showErrorToast('Missing required data. Please refresh the page.');
      return;
    }

    setSubmitting(true);
    try {
      // Get current date in YYYY-MM-DD format
      const currentDateString = formatDateToLocal(new Date());
      
      socketEmit('new-todo', {
        title: data.title,
        description: data.description,
        status: false,
        createdBy: userId,
        projectId: projectId,
        priority: data.priority,
        roomID: roomID,
        date: currentDateString // Send the local date string
      });

      showSuccessToast('Task added successfully');
      reset({ title: '', description: '', priority: 'medium' });
    } catch (error) {
      showErrorToast('Failed to add task');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle toggling todo completion
  const toggleComplete = (todo) => {
    if (!isCurrentDate) return;
    
    // Check if user is the creator
    if (!isCreator(todo)) {
      showErrorToast('You can only update your own tasks');
      return;
    }

    const eventName = todo.status ? 'mark-todo-pending' : 'mark-todo-completed';
    socketEmit(eventName, { todoId: todo._id, roomID });
  };

  // Handle deleting a todo
  const deleteTodo = (id, todo, e) => {
    e.stopPropagation();

    if (!isCurrentDate) {
      showErrorToast('You can only delete tasks from today');
      return;
    }

    // Check if user is the creator
    if (!isCreator(todo)) {
      showErrorToast('You can only delete your own tasks');
      return;
    }

    socketEmit('delete-todo', { todoId: id, roomID });
  };

  // Format date to display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle date change from picker
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: { duration: 0.15 }
    }
  };

  return (
    <motion.div
      className="p-4 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-purple-100 whitespace-nowrap">
            📝 My Todos
          </h1>
          <div className="w-full sm:w-auto">
            <DatePickerField
              value={selectedDate}
              onChange={handleDateChange}
              minDate={projectCreatedDate}
              maxDate={currentDate}
              calendarWidth={280}
            />
          </div>
        </motion.div>

        {/* Add Todo Form - Only show for current date */}
        <AnimatePresence mode="wait">
          {isCurrentDate && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#2a283a] rounded-lg p-4 mb-6 shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <input
                    type="text"
                    placeholder="Todo title..."
                    {...register('title', { required: true, minLength: 3 })}
                    className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-[#2a283a]'} rounded-lg bg-white dark:bg-[#1a1825] text-gray-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-[#6229b3] transition-all`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      Title is required (min 3 characters)
                    </p>
                  )}
                </div>

                <div>
                  <select
                    {...register('priority')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-[#2a283a] rounded-lg bg-white dark:bg-[#1a1825] text-gray-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-[#6229b3] cursor-pointer transition-all"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <textarea
                  placeholder="Description..."
                  {...register('description', { required: true, minLength: 5 })}
                  rows={3}
                  className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-[#2a283a]'} rounded-lg bg-white dark:bg-[#1a1825] text-gray-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-[#6229b3] resize-none transition-all`}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    Description is required (min 5 characters)
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#6229b3] text-white rounded-lg hover:bg-[#4c1f8e] disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
              >
                {submitting ? <Loader className="w-5 h-5" /> : <><FaPlus /> Add Todo</>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Show message for past dates */}
        <AnimatePresence mode="wait">
          {!isCurrentDate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 shadow-sm"
            >
              <p className="text-amber-800 dark:text-amber-300 text-sm flex items-center gap-2">
                <span className="text-lg">📅</span>
                Viewing todos for <strong>{formatDate(selectedDate.toISOString())}</strong>.
                You can only add or modify todos for today.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Todo List */}
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8" />
            </div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <AnimatePresence mode="popLayout">
                {displayTodos.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12 bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/10 dark:to-transparent rounded-lg border border-gray-200 dark:border-[#2a283a] shadow-sm"
                  >
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-500 dark:text-gray-400">
                      {isCurrentDate ? 'No todos yet. Add your first task above! 🚀' : 'No todos for this date.'}
                    </p>
                  </motion.div>
                ) : (
                  displayTodos.map((todo) => {
                    const canModify = isCurrentDate && isCreator(todo);
                    
                    return (
                      <motion.div
                        key={todo._id}
                        variants={itemVariants}
                        layout
                        className={`bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/10 dark:to-transparent border border-gray-200 dark:border-[#2a283a] rounded-lg mb-3 p-4 shadow-sm hover:shadow-md transition-shadow ${canModify ? 'cursor-pointer' : ''}`}
                        onClick={() => canModify && toggleComplete(todo)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox - only visible if user can modify */}
                          {canModify ? (
                            <div
                              className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                                todo.status ? 'bg-[#6229b3] border-[#6229b3]' : 'border-gray-300 dark:border-gray-600'
                              }`}
                            >
                              <AnimatePresence>
                                {todo.status && (
                                  <motion.svg
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </motion.svg>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                              {todo.status ? (
                                <svg
                                  className="w-5 h-5 text-[#6229b3] dark:text-[#c2a7fb]"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 opacity-50"></div>
                              )}
                            </div>
                          )}

                          <div className="flex-1 min-w-0 overflow-hidden">
                            {/* Title with truncation */}
                            <h3 
                              className={`font-semibold text-gray-900 dark:text-purple-100 mb-1 truncate ${todo.status ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}
                              title={todo.title}
                            >
                              {todo.title}
                            </h3>
                            
                            {/* Description with line clamp (max 2 lines) - with word-break */}
                            <p 
                              className={`text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2 break-words ${todo.status ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}
                              title={todo.description}
                            >
                              {todo.description}
                            </p>
                            
                            <div className="flex items-center gap-3 flex-wrap">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                                  priorityOptions[todo.priority].bg + ' ' + priorityOptions[todo.priority].text + ' ' +
                                  priorityOptions[todo.priority].darkBg + ' ' + priorityOptions[todo.priority].darkText
                                }`}
                              >
                                {priorityOptions[todo.priority].icon} {priorityOptions[todo.priority].label}
                              </span>

                              {todo.createdBy && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                  {todo.createdBy.avatar?.url ? (
                                    <img
                                      src={todo.createdBy.avatar.url}
                                      alt={todo.createdBy.username}
                                      className="w-4 h-4 rounded-full"
                                    />
                                  ) : (
                                    <div 
                                      className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold ${getAvatarColor(todo.createdBy.username)}`}
                                    >
                                      {todo.createdBy.username?.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <span className="truncate max-w-[100px]">{todo.createdBy.username}</span>
                                  {isCreator(todo) && (
                                    <span className="ml-1 text-[#6229b3] dark:text-[#c2a7fb] font-medium">(You)</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Delete button - only show if user is creator and it's current date */}
                          {canModify && (
                            <motion.button
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => deleteTodo(todo._id, todo, e)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                            >
                              <FaTrash className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}