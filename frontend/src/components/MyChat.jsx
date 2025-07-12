import { useEffect } from "react";
import axios from "../axios";
import { toast } from "react-hot-toast";
import { ChatState } from "../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChat = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchChats = async (authToken) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Error in loading the chat");
    }
  };

  useEffect(() => {
    const loggedUserInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (loggedUserInfo?.token) {
      fetchChats(loggedUserInfo.token);
    }
  }, [fetchAgain]);

  return (
    <div
      className={`bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl
      w-full  h-full relative overflow-hidden
      ${selectedChat ? "hidden sm:block" : "block"}`}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none rounded-2xl"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700/50">
          <h5 className="m-0 text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            My Chats
          </h5>
          <GroupChatModal>
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm">
              New Group +
            </button>
          </GroupChatModal>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-gray-500/50">
          {chats ? (
            <div className="space-y-2">
              {chats.map((chat) => {
                const senderName = !chat.isGroupChat
                  ? getSender(user, chat.users)
                  : chat.chatName;

                return (
                  <button
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 group relative overflow-hidden
                      ${
                        selectedChat === chat
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg"
                          : "bg-gray-800/40 hover:bg-gray-700/60 text-gray-300 hover:text-white border border-gray-700/30 hover:border-gray-600/50"
                      }`}
                  >
                    {/* Subtle glow effect for selected chat */}
                    {selectedChat === chat && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"></div>
                    )}
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Avatar placeholder */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                          ${selectedChat === chat 
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                            : "bg-gray-700 text-gray-300 group-hover:bg-gray-600"
                          }`}>
                          {senderName?.charAt(0)?.toUpperCase()}
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium truncate">
                            {senderName}
                          </div>
                          {chat.isGroupChat && (
                            <div className="text-xs text-gray-400 mt-1">
                              {chat.users?.length} members
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Online indicator for individual chats */}
                      {!chat.isGroupChat && (
                        <div className="w-3 h-3 bg-green-500 rounded-full opacity-70"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <ChatLoading />
            </div>
          )}
        </div>
      </div>
      
      <style jsx="true">{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-track-gray-800\\/50::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        
        .scrollbar-thumb-gray-600\\/50::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
          border-radius: 10px;
        }
        
        .hover\\:scrollbar-thumb-gray-500\\/50::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.5);
        }
      `}</style>
    </div>
  );
};

export default MyChat;