import React, { useState } from 'react';
import { motion } from "framer-motion";


const ImageViewer = ({ imageUrl }) => {
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);

    return (
        <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-md">
            {/* Toolbar */}
            <div className="flex gap-2 items-center">
                {/* Zoom */}
                <button
                    onClick={() => setScale((s) => s + 0.2)}
                    className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
                >
                    🔍+
                </button>
                <button
                    onClick={() => setScale((s) => Math.max(s - 0.2, 0.2))}
                    className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
                >
                    🔍-
                </button>
                {/* Rotate */}
                <button
                    onClick={() => setRotate((r) => (r + 90) % 360)}
                    className="px-3 py-1 bg-green-200 rounded hover:bg-green-300"
                >
                    🔄 Rotate
                </button>
                {/* Download Image */}
                <a
                    href={imageUrl}
                    download="image.jpg"
                    className="px-3 py-1 bg-purple-200 rounded hover:bg-purple-300 text-purple-900 font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ⬇ Download Image
                </a>
            </div>
            {/* Image Viewer */}
            <motion.div
                className="border rounded bg-white shadow-inner p-2 flex justify-center items-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <img
                    src={imageUrl}
                    alt="Preview"
                    style={{
                        transform: `scale(${scale}) rotate(${rotate}deg)`,
                        transition: 'transform 0.2s',
                        maxWidth: '100%',
                        maxHeight: '60vh',
                    }}
                />
            </motion.div>
        </div>
    );
}

export default ImageViewer;
