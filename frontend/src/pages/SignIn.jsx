import React, { useState } from 'react';
import { google, github } from "../utils/lottie.js";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

const SignIn = () => {
    const [provider, setProvider] = useState("google");

    const handleSignInWithGoogle = () => {
        console.log("Google sign-in logic here");
    };

    const handleSignInWithGitHub = () => {
        console.log("GitHub sign-in logic here");
    };

    const handleSignIn = () => {
        if (provider === "google") {
            handleSignInWithGoogle();
        } else {
            handleSignInWithGitHub();
        }
    };

    return (
        <div className='min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4'>
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className='w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6'
            >
                {/* Header */}
                <div className='text-center'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back</h1>
                    <p className='text-gray-600'>Sign in to continue to WorkGrid</p>
                </div>

                {/* Provider Selection */}
                <div className='flex gap-2 p-1 bg-gray-100 rounded-lg'>
                    <button
                        onClick={() => setProvider("google")}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${provider === "google"
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <FaGoogle className='w-4 h-4' />
                        Google
                    </button>
                    <button
                        onClick={() => setProvider("github")}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${provider === "github"
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <FaGithub className='w-4 h-4' />
                        GitHub
                    </button>
                </div>

                {/* Lottie Animation */}
                <div className='h-40 w-full flex justify-center items-center bg-gray-50 rounded-xl'>
                    <motion.div
                        key={provider}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className='w-32 h-32'
                    >
                        <DotLottieReact src={provider === "google" ? google : github} autoplay />
                    </motion.div>
                </div>

                {/* Provider Info */}
                <div className='text-center'>
                    <p className='text-lg font-semibold text-gray-800 mb-1'>
                        Sign in with {provider === "google" ? "Google" : "GitHub"}
                    </p>
                    <p className='text-sm text-gray-500'>
                        {provider === "google"
                            ? "Use your Google account to access WorkGrid"
                            : "Use your GitHub account to access WorkGrid"
                        }
                    </p>
                </div>

                {/* Sign In Button */}
                <motion.button
                    onClick={handleSignIn}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${provider === "google"
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/25'
                        : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black shadow-lg hover:shadow-gray-500/25'
                        }`}
                >
                    {provider === "google" ? <FaGoogle className='w-4 h-4' /> : <FaGithub className='w-4 h-4' />}
                    Continue with {provider === "google" ? "Google" : "GitHub"}
                    <HiArrowRight className='w-4 h-4' />
                </motion.button>

                {/* Footer */}
                <div className='text-center pt-4 border-t border-gray-200'>
                    <p className='text-xs text-gray-500 mb-1'>
                        By signing in, you agree to our{' '}
                        <a href="/terms" className='text-blue-600 hover:text-blue-700 underline cursor-pointer'>
                            Terms of Service
                        </a>
                        {' '}and{' '}
                        <a href="/privacy" className='text-blue-600 hover:text-blue-700 underline cursor-pointer'>
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;