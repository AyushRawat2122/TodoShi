import React from 'react';
import { PiSpinnerLight } from "react-icons/pi";

const Loader = ({ className }) => {
    return (
        <PiSpinnerLight className={`animate-spin dark:text-[#c2a7fb] text-[#4c1f8e] ${className}`} />
    );
};

export default Loader;
