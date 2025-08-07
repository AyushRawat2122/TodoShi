import React, { useState } from 'react';
import { signInWithGitHub, signInWithGoogle } from "../firebase/auth.js";
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const Oauth = () => {
    const [loading, setLoading] = useState(false);
    const handleSignInWithGitHub = async (params) => {
        if(loading) return; // Prevent multiple clicks
        try {
            setLoading(true);
            localStorage.setItem("lastSignInMethod", "oauth");
            await signInWithGitHub();
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            localStorage.removeItem("lastSignInMethod");
            console.error("GitHub Sign-In Error:", errorCode, errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const handleSignInWithGoogle = async (params) => {
        if(loading) return; // Prevent multiple clicks
        try {
            setLoading(true);
            localStorage.setItem("lastSignInMethod", "oauth");
            await signInWithGoogle();
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            localStorage.removeItemItem("lastSignInMethod");
            console.error("Google Sign-In Error:", errorCode, errorMessage);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div>
            <span className='text-gray-600 '>or continue with</span>
            <div className='flex flex-wrap justify-center gap-5 py-2.5'>
                <button
                    onClick={handleSignInWithGoogle}
                    className='flex items-center w-[40%] justify-center bg-gray-100 text-gray-800 py-2 px-5 rounded hover:bg-gray-200 gap-2 border border-gray-300'
                >
                    <FcGoogle className='text-xl flex-shrink-0' />
                    Google
                </button>
                <button
                    onClick={handleSignInWithGitHub}
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
