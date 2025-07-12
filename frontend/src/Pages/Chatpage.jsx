import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChat from "../components/MyChat";
import ChatBox from "../components/ChatBox";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, selectedChat, setSelectedChat } = ChatState();

  useEffect(() => {
    if (!sessionStorage.getItem("reloaded")) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-white mt-4">Loading Chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">Please log in to continue</h2>
          <p className="text-gray-400">
            You need to be authenticated to access the chat
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <SideDrawer />

      {/* Main Area */}
      <div
        className="flex flex-col md:flex-row gap-4 px-4 sm:px-6 md:px-8 py-4 flex-1 overflow-hidden"
        style={{ height: "91.5vh" }}
      >
        {/* Show MyChat only on large or when no chat selected */}
        {( !selectedChat || window.innerWidth >= 768 ) && (
          <div className="md:w-1/3 w-full h-1/2 md:h-full overflow-y-auto">
            <MyChat fetchAgain={fetchAgain} />
          </div>
        )}

        {/* Show ChatBox only if a chat is selected */}
        {selectedChat && (
          <div className="flex-1 h-1/2 md:h-full overflow-y-auto">
            <ChatBox
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              setSelectedChat={setSelectedChat}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatpage;
