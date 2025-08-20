import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { loadingAnimation } from '../utils/lottie';
const LoadingPage = () => {
    return (
        <div className='relative flex justify-center items-center h-full w-full z-999'>
            <DotLottieReact
                src={loadingAnimation}
                autoplay
                loop
                style={{ width: '40%', height: '40%' }}
            />
        </div>
    );
};

export default LoadingPage;
