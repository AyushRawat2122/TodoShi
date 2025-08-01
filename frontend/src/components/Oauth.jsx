import React from 'react';
import { signInWithGitHub, signInWithGoogle } from "../firebase/auth.js";
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const Oauth = () => {
    return (
        <div>
            <span className='text-gray-600 '>or continue with</span>
            <div className='flex flex-wrap justify-center gap-5 py-2.5'>
                <button
                    onClick={signInWithGoogle}
                    className='flex items-center w-[40%] justify-center bg-gray-100 text-gray-800 py-2 px-5 rounded hover:bg-gray-200 gap-2 border border-gray-300'
                >
                    <FcGoogle className='text-xl flex-shrink-0' /> 
                    Google
                </button>
                <button
                    onClick={signInWithGitHub}
                    className='flex items-center w-[40%] justify-center bg-gray-800 text-white py-2 px-5 rounded hover:bg-gray-900 gap-2'
                >
                    <FaGithub className='text-xl flex-shrink-0' /> 
                    GitHub
                </button>
            </div>
        </div>
    );
};

export default Oauth;
