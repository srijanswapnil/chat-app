import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat } = ChatState();
  const [isModalOpen, setIsModalOpen] = useState(false);  // for Modal open/close

  return (
    <div className="flex flex-col w-full h-full">
      {selectedChat ? (
        <>
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900">
            <h2 className="text-xl md:text-2xl font-semibold text-white ">
              {!selectedChat.isGroupChat
                ? getSender(user, selectedChat.users)
                : selectedChat.chatName.toUpperCase()}
                {<UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
            </h2>

            {/* View Profile Button */}
            {!selectedChat.isGroupChat && (
              <>
                <button
                  className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition duration-200"
                  onClick={() => setIsModalOpen(true)}
                >
                  View Profile
                </button>

                {isModalOpen && (
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                    onClose={() => setIsModalOpen(false)}
                  />
                )}
              </>
            )}
          </div>

          {/* Chat Body */}

        </>
      ) : (
        <div className="flex items-center justify-center h-full text-xl font-medium text-gray-400">
          Click on a user to start Chatting
        </div>
      )}
    </div>
  );
};

export default SingleChat;
