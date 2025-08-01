import React from 'react';
import { useEffect, useRef, useState } from 'react';

const TimedButton = ({ className, onClick, time, children, type }) => {
    let timer = useRef(null);
    const [active, setActive] = useState(false);

    const handleClick = (e) => {
        if (active) return;
        if (onClick) { onClick(e); }
        setActive(true);
        timer.current = setTimeout(() => {
            setActive(false);
        }, time);
    };

    useEffect(() => {
        return () => {
            if (timer.current) { clearTimeout(timer.current); }
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
        </button>
    );
};

export default TimedButton;
