import React from 'react';
import ThemeSwitch from './ThemeSwitch';
import useTheme from '../hooks/useTheme';
import { Link } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import useUser from '../hooks/useUser.js';
import useIsLargeScreen from '../hooks/useIsLargeScreen.js';

const UtilityHeader = ({ backDisable, sticky, profile }) => {
    const { theme } = useTheme();
    const { user: userData } = useUser();
    const userProfile = userData?.data?.avatar?.url;
    const activeClass = "border-r-1 pr-3 border-[#a15ef3]/50 dark:border-[#4c1f8e]/60";
    const isLarge = useIsLargeScreen();
    return (
        <div className={`flex shadow-lg justify-between items-center width-full bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-gray-50/10 dark:from-10% dark:to-white/1 dark:border-t-1 border-gray-200/60 z-9 dark:backdrop-blur-md rounded-full px-3 py-1 mb-10 ${sticky ? 'sticky top-1' : ''}`}>
            {!backDisable && <Link to={'/'} className='text-2xl bg-gray-100 hover:bg-gray-400/40 dark:bg-[#4c1f8e]/20 dark:hover:bg-[#8236ec]/20 p-2 rounded-full'> <IoIosArrowRoundBack /> </Link>}
            <div className='flex items-center justify-end gap-5'>
                <ThemeSwitch />
                {isLarge && <Link to="/" className={profile && activeClass}>
                    <img src={theme === 'dark' ? "/todoshi-branding-light.png" : "/todoshi-branding-dark.png"} alt="logo" className='h-10' />
                </Link>}

                {profile && (userProfile ? <Link to={`/dashboard`}>
                    <img src={userProfile} alt="Profile" className='h-10 w-10 rounded-full' />
                </Link> : <div className='h-10 w-10 rounded-full bg-[#a15ef3]/70 dark:bg-[#4c1f8e]/60 flex justify-center items-center text-white'>G</div>)}
            </div>

        </div >
    );
}

export default UtilityHeader;
