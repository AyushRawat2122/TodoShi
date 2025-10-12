import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import useTheme from '../hooks/useTheme';

const NotFound = () => {
    const { isDark } = useTheme();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0c0a1a] p-4">
            <motion.div 
                className="max-w-md w-full text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                
                <motion.div
                    className="w-32 h-32 mx-auto mb-6 bg-purple-100 dark:bg-[#6229b3]/20 rounded-full flex items-center justify-center"
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 100, 
                        damping: 10 
                    }}
                >
                    <FaExclamationTriangle className="text-6xl text-[#6229b3] dark:text-[#c2a7fb]" />
                </motion.div>

                <motion.h1 
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    404
                </motion.h1>

                <motion.h2 
                    className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-purple-200 mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Page Not Found
                </motion.h2>

                <motion.p 
                    className="text-gray-600 dark:text-purple-200/70 mb-8 px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    The page you're looking for doesn't exist or has been moved.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link to="/">
                        <motion.button
                            className="px-6 py-3 bg-[#6229b3] text-white rounded-lg font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaHome className="text-lg" />
                            Back to Home
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Decorative elements */}
                <div className="mt-12 flex justify-center gap-2">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                                isDark ? 'bg-[#c2a7fb]' : 'bg-[#6229b3]'
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 0.6 + i * 0.1,
                                type: "spring",
                                stiffness: 300,
                                damping: 10
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default NotFound;
