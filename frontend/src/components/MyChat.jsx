import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ChatState } from "../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChat = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast.error("Error in loading the chat");
    }
  };

  useEffect(() => {
    const loggedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(loggedUserInfo);
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      className={`bg-white rounded p-3 
      w-full sm:w-[40%] md:w-[30%] h-full 
      ${selectedChat ? "hidden sm:block" : "block"}`}
    >
      <div className="flex justify-between items-center mb-3">
        <h5 className="m-0 text-lg font-semibold">My Chats</h5>
        <GroupChatModal>
          <button className="btn btn-outline-primary btn-sm">
            New Group +
          </button>
        </GroupChatModal>
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        {chats ? (
          chats.map((chat) => {
            const senderName = !chat.isGroupChat
              ? getSender(loggedUser, chat.users)
              : chat.chatName;

            return (
              <button
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full text-start p-2 mb-2 rounded transition-all
                  ${
                    selectedChat === chat
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {senderName}
              </button>
            );
          })
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChat;
