import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { RiFirebaseFill } from 'react-icons/ri';
import { Oauth } from '../components/index.js';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import useIsLargeScreen from '../hooks/useIsLargeScreen'; // Import custom hook


const SignUp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const isLargeScreen = useIsLargeScreen(); // Use custom hook

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className='h-screen w-full flex items-center justify-center bg-gray-100'>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                className={`bg-white rounded-lg shadow-lg ${isLargeScreen ? 'w-[80%]' : 'w-full'} h-full flex flex-col md:flex-row gap-10 overflow-hidden`}
            >
                {isLargeScreen && (
                    <div>
                        <img src="/Todoshi.png" alt="todoshi" className='w-full h-full object-cover' />
                    </div>
                )}
                <div className={`p-10 ${isLargeScreen ? 'w-[40%]' : 'w-full'}`}>
                    <div className={`flex flex-col ${!isLargeScreen ? 'items-center' : ''}`}>
                        <img src="/todoshi-branding.png" alt="todoshi-name" className='h-[80px] max-w-[200px]' />
                        <h2 className='text-3xl mt-4 font-bold mb-2 text-center md:text-left text-[#4c1f8e]'>
                            Join Us Today!
                        </h2>
                        <p className='text-lg text-gray-700 mb-6 text-center md:text-left'>
                            Create your free account in just a few steps.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 flex w-full flex-col items-center'>
                        <div className={`w-full ${isLargeScreen ? '' : 'max-w-96'}`}>
                            <label className='block text-sm font-medium mb-1'>Email</label>
                            <input
                                type='email'
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                        message: 'Email must end with @gmail.com'
                                    }
                                })}
                                className='w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#4c1f8e]'
                            />
                            {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
                        </div>
                        <div className={`w-full ${isLargeScreen ? '' : 'max-w-96'}`}>
                            <label className='block text-sm font-medium mb-1'>Password</label>
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
                                    className='w-full p-3 border rounded pr-12 focus:outline-none focus:ring-2 focus:ring-[#4c1f8e]'
                                />
                                <button
                                    type='button'
                                    onClick={togglePasswordVisibility}
                                    className='absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 focus:outline-none'
                                >
                                    {showPassword ? <AiOutlineEyeInvisible className='text-2xl' /> : <AiOutlineEye className='text-2xl' />}
                                </button>
                            </div>
                            {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
                        </div>
                        <div className={`w-full ${isLargeScreen ? '' : 'max-w-96'} flex items-start`}>
                            <input
                                type='checkbox'
                                {...register('terms', { required: 'You must agree to the terms and conditions' })}
                                className='mr-2 mt-1'
                            />
                            <label className='text-sm'>
                                By creating an account, you agree to our <a href='/terms' className='text-[#4c1f8e] underline hover:text-[#6229b3]'>Terms of Service</a> and <a href='/privacy' className='text-[#4c1f8e] underline hover:text-[#6229b3]'>Privacy Policy</a>.
                            </label>
                        </div>
                        {errors.terms && <p className='text-red-500 text-sm'>{errors.terms.message}</p>}
                        <button
                            type='submit'
                            className='w-full bg-[#8236ec] max-w-96 text-white py-2 rounded hover:bg-[#6229b3]'
                        >
                            Sign Up
                        </button>
                    </form>
                    <p className='text-center text-sm text-gray-500 mt-4'>
                        Already have an account?{' '}
                        <a href='/sign-in' className='text-[#8236ec] underline hover:text-[#6229b3]'>
                            Sign in here
                        </a>.
                    </p>
                    <hr className='my-4 border-gray-300' />
                    <div className='mt-4 text-center text-sm text-gray-500'>
                        <Oauth />
                    </div>
                    <div className='flex items-center justify-center mt-6'>
                        <RiFirebaseFill className='text-gray-500 text-2xl mr-2' />
                        <p className='text-gray-500 text-sm'>Powered by Firebase</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUp;
