import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProject } from '../store/project';
import ImageViewer from './ImageViewer';

const GlobalImageViewer = () => {
  const { imageViewer, closeImageViewer } = useProject();

  return (
    <AnimatePresence>
      {imageViewer.isOpen && imageViewer.contextUrl && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Full Screen Image Viewer */}
          <motion.div 
            className="w-full h-full"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <ImageViewer imageUrl={imageViewer.contextUrl} onClose={closeImageViewer} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalImageViewer;
