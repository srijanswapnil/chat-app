import React, { useState } from 'react';

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Button to open Modal */}
      <span onClick={() => setIsOpen(true)} style={{ cursor: "pointer" }}>
        {children}
      </span>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              X
            </button>

            <h2 className="text-lg font-semibold mb-4">Create Group Chat</h2>

            {/* Modal Content */}
            <div>
              {/* Add your form or functionality here */}
              <p>Group Chat Creation Form Goes Here...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;

