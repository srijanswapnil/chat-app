import React, { useState, useEffect, useRef } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { FaSpinner } from "react-icons/fa";
import axios from "../axios";
import toast from "react-hot-toast";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Use useRef to maintain socket instance across renders
  const socketRef = useRef(null);
  const selectedChatCompareRef = useRef();

  // ================= Send Message ==================
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

      if (socketRef.current && socketConnected) {
        socketRef.current.emit("newMessage", data);
      }
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      toast.error("Error sending the message");
      console.error("Send message error:", error);
    }
  };

  // ================= Socket Setup ==================
  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    socketRef.current = io(ENDPOINT);

    // ✅ CRITICAL: Setup user in their personal room
    socketRef.current.emit("setup", user);

    socketRef.current.on("connected", () => {
      console.log("Socket connected successfully");
      setSocketConnected(true);
    });

    socketRef.current.on("typing", () => setIsTyping(true));
    socketRef.current.on("stop typing", () => setIsTyping(false));

    // Handle connection errors
    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setSocketConnected(false);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocketConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connected");
        socketRef.current.off("typing");
        socketRef.current.off("stop typing");
        socketRef.current.off("connect_error");
        socketRef.current.off("disconnect");
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // ================= Typing Handler ==================
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected || !selectedChat?._id || !socketRef.current) return;

    if (!typing) {
      setTyping(true);
      socketRef.current.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        if (socketRef.current && socketConnected) {
          socketRef.current.emit("stop typing", selectedChat._id);
        }
        setTyping(false);
      }
    }, timerLength);
  };

  // ================= Fetch Messages ==================
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
      
      if (socketRef.current && socketConnected) {
        socketRef.current.emit("join chat", selectedChat._id);
      }
    } catch (error) {
      toast.error("Error fetching messages");
      console.error("Fetch messages error:", error);
      setLoading(false);
    }
  };

  // Update selected chat comparison when selectedChat changes
  useEffect(() => {
    selectedChatCompareRef.current = selectedChat;
    fetchMessages();
  }, [selectedChat]);

  // ================= Handle Incoming Messages ==================
  useEffect(() => {
    if (!socketRef.current) return;

    const handleMessage = (newMessageReceived) => {
      console.log("Message received:", newMessageReceived);
      
      // Check if message is for current chat or should be a notification
      if (
        !selectedChatCompareRef.current ||
        selectedChatCompareRef.current._id !== newMessageReceived.chat._id
      ) {
        console.log("Adding notification for message:", newMessageReceived);
        // Message is for a different chat - add to notifications
        setNotification((prev) => {
          // Avoid duplicate notifications
          const isDuplicate = prev.some(notif => notif._id === newMessageReceived._id);
          if (isDuplicate) return prev;
          return [newMessageReceived, ...prev];
        });
        setFetchAgain((prev) => !prev);
      } else {
        console.log("Adding message to current chat:", newMessageReceived);
        // Message is for current chat - add to messages
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    };

    // Handle direct notification events (alternative to message received)
    const handleNotification = (newMessageReceived) => {
      console.log("Direct notification received:", newMessageReceived);
      setNotification((prev) => {
        const isDuplicate = prev.some(notif => notif._id === newMessageReceived._id);
        if (isDuplicate) return prev;
        return [newMessageReceived, ...prev];
      });
      setFetchAgain((prev) => !prev);
    };

    socketRef.current.on("message received", handleMessage);
    socketRef.current.on("notification received", handleNotification);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off("message received", handleMessage);
        socketRef.current.off("notification received", handleNotification);
      }
    };
  }, [setNotification, setFetchAgain]); // Remove selectedChat from dependencies

  // Debug: Log notification state changes
  useEffect(() => {
    console.log("Notifications updated:", notification);
  }, [notification]);

  // ================= UI ==================
  return (
    <div className="flex flex-col w-full h-full">
      {selectedChat ? (
        <>
          {/* Socket Status Indicator (for debugging) */}
          <div className="text-xs text-gray-500 px-4 py-1">
            Socket: {socketConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>

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
            {isTyping ? <div className="text-sm text-gray-400">Someone is typing...</div> : null}
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
              disabled={!socketConnected}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
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