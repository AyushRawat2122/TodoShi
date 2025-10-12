import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import serverRequest from '../utils/axios';
import { FaGithub, FaLinkedin, FaTwitter, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import Loader from '../components/Loader';
import useIsLargeScreen from '../hooks/useIsLargeScreen';
import useTheme from '../hooks/useTheme'; 
import { showErrorToast } from '../utils/toastMethods'; // Import toast error method

const User = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const { userId } = useParams();
    const navigate = useNavigate();
    const isLarge = useIsLargeScreen();
    const { isDark } = useTheme(); 

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await serverRequest.get(`/users/${userId}`);
                setUser(response.data.data);
                setError(null);
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to fetch user details';
                showErrorToast(errorMessage);
                setError(errorMessage);
                if (err.response?.status === 404) {
                    setTimeout(() => navigate('/404'), 2000);
                }
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId, navigate]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const bannerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0c0a1a]">
                <Loader className="w-16 h-16" />
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0c0a1a]"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
                    <p className="text-gray-700 dark:text-purple-200/70">{error}</p>
                </div>
            </motion.div>
        );
    }

    if (!user) return null;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-gray-50 dark:bg-[#0c0a1a] pb-12"
        >
            {/* Banner Section */}
            <motion.div
                variants={bannerVariants}
                className="relative w-full h-64 overflow-hidden"
            >
                {user.banner?.url ? (
                    <img
                        src={user.banner.url}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-purple-900/40 dark:to-indigo-900/40" />
                )}
            </motion.div>

            <div className="max-w-4xl mx-auto px-4">
                {/* Avatar and Basic Info */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        className="w-40 h-40 -mt-20 rounded-full border-4 border-gray-50 dark:border-[#0c0a1a] shadow-[0_0_15px_rgba(0,0,0,0.2)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden bg-white dark:bg-[#13111d] z-10 relative"
                    >
                        {user.avatar?.url ? (
                            <img
                                src={user.avatar.url}
                                alt={user.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-400 dark:text-purple-300/70">
                                {user.username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </motion.div>

                    <div className="bg-white/90 dark:bg-[#13111d]/80 backdrop-blur-sm rounded-xl p-6 flex-1 text-center md:text-left mt-0 md:-mt-6 shadow-sm">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.username}</h1>
                        <span className="inline-block px-4 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium capitalize">
                            {user.role}
                        </span>
                    </div>
                </motion.div>

                {/* About Section */}
                {user.about?.description && (
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/90 dark:bg-[#13111d]/80 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-sm"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                        <p className="text-gray-700 dark:text-purple-200/80 leading-relaxed">{user.about.description}</p>
                    </motion.div>
                )}

                {/* Skills Section */}
                {user.skills && user.skills.length > 0 && (
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/90 dark:bg-[#13111d]/80 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-sm"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill, index) => (
                                <motion.span
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                    className="px-4 py-2 bg-gray-100 dark:bg-[#0c0a1a] text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Social Links and Location */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white/90 dark:bg-[#13111d]/80 backdrop-blur-sm rounded-xl p-6 shadow-sm"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Connect</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.about?.location && (
                            <motion.div
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-3 text-gray-700 dark:text-purple-200/80"
                            >
                                <FaMapMarkerAlt className="text-red-500 dark:text-red-400 text-xl flex-shrink-0" />
                                <span>{user.about.location}</span>
                            </motion.div>
                        )}
                        {user.about?.github && (
                            <motion.a
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                                href={user.about.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-gray-700 dark:text-purple-200/80 hover:text-gray-900 dark:hover:text-white"
                            >
                                <FaGithub className="text-gray-800 dark:text-purple-200 text-xl flex-shrink-0" />
                                <span>GitHub</span>
                            </motion.a>
                        )}
                        {user.about?.linkedIn && (
                            <motion.a
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                                href={user.about.linkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-gray-700 dark:text-purple-200/80 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                <FaLinkedin className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0" />
                                <span>LinkedIn</span>
                            </motion.a>
                        )}
                        {user.about?.x && (
                            <motion.a
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                                href={user.about.x}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-gray-700 dark:text-purple-200/80 hover:text-blue-500 dark:hover:text-blue-300"
                            >
                                <FaTwitter className="text-blue-500 dark:text-blue-300 text-xl flex-shrink-0" />
                                <span>Twitter/X</span>
                            </motion.a>
                        )}
                        {user.about?.portfolio && (
                            <motion.a
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                                href={user.about.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-gray-700 dark:text-purple-200/80 hover:text-purple-600 dark:hover:text-purple-300"
                            >
                                <FaGlobe className="text-purple-600 dark:text-purple-300 text-xl flex-shrink-0" />
                                <span>Portfolio</span>
                            </motion.a>
                        )}
                    </div>
                </motion.div>
            </div>

            {!isLarge && <div className='h-20' />}
        </motion.div>
    );
}

export default User;
