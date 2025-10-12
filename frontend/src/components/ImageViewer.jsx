import React, { useState } from 'react';
import { motion } from "framer-motion";
import { FaSearchPlus, FaSearchMinus, FaUndo, FaRedo, FaDownload, FaExpand, FaTimes } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';

const ImageViewer = ({ imageUrl, onClose }) => {
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    
    // Media queries
    const isMobile = useMediaQuery({ maxWidth: 639 }); // Mobile (Android)
    const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 767 }); // Tablet
    const isDesktop = useMediaQuery({ minWidth: 768 }); // Desktop

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'todoshi-image.jpg';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const handleReset = () => {
        setScale(1);
        setRotate(0);
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-white dark:bg-[#0c0a1a]">
            {/* Toolbar - Fixed at top */}
            <div className="flex-shrink-0 border-b border-gray-200 dark:border-[#2a283a] bg-white dark:bg-[#13111d] px-2 sm:px-4 py-3">
                <div className="flex gap-1 sm:gap-2 items-center justify-between">
                    {/* Left side - Controls */}
                    <div className="flex gap-1 sm:gap-2 items-center flex-wrap">
                        {/* Zoom In */}
                        <button
                            onClick={() => setScale((s) => Math.min(s + 0.2, 3))}
                            className={`flex items-center gap-2 ${isMobile ? 'px-2' : isTablet ? 'px-2' : 'px-4'} py-2 bg-white dark:bg-[#1a1825] text-gray-700 dark:text-purple-200 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a283a] transition-colors border border-gray-200 dark:border-[#2a283a] shadow-sm`}
                            title="Zoom In"
                        >
                            <FaSearchPlus className="text-[#6229b3] dark:text-[#c2a7fb]" />
                            {isDesktop && <span className="text-sm font-medium">Zoom In</span>}
                        </button>

                        {/* Zoom Out */}
                        <button
                            onClick={() => setScale((s) => Math.max(s - 0.2, 0.2))}
                            className={`flex items-center gap-2 ${isMobile ? 'px-2' : isTablet ? 'px-2' : 'px-4'} py-2 bg-white dark:bg-[#1a1825] text-gray-700 dark:text-purple-200 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a283a] transition-colors border border-gray-200 dark:border-[#2a283a] shadow-sm`}
                            title="Zoom Out"
                        >
                            <FaSearchMinus className="text-[#6229b3] dark:text-[#c2a7fb]" />
                            {isDesktop && <span className="text-sm font-medium">Zoom Out</span>}
                        </button>

                        {/* Rotate Left */}
                        <button
                            onClick={() => setRotate((r) => (r - 90 + 360) % 360)}
                            className={`flex items-center gap-2 ${isMobile ? 'px-2' : isTablet ? 'px-2' : 'px-4'} py-2 bg-white dark:bg-[#1a1825] text-gray-700 dark:text-purple-200 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a283a] transition-colors border border-gray-200 dark:border-[#2a283a] shadow-sm`}
                            title="Rotate Left"
                        >
                            <FaUndo className="text-[#6229b3] dark:text-[#c2a7fb]" />
                            {isDesktop && <span className="text-sm font-medium">Rotate</span>}
                        </button>

                        {/* Rotate Right */}
                        <button
                            onClick={() => setRotate((r) => (r + 90) % 360)}
                            className={`flex items-center gap-2 ${isMobile ? 'px-2' : isTablet ? 'px-2' : 'px-4'} py-2 bg-white dark:bg-[#1a1825] text-gray-700 dark:text-purple-200 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a283a] transition-colors border border-gray-200 dark:border-[#2a283a] shadow-sm`}
                            title="Rotate Right"
                        >
                            <FaRedo className="text-[#6229b3] dark:text-[#c2a7fb]" />
                        </button>

                        {/* Scale Display */}
                        <div className="flex items-center gap-2 px-2 sm:px-3 md:px-4 py-2 bg-gray-50 dark:bg-[#1a1825] rounded-lg border border-gray-200 dark:border-[#2a283a]">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-purple-200">
                                {scale.toFixed(1)}x
                            </span>
                            <span className="text-gray-400 dark:text-purple-200/50">|</span>
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-purple-200">
                                {rotate}°
                            </span>
                        </div>

                        {/* Reset */}
                        <button
                            onClick={handleReset}
                            className={`flex items-center gap-2 ${isMobile ? 'px-2' : isTablet ? 'px-3' : 'px-4'} py-2 bg-white dark:bg-[#1a1825] text-gray-700 dark:text-purple-200 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a283a] transition-colors border border-gray-200 dark:border-[#2a283a] shadow-sm`}
                            title="Reset View"
                        >
                            <FaExpand className="text-[#6229b3] dark:text-[#c2a7fb]" />
                            {(isTablet || isDesktop) && <span className="text-sm font-medium">Reset</span>}
                        </button>

                        {/* Download */}
                        <button
                            onClick={handleDownload}
                            className={`flex items-center gap-2 ${isMobile ? 'px-2' : isTablet ? 'px-3' : 'px-4'} py-2 bg-gradient-to-r from-[#6229b3] to-[#4c1f8e] text-white rounded-lg hover:from-[#6229b3]/90 hover:to-[#4c1f8e]/90 transition-colors shadow-md`}
                            title="Download Image"
                        >
                            <FaDownload />
                            {(isTablet || isDesktop) && <span className="text-sm font-medium">Download</span>}
                        </button>
                    </div>

                    {/* Right side - Close Button */}
                    <button 
                        onClick={onClose}
                        className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-gray-700 hover:bg-gray-800 dark:bg-[#c2a7fb]/20 dark:hover:bg-[#c2a7fb]/30 dark:border dark:border-[#c2a7fb]/30 text-white dark:text-[#c2a7fb] rounded-full shadow-lg transition-colors"
                        title="Close Viewer"
                    >
                        <FaTimes className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Image Container - Scrollable */}
            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-[#0c0a1a] p-4">
                <div className="min-h-full flex items-center justify-center">
                    <motion.img
                        src={imageUrl}
                        alt="Preview"
                        className="rounded-lg shadow-2xl"
                        style={{
                            transform: `scale(${scale}) rotate(${rotate}deg)`,
                            transformOrigin: 'center',
                            transition: 'transform 0.3s ease-out',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>
        </div>
    );
}

export default ImageViewer;
