import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
const Loader = () => {
    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <DotLottieReact
                autoplay
                loop
                src='/path/to/loader.lottie'
                style={{ width: '100px', height: '100px' }}
            />
        </div>
    );
}

export default Loader;
