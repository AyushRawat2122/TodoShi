import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { RiFirebaseFill } from 'react-icons/ri'; // Import Firebase icon

const SignUp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className='h-screen flex items-center justify-center'>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                className='bg-white p-8 rounded-lg shadow-lg w-96'
            >
                <h2 className='text-2xl font-bold mb-4'>Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div>
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
                            className='w-full p-2 border rounded'
                        />
                        {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-1'>Password</label>
                        <input
                            type='password'
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters long'
                                }
                            })}
                            className='w-full p-2 border rounded'
                        />
                        {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
                    </div>
                    <div className='flex items-start'>
                        <input
                            type='checkbox'
                            {...register('terms', { required: 'You must agree to the terms and conditions' })}
                            className='mr-2 mt-1'
                        />
                        <label className='text-sm'>
                            By creating an account, you agree to our <a href='/terms' className='text-blue-500 underline'>Terms of Service</a> and <a href='/privacy' className='text-blue-500 underline'>Privacy Policy</a>.
                        </label>
                    </div>
                    {errors.terms && <p className='text-red-500 text-sm'>{errors.terms.message}</p>}
                    <button
                        type='submit'
                        className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
                    >
                        Sign Up
                    </button>
                </form>
                <div className='flex items-center justify-center mt-6'>
                    <RiFirebaseFill className='text-gray-500 text-2xl mr-2' />
                    <p className='text-gray-500 text-sm'>Powered by Firebase</p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUp;
