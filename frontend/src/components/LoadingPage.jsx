import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { loadingAnimation } from '../utils/lottie';
import useTheme from '../hooks/useTheme';

const LoadingPage = () => {
    const { isDark } = useTheme();
    console.log("loading.......");
    return (
        <div
            className={`relative flex justify-center items-center ${isDark ? 'bg-[#0c0a1a]' : 'bg-white'} h-full w-full z-999`}
        >
            <DotLottieReact
                src={loadingAnimation}
                autoplay
                loop
                style={{ width: '40%', height: '40%' }}
                className='bg-transparent'
            />
        </div>
    );
};

export default LoadingPage;
