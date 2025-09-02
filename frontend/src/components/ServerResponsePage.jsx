import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { fallingGuyDark, fallingGuyLight } from '../utils/lottie';
import { useNavigate } from 'react-router-dom';
import useIsLargeScreen from '../hooks/useIsLargeScreen';
import useTheme from '../hooks/useTheme';

const ServerResponsePage = () => {
    const isLarge = useIsLargeScreen();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    return (
        <div className='flex relative max-sm:flex-col sm:justify-center sm:items-center  h-full w-full z-999'>
            <DotLottieReact
                src={isDark ? fallingGuyLight : fallingGuyDark}
                autoplay
                loop
                className={`${isDark ? "opacity-70" :""} max-sm:w-[100%] max-sm:h-[40%]  w-[50%] h-[60%]`}
            />
            <div
                className={`flex flex-col px-3 sm:px-4 gap-3 max-sm:items-center max-sm:text-center 
                ${isLarge ? '-translate-x-25' : ''}`}
            >
                <div>
                    <h1 className='text-8xl font-[1000] text-[#4c1f8e]'>500!</h1>
                    <p className='text-3xl -translate-y-2 font-bold text-[#4c1f8e]'>SERVER ERROR</p>
                </div>
                <p className='text-xl font-semibold leading-snug'>
                    Something went wrong on our end. <br /> Try the following:
                </p>
                <ul className='sm:list-disc text-lg pl-5'>
                    <li>Check your network connection.</li>
                    <li>Try refreshing the page or coming back later.</li>
                    <li>The server may be unavailable or under maintenance.</li>
                </ul>
                <div className='flex gap-2'>
                    <button
                        onClick={() => window.location.reload()}
                        className='px-5 text-xl -skew-x-10 bg-[#6229b3] text-white py-2 rounded border max-w-[120px] hover:bg-[#5a24a8] focus:outline-none focus:ring-2 focus:ring-[#4c1f8e]/40 active:scale-[0.99] transition'
                    >
                        Reload
                    </button>
                    <button
                        onClick={() => (navigate('/', { replace: true }))}
                        className='px-5 text-xl -skew-x-10 py-2 rounded border max-w-[120px] text-[#4c1f8e] border-[#4c1f8e] hover:bg-[#4c1f8e] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#4c1f8e]/40 active:scale-[0.99] transition'
                    >
                        Home
                    </button>
                </div>
            </div>
        </div >
    );
}

export default ServerResponsePage;
