import React from 'react';
import { motion } from 'framer-motion';

const ProfileModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-20  bg-opacity-40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="relative bg-gradient-to-br from-gray-800/60 to-gray-700/60 backdrop-blur-lg p-6 rounded-2xl border border-gray-500 shadow-xl w-80 text-white"
      >
        <button
          className="absolute top-2 right-3 text-xl text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={user.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
              alt="profile"
              className="w-24 h-24 rounded-full border-4 border-transparent animate-pulse"
              style={{
                boxShadow: '0 0 15px 3px rgba(255, 165, 0, 0.7)',
              }}
            />
          </div>

          <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;

