import axios from "axios";
import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();
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

      const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
      console.log(data);

     
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
      const { data } = await axios.post("http://localhost:5000/api/chat", { userId }, config);

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
      <div className="bg-gray-800 text-white flex items-center justify-between py-4 px-6 border-b border-gray-600 shadow-md">
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search users to chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            onClick={() => setDrawerOpen(true)}
          />
        </div>

        <div className="text-3xl font-extrabold tracking-wide">CHAT APP</div>

        <div className="flex items-center gap-6">
          <FaBell
            size={24}
            className="cursor-pointer hover:text-amber-500 transition duration-300"
          />

          <div className="dropdown relative">
            <button
              className="flex btn btn-secondary dropdown-toggle bg-transparent border-none"
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
                className="w-10 h-10 rounded-full border-2 border-gray-500 cursor-pointer"
              />
            </button>

            <ul className="dropdown-menu dropdown-menu-end bg-gray-800 text-white shadow-lg border border-gray-700">
              <li>
                <button
                  className="dropdown-item px-4 py-2 hover:bg-gray-700 w-full text-left"
                  onClick={() => setProfileOpen(true)}
                >
                  My Profile
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item px-4 py-2 text-red-400 hover:bg-gray-700 w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {profileOpen && (
        <ProfileModal user={user} onClose={() => setProfileOpen(false)} />
      )}

      {/* Search Drawer */}
      {drawerOpen && (
        <div className="fixed top-0 left-0 w-80 h-full bg-gray-900 text-white shadow-lg z-50 p-4 transition-transform duration-300">
          <div className="flex flex-col justify-between items-center mb-4">
            <div className="flex">
              <p className="mx-5">Search User</p>
              <div className="mx-3">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-red-400 hover:text-red-500 text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="flex">
              <input
                type="search"
                placeholder="Search users to chat"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-600 mx-2 text-white placeholder-gray-400 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
              <button
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 border-2 border-amber-300 transition"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {loading ? (
              <ChatLoading />
            ) : searchResult.length > 0 ? (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            ) : (
              <span>No user found</span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SideDrawer;
