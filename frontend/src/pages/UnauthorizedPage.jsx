import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiLock, FiArrowLeft } from "react-icons/fi";
import useTheme from "../hooks/useTheme";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-[#0c0a1a]">
      <motion.div 
        className="max-w-md w-full bg-white dark:bg-[#13111d] rounded-xl shadow-lg overflow-hidden p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            delay: 0.2
          }}
        >
          <FiLock className="text-red-500 dark:text-red-400 text-4xl" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold mb-3 text-gray-800 dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          403: Unauthorized Access
        </motion.h1>
        
        <motion.div 
          className="h-1 w-16 bg-red-400 dark:bg-red-500/60 mx-auto my-4 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        ></motion.div>
        
        <motion.p 
          className="text-gray-600 dark:text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          You don't have permission to access this page or resource. This might be because:
          <ul className="text-left mt-4 space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2 text-red-500 dark:text-red-400">•</span>
              You need to be logged in
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-500 dark:text-red-400">•</span>
              You don't have the required permissions
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-500 dark:text-red-400">•</span>
              The resource has been moved or deleted
            </li>
          </ul>
        </motion.p>
        
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center justify-center mx-auto px-6 py-3 bg-[#4c1f8e] dark:bg-[#6229b3]/70 text-white rounded-lg font-medium shadow-md hover:bg-[#6229b3] dark:hover:bg-[#6229b3] transition-all hover:shadow-lg hover:-translate-y-0.5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiArrowLeft className="mr-2" />
          Back to Home
        </motion.button>
      </motion.div>
      
      <motion.p 
        className="mt-6 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Need help? <span onClick={() => navigate('/contact')} className="text-[#4c1f8e] dark:text-[#c2a7fb] cursor-pointer hover:underline">Contact support</span>
      </motion.p>
    </div>
  );
}
