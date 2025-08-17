import React, { useEffect, useRef, useState } from 'react';

/**
 * TimedButton Component
 * 
 * A button that becomes disabled for a specified amount of time after being clicked.
 * Displays a countdown timer showing the remaining time until it becomes active again.
 * 
 * @param {string} className - CSS classes to apply to the button
 * @param {function} onClick - Function to execute when the button is clicked
 * @param {number} time - Time in milliseconds that the button should remain disabled
 * @param {ReactNode} children - Content to display inside the button
 * @param {string} type - HTML button type (e.g., 'button', 'submit')
 */
const TimedButton = ({ className, onClick, time, children, type }) => {
    // Reference to the timer interval for cleanup
    let timer = useRef(null);
    // State to track if the button is in disabled state
    const [active, setActive] = useState(false);
    // State to track the remaining time in seconds
    const [remainingTime, setRemainingTime] = useState(0);

    /**
     * Handles button click event:
     * 1. If button is already active (disabled), do nothing
     * 2. Execute the provided onClick handler
     * 3. Start the countdown timer
     * 4. Disable the button for the specified duration
     */
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

    // Cleanup function to clear the timer when component unmounts
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
