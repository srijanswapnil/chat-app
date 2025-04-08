import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ChatState } from "../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChat = () => {
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

    if (user) fetchChats();
  }, [user]);

  return (
    <div
      className="bg-white rounded p-3"
      style={{ width: "30%", height: "100%" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0">My Chats</h5>
        <GroupChatModal>
          <button className="btn btn-outline-primary btn-sm">
            New Group Chat +
          </button>
        </GroupChatModal>
      </div>

      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {chats ? (
          chats.map((chat) => {
            const senderName = !chat.isGroupChat
              ? getSender(loggedUser, chat.users)
              : chat.chatName;

            return (
              <button
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`w-100 text-start p-2 mb-2 rounded ${
                  selectedChat === chat ? "bg-primary text-white" : "bg-light"
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
