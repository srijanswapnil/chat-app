import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to rename chat");
      setRenameLoading(false);
    }

    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${query}`,
        config
      );
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to search user");
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add user");
      setLoading(false);
    }

    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove user");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded "
      >
        Update Group
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 w-[90%] md:w-[50%] p-6 rounded shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-white text-xl"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">
              {selectedChat.chatName}
            </h2>

            <div className="flex flex-wrap mb-4">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </div>

            <input
              type="text"
              placeholder="Rename Group"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />

            <button
              onClick={handleRename}
              className="bg-green-500 text-white px-4 py-2 rounded w-full mb-4"
              disabled={renameLoading}
            >
              {renameLoading ? "Renaming..." : "Rename"}
            </button>

            <input
              type="text"
              placeholder="Add User to group"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />

            {loading ? (
              <div className="text-white">Loading...</div>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModal;
