import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { RiFirebaseFill } from 'react-icons/ri';
import { Oauth } from '../components/index.js';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import useIsLargeScreen from '../hooks/useIsLargeScreen';
import { loginWithEmail } from "../firebase/auth.js"
import useTheme from '../hooks/useTheme';
import { showSuccessToast, showErrorToast } from '../utils/toastMethods';
import Loader from '../components/Loader';

const SignIn = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const isLargeScreen = useIsLargeScreen();
    const { isDark } = useTheme();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data) => {
        const { email, password } = data;
        if (loading) return;
        try {
            localStorage.setItem("lastSignInMethod", "password");
            setLoading(true);
            await loginWithEmail(email, password);
            showSuccessToast("Signed in successfully");
        } catch (error) {
            let errorMessage = "Failed to sign in. Please check your credentials.";
            
            // Handle specific Firebase auth errors
            if (error.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email.";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format.";
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = "This account has been disabled.";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Too many failed attempts. Try again later.";
            }
            
            showErrorToast(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='h-screen w-full flex items-center justify-center dark:bg-[#0c0a1a]'>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                className={`dark:transparent rounded-lg shadow-lg ${isLargeScreen ? 'w-[80%]' : 'w-full'} h-full flex flex-col md:flex-row  overflow-hidden dark:border dark:border-[#c2a7fb]/20`}
            >
                {isLargeScreen && (
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 z-10"></div>
                        <img src="/goodbyeChaos.png" alt="todoshi" className='w-full h-full object-cover relative z-0' />
                    </div>
                )}
                <div className={`p-10 ${isLargeScreen ? 'w-[40%]' : 'w-full'} dark:bg-transparent dark:bg-gradient-to-br dark:from-[#c2a7fb]/10 dark:to-transparent`}>
                    <div className={`flex flex-col ${!isLargeScreen ? 'items-center' : ''}`}>
                        <img 
                            src={isDark ? "/todoshi-branding-light.png" : "/todoshi-branding-dark.png"}
                            alt="todoshi-name" 
                            className='h-[80px] max-w-[200px]' 
                        />
                        <h2 className='text-3xl mt-4 font-bold mb-2 text-center md:text-left text-[#4c1f8e] dark:text-purple-100'>
                            Welcome Back!
                        </h2>
                        <p className='text-lg text-gray-700 dark:text-purple-200/80 mb-6 text-center md:text-left'>
                            Sign in to your account
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 flex flex-col items-center'>
                        <div className='w-full max-w-96'>
                            <label className='block text-sm font-medium mb-1 dark:text-purple-200'>Email</label>
                            <input
                                type='email'
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                        message: 'Email must end with @gmail.com'
                                    }
                                })}
                                className='w-full p-2 border rounded dark:border-[#2a283a] dark:bg-[#13111d] dark:text-purple-100 focus:outline-none focus:ring-1 focus:ring-[#6229b3] focus:border-transparent transition-colors'
                            />
                            {errors.email && <p className='text-red-500 dark:text-red-400 text-sm'>{errors.email.message}</p>}
                        </div>
                        <div className='w-full max-w-96'>
                            <label className='block text-sm font-medium mb-1 dark:text-purple-200'>Password</label>
                            <div className='relative'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters long'
                                        }
                                    })}
                                    className='w-full p-2 border rounded pr-10 dark:border-[#2a283a] dark:bg-[#13111d] dark:text-purple-100 focus:outline-none focus:ring-1 focus:ring-[#6229b3] focus:border-transparent transition-colors'
                                />
                                <button
                                    type='button'
                                    onClick={togglePasswordVisibility}
                                    className='absolute inset-y-0 right-0 px-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none'
                                >
                                    {showPassword ? <AiOutlineEyeInvisible className='text-2xl' /> : <AiOutlineEye className='text-2xl' />}
                                </button>
                            </div>
                            {errors.password && <p className='text-red-500 dark:text-red-400 text-sm mt-1'>{errors.password.message}</p>}
                        </div>
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full max-w-96 text-white py-2 rounded transition-all
                                bg-[#8236ec] hover:bg-[#6229b3] 
                                dark:bg-[#6229b3]/40 dark:hover:bg-[#6229b3]/70
                                focus:outline-none focus:ring-2 focus:ring-[#6229b3]/50
                                flex items-center justify-center'
                        >
                            {loading ? (
                                <>
                                    <Loader className="mr-2 text-white" /> 
                                    Signing in...
                                </>
                            ) : 'Sign In'}
                        </button>
                    </form>
                    <p className='text-center text-sm text-gray-500 dark:text-gray-400 mt-4'>
                        Don't have an account?{' '}
                        <a href='/sign-up' className='text-[#8236ec] dark:text-[#c2a7fb] underline hover:text-[#6229b3] dark:hover:text-[#c2a7fb]/80'>
                            Create one here
                        </a>.
                    </p>
                    <hr className='my-4 border-gray-300 dark:border-[#2a283a]' />
                    <div className='mt-4 text-center text-sm'>
                        <Oauth />
                    </div>
                    <div className='flex items-center justify-center mt-6'>
                        <RiFirebaseFill className='text-gray-500 dark:text-gray-400 text-2xl mr-2' />
                        <p className='text-gray-500 dark:text-gray-400 text-sm'>Powered by Firebase</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;
