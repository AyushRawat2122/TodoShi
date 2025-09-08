import React, { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { motion } from "framer-motion";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();


function PdfViewer({ fileUrl }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.2); // zoom level
    const [rotate, setRotate] = useState(0);

    const handleLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-md">
            {/* Toolbar */}
            <div className="flex gap-2 items-center">
                <button
                    onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    ⬅ Prev
                </button>

                <span className="text-sm font-medium">
                    Page {pageNumber} of {numPages || "?"}
                </span>

                <button
                    onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
                    disabled={pageNumber >= numPages}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Next ➡
                </button>

                {/* Zoom */}
                <button
                    onClick={() => setScale((s) => s + 0.2)}
                    className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
                >
                    🔍+
                </button>
                <button
                    onClick={() => setScale((s) => Math.max(s - 0.2, 0.6))}
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

                {/* Download PDF */}
                <a
                    href={fileUrl}
                    download="document.pdf"
                    className="px-3 py-1 bg-purple-200 rounded hover:bg-purple-300 text-purple-900 font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ⬇ Download PDF
                </a>
            </div>

            {/* PDF Viewer */}
            <motion.div
                className="border rounded bg-white shadow-inner p-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Document
                    file={fileUrl}
                    onLoadSuccess={handleLoadSuccess}
                    loading={<p className="text-gray-500">⏳ Loading PDF...</p>}
                    error={<p className="text-red-500">❌ Failed to load PDF</p>}
                >
                    <Page pageNumber={pageNumber} scale={scale} rotate={rotate} />
                </Document>
            </motion.div>
        </div>
    );
}

export default PdfViewer;