import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../store/project';
import { FaCalendarAlt, FaClipboardList, FaPlus } from 'react-icons/fa';
import { useSocketEmit } from '../hooks/useSocket';
import { useForm } from 'react-hook-form';
import Loader from '../components/Loader';

export default function Logs() {
  const { projectId, projectName } = useParams();
  const { logs } = useProject();
  const [loading, setLoading] = useState(false);
  const socketEmit = useSocketEmit();
  const { roomID } = useProject();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Socket emission would go here
      // socketEmit("add-project-log", { roomID, projectId, description: data.description });
      
      console.log('Adding log entry:', data);
      reset(); // Reset form after submission
      
      // For demo purposes, let's add to logs directly
      // This would normally be done through socket update
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      console.error("Error adding log entry:", error);
      setLoading(false);
    }
  };

  // Mock data for demo - in production, this would come from the project store
  const logEntries = logs.length > 0 ? logs : [
    {
      _id: "1",
      date: "2024-01-15T10:20:00",
      description: "Initial project setup and repository creation. Configured development environment and installed necessary dependencies."
    },
    {
      _id: "2",
      date: "2024-01-16T14:15:00",
      description: "Implemented user authentication system with login and registration functionality. Added password validation and security measures."
    },
    {
      _id: "3",
      date: "2024-01-17T11:45:00",
      description: "Created responsive dashboard layout with navigation components. Integrated dark mode toggle and improved accessibility."
    }
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-purple-100">Project Activity Log</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-purple-200/70 mt-2">Track your project progress and activities</p>
        </div>

        {/* Add New Log Entry Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/20 dark:to-transparent border border-gray-100 dark:border-[#c2a7fb]/20 rounded-xl p-5 sm:p-6 mb-8 shadow-sm dark:shadow-lg"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-purple-100 mb-4">Add New Log Entry</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-1">Date</label>
                <div className="relative">
                  <div className="flex items-center bg-gray-50 dark:bg-[#13111d] border border-gray-300 dark:border-[#2a283a] rounded-md px-3 py-2">
                    <FaCalendarAlt className="text-gray-400 dark:text-gray-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-purple-200 mb-1">Activity Description</label>
                <textarea
                  rows="2"
                  placeholder="Enter activity description..."
                  className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-[#2a283a]'} dark:bg-[#13111d] dark:text-purple-100 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6229b3] focus:border-transparent transition-colors`}
                  {...register("description", {
                    required: "Description is required",
                    minLength: { value: 10, message: "Description must be at least 10 characters" }
                  })}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.description.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-4 py-2 bg-[#6229b3] text-white rounded-md hover:bg-[#4c1f8e] transition-colors disabled:bg-[#a78bfa] disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" />
                    <span>Add Log Entry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
        
        {/* Activity Timeline Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-purple-100 mb-6">Activity Timeline</h2>
          
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-900/50"></div>
            
            <div className="space-y-8">
              {logEntries.map((entry, index) => (
                <motion.div 
                  key={entry._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                  className="flex gap-5"
                >
                  {/* Circle on timeline */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + (index * 0.1), duration: 0.3, type: "spring" }}
                    className="w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md relative z-10"
                  >
                    <FaClipboardList className="text-white" />
                  </motion.div>
                  
                  {/* Content */}
                  <div className="bg-white dark:bg-[#13111d] border border-gray-200 dark:border-[#2a283a] rounded-lg p-4 flex-1 shadow-sm">
                    <div className="flex items-center mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <FaCalendarAlt className="mr-2" />
                      <span>{new Date(entry.date).toLocaleDateString()} • {new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-gray-700 dark:text-purple-200/80">{entry.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
