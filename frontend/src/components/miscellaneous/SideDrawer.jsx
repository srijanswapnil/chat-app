import axios from "axios";
import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false); // Notification dropdown toggle

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    toast.success("Logged Out Successfully 🚀");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      toast.error("Please enter something to search!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load search results");
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/chat",
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      setDrawerOpen(false);
    } catch (error) {
      toast.error("Error fetching the chat");
      setLoadingChat(false);
    }
  };

  return (
    <>
      <div className="bg-gray-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-6 border-b border-gray-600 shadow-md">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="search"
            placeholder="Search users to chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto bg-gray-900 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-300"
            onClick={() => setDrawerOpen(true)}
          />
        </div>

        {/* App Title */}
        <div className="text-2xl sm:text-3xl font-extrabold tracking-wide text-center sm:text-left">
          CHAT APP
        </div>

        {/* Notification and Profile */}
        <div className="flex items-center gap-4 sm:gap-6 justify-end">
          <div className="relative">
            <FaBell
              size={24}
              className="cursor-pointer hover:text-amber-500 transition duration-300"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)} // Toggle notification dropdown
            />

            {/* Notification badge */}
            {notification.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {notification.length}
              </span>
            )}

            {/* Notification Dropdown */}
            {showNotifDropdown && notification.length > 0 && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 text-white rounded-md shadow-lg border border-gray-600 z-50">
                {notification.map((notif) => (
                  <div
                    key={notif._id}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm border-b border-gray-700 last:border-b-0"
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New message in ${notif.chat.chatName}`
                      : `New message from ${getSender(user,notif.chat.users)} `}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown relative">
            <button
              className="flex items-center focus:outline-none"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={
                  user.pic ||
                  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-500 cursor-pointer object-cover"
              />
            </button>

            <ul className="dropdown-menu absolute right-0 mt-2 bg-gray-800 text-white shadow-lg border border-gray-700 rounded-md w-40 z-50">
              <li>
                <button
                  className=" text-black w-full text-left px-4 py-2 hover:bg-gray-700 rounded-t-md"
                  onClick={() => setProfileOpen(true)}
                >
                  My Profile
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-b-md"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search Drawer */}
      {drawerOpen && (
        <div className="fixed top-0 left-0 w-full sm:w-80 h-full bg-gray-900 text-white shadow-lg z-50 p-4 transition-transform duration-300 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold">Search User</p>
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-red-400 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-amber-500 px-4 py-2 rounded-md hover:bg-amber-600 transition"
            >
              Go
            </button>
          </div>

          {loading ? (
            <ChatLoading />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}

          {loadingChat && <ChatLoading />}
        </div>
      )}
    </>
  );
};

export default SideDrawer;

