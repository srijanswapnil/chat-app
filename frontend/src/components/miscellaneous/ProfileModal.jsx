import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileModal = ({ user, onClose }) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
          className="relative bg-gradient-to-br from-gray-800/60 to-gray-700/60 backdrop-blur-lg p-6 rounded-2xl border border-gray-500 shadow-xl w-80 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            className="absolute top-2 right-3 text-xl text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✖
          </button>

          <div className="flex flex-col items-center">
            {/* Profile Image with enhanced animation */}
            <motion.div 
              className="relative"
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <img
                src={user.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                alt="profile"
                className="w-24 h-24 rounded-full border-4 border-transparent object-cover"
                style={{
                  boxShadow: '0 0 15px 3px rgba(255, 165, 0, 0.7)',
                }}
              />
              {/* Online indicator (optional) */}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </motion.div>

            {/* User Info with staggered animation */}
            <motion.div 
              className="text-center mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-400 mt-1">{user.email}</p>
            </motion.div>

            {/* Additional user info (optional) */}
            <motion.div 
              className="mt-6 w-full space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileModal;