import React from 'react';
import { PiSpinnerLight } from "react-icons/pi";

const Loader = ({ className }) => {
    return (
        <PiSpinnerLight className={`animate-spin text-blue-500 dark:text-blue-300 ${className}`} />
    );
};

export default Loader;
