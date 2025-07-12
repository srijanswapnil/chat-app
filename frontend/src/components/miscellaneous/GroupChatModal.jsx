import React, { useState } from "react";
import axios from "../../axios";
import toast from "react-hot-toast";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
    } catch {
      toast.error("Failed to load search results");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      toast.error("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
  };

  const handleReset = () => {
    setIsOpen(false);
    setGroupChatName("");
    setSelectedUsers([]);
    setSearchQuery("");
    setSearchResult([]);
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      toast.success("Group Chat Created Successfully");
      handleReset();
    } catch {
      toast.error("Failed to create group chat");
    }
  };

  return (
    <>
      {/* Trigger */}
      <span
        onClick={() => setIsOpen(true)}
        className="cursor-pointer hover:opacity-80"
      >
        {children}
      </span>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
          <div className="bg-white rounded-xl shadow-2xl w-[95%] sm:w-[90%] md:w-[400px] lg:w-[450px] p-6 relative">
            {/* Close Button */}
            <button
              onClick={handleReset}
              className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl font-bold"
            >
              ×
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-center mb-5 text-gray-800">
              Create Group Chat
            </h2>

            {/* Group Name */}
            <input
              type="text"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              placeholder="Group Name"
              className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />

            {/* Search Users */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Users"
              className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </div>
            )}

            {/* Search Result */}
            <div className="mb-4 max-h-48 overflow-y-auto">
              {loading ? (
                <div className="text-center text-gray-500">Searching...</div>
              ) : (
                searchResult?.slice(0, 4).map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;
