import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { FaSpinner } from "react-icons/fa";
import axios from "../axios";
import toast from "react-hot-toast";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, notification, setNotification } = ChatState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!newMessage.trim()) return;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/message",
        { content: newMessage, chatId: selectedChat?._id },
        config
      );

      socket.emit("newMessage", data);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      toast.error("Error sending the message");
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("Connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat?._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Error fetching messages");
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const handleMessage = (newMessageReceived) => {
      setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
    };
  
    const handleNotification = (newMessageReceived) => {
      if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
        setNotification((prev) => [newMessageReceived, ...prev]);
        setFetchAgain((prev) => !prev);
      }
    };
  
    socket.on("message received", handleMessage);
    socket.on("notification received", handleNotification);
  
    return () => {
      socket.off("message received", handleMessage);
      socket.off("notification received", handleNotification);
    };
  }, [selectedChat, socket]);
  

  return (
    <div className="flex flex-col w-full h-full">
      {selectedChat ? (
        <>
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white truncate max-w-[70%]">
              {!selectedChat.isGroupChat
                ? getSender(user, selectedChat.users)
                : selectedChat.chatName.toUpperCase()}
              {selectedChat.isGroupChat && (
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              )}
            </h2>

            {!selectedChat.isGroupChat && (
              <>
                <button
                  className="text-xs sm:text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition duration-200"
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
          {loading ? (
            <FaSpinner className="size-7 m-auto animate-spin w-16 h-16 text-white mt-10" />
          ) : (
            <div className="flex-1 px-4 py-2 overflow-y-auto bg-gray-800 text-white custom-scrollbar">
              <ScrollableChat messages={messages} />
            </div>
          )}

          {/* Message Input */}
          <form
            className="flex px-4 py-3 gap-2 border-t border-gray-700 bg-gray-900"
            onSubmit={sendMessage}
          >
            {isTyping ? <div>Typing...</div> : <></>}
            <input
              type="text"
              placeholder="Enter message..."
              value={newMessage}
              onChange={typingHandler}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  sendMessage(e);
                }
              }}
              className="flex-1 px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Send
            </button>
          </form>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-base sm:text-lg md:text-xl font-medium text-gray-400 text-center px-4">
          Click on a user to start Chatting
        </div>
      )}
    </div>
  );
};

export default SingleChat;
