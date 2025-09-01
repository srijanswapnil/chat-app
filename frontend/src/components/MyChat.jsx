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

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (name) => {
    if (!name) return "bg-gray-500";
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-xl
      w-full h-full flex flex-col overflow-hidden shadow-lg
      ${selectedChat ? "hidden sm:flex" : "flex"}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800">
        <h2 className="text-xl font-bold text-white">
          My Chats
        </h2>
        <GroupChatModal>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Group
          </button>
        </GroupChatModal>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-gray-800">
        {chats ? (
          chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No chats yet</h3>
              <p className="text-gray-400 text-sm">Start a conversation or create a group chat</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {chats.map((chat) => {
                const senderName = !chat.isGroupChat
                  ? getSender(user, chat.users)
                  : chat.chatName;
                const isSelected = selectedChat?._id === chat._id;

                return (
                  <button
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full text-left p-4 transition-all duration-200 hover:bg-gray-700 focus:outline-none focus:bg-gray-700
                      ${isSelected 
                        ? "bg-blue-900/30 border-r-4 border-blue-500" 
                        : "bg-gray-800"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm ${getAvatarColor(senderName)}`}>
                        {getInitials(senderName)}
                      </div>
                      
                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold truncate text-base ${isSelected ? "text-blue-300" : "text-white"}`}>
                            {senderName}
                          </h3>
                          {chat.latestMessage && (
                            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                              {new Date(chat.latestMessage.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            {chat.isGroupChat && (
                              <p className="text-xs text-gray-400 mb-1">
                                {chat.users?.length} {chat.users?.length === 1 ? 'member' : 'members'}
                              </p>
                            )}
                            {chat.latestMessage ? (
                              <p className="text-sm text-gray-300 truncate">
                                <span className="text-gray-400">
                                  {chat.latestMessage.sender._id === user._id ? "You: " : `${chat.latestMessage.sender.name}: `}
                                </span>
                                {chat.latestMessage.content}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No messages yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <ChatLoading />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChat;