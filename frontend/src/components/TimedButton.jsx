import React, { useEffect, useRef, useState } from 'react';

const TimedButton = ({ className, onClick, time, children, type }) => {
    let timer = useRef(null);
    const [active, setActive] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);

    const handleClick = (e) => {
        if (active) return;
        if (onClick) { onClick(e); }
        setActive(true);
        setRemainingTime(time / 1000); // Convert milliseconds to seconds
        timer.current = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer.current);
                    setActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (timer.current) { clearInterval(timer.current); }
        };
    }, []);

    return (
        <button
            type={type}
            className={`${className} ${active ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleClick}
            disabled={active}
        >
            {children}
            {active && <span className='ml-2 text-sm text-white'>({remainingTime}s)</span>}
        </button>
    );
};

export default TimedButton;
