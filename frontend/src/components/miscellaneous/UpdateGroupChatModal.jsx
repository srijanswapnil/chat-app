import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import axios from "../../axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${user.token}` }
  });

  const isAdmin = selectedChat?.groupAdmin?._id === user?._id;

  const handleRename = async () => {
    if (!groupChatName.trim()) return toast.error("Please enter a group name");

    try {
      setLoading(true);
      const { data } = await axios.put(`/api/chat/rename`, {
        chatId: selectedChat._id,
        chatName: groupChatName.trim(),
      }, getAuthConfig());

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toast.success("Group renamed successfully!");
      setGroupChatName("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to rename chat");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query.trim()) return setSearchResult([]);

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${encodeURIComponent(query)}`, getAuthConfig());
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find(u => u._id === userToAdd._id)) {
      return toast.error("User already in group!");
    }
    if (!isAdmin) return toast.error("Only admins can add members!");

    try {
      setLoading(true);
      const { data } = await axios.put(`/api/chat/groupadd`, {
        chatId: selectedChat._id,
        userId: userToAdd._id,
      }, getAuthConfig());

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toast.success(`${userToAdd.name} added!`);
      setSearch("");
      setSearchResult([]);
    } catch (error) {
      toast.error("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userToRemove) => {
    const isCurrentUser = userToRemove._id === user._id;
    if (!isAdmin && !isCurrentUser) return toast.error("Only admins can remove members!");

    const message = isCurrentUser ? "Leave this group?" : `Remove ${userToRemove.name}?`;
    if (!window.confirm(message)) return;

    try {
      setLoading(true);
      const { data } = await axios.put(`/api/chat/groupremove`, {
        chatId: selectedChat._id,
        userId: userToRemove._id,
      }, getAuthConfig());

      if (isCurrentUser) {
        setSelectedChat();
        setIsOpen(false);
        toast.success("Left the group");
      } else {
        setSelectedChat(data);
        toast.success(`${userToRemove.name} removed`);
      }
      
      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch (error) {
      toast.error("Failed to remove user");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setGroupChatName("");
    setSearch("");
    setSearchResult([]);
  };

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease-out;
        }
        
        .modal-content {
          animation: slideUp 0.3s ease-out;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 2px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        .avatar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .member-item:hover {
          transform: translateX(2px);
        }
      `}</style>

      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary text-white px-4 py-2 rounded-lg transition-all duration-200 font-sm text-sm"
      >
        ⚙️ Settings
      </button>

      {isOpen && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[80vh] overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-white">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-base truncate pr-2">
                  {selectedChat?.chatName}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white hover:bg-opacity-20 w-7 h-7 rounded-full flex items-center justify-center transition-all text-lg font-light"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto scrollbar-thin max-h-[60vh]">
              
              {/* Rename Section */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                    placeholder="New group name"
                    className="flex-1 px-3 text-black py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                    disabled={!isAdmin}
                  />
                  <button
                    onClick={handleRename}
                    disabled={loading || !isAdmin}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  >
                    {loading ? "•••" : "✓"}
                  </button>
                </div>
              </div>

              {/* Members */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Members ({selectedChat?.users?.length})
                </h3>
                <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin">
                  {selectedChat?.users?.map((u) => (
                    <div key={u._id} className="member-item flex items-center justify-between p-2 bg-gray-50 rounded-lg transition-all duration-200">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="avatar w-8 h-8 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {u.name} {u._id === user._id && "(You)"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {selectedChat.groupAdmin._id === u._id && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">Admin</span>
                        )}
                        {(isAdmin || u._id === user._id) && (
                          <button
                            onClick={() => handleRemove(u)}
                            disabled={loading}
                            className="text-red-500 hover:bg-red-50 text-xs px-2 py-1 rounded transition-all"
                          >
                            {u._id === user._id ? "Leave" : "×"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Members (Admin Only) */}
              {isAdmin && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Add Members</h3>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full px-3 py-2 border text-black border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm mb-2"
                  />
                  
                  {loading && search && (
                    <div className="text-center text-gray-500 py-2 text-sm">Searching...</div>
                  )}
                  
                  {searchResult.length > 0 && (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin">
                      {searchResult.slice(0, 3).map((searchUser) => (
                        <div key={searchUser._id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                              {searchUser.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-900 truncate">{searchUser.name}</span>
                          </div>
                          <button
                            onClick={() => handleAddUser(searchUser)}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-lg transition-all"
                          >
                            +
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 flex justify-between gap-2 border-t">
              <button
                onClick={() => handleRemove(user)}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Leave
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModal;