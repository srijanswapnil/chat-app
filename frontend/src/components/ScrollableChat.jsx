
import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { ChatState } from "../Context/ChatProvider";
import moment from "moment";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  
  // Add this console log to check if user is available
  console.log("Current user:", user);
  console.log("Messages:", messages);

  if (!user || !user._id) {
    console.error("User or user._id is undefined!");
    return <div className="text-red-500 p-3">User context not loaded properly.</div>;
  }

  return (
    <ScrollToBottom className="flex flex-col gap-1 py-2 h-full w-full">
      {messages && messages.length > 0 ? (
        messages.map((m, i) => {
          // Explicitly check and log the sender ID
          const senderId = m.sender[0]._id;
          console.log(m)
          const userId = user?._id;
        //   console.log(`Message ${i}: sender=${senderId}, user=${userId}, isCurrentUser=${senderId === userId}`);
          
          // Check if message is from logged-in user
          const isCurrentUser = senderId === userId;
          
          return (
            <div
              key={m._id || i}
              className="mb-3 w-full"
            >
              {/* Message Container */}
              <div 
                className={`flex w-full ${isCurrentUser ? "justify-end" : "justify-start"}`}
                style={{border: "1px solid transparent"}} // For debugging layout
              >
                {/* Other user's avatar - only show for received messages */}
                {!isCurrentUser && (
                  <div className="flex-shrink-0 mr-2">
                    <img
                      src={
                        m.sender[0].pic ||
                        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                      }
                      alt="Sender"
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                )}

                {/* Message content */}
                <div className={`max-w-[70%] flex flex-col`}>
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      isCurrentUser
                        ? "bg-blue-600 text-white self-end" // User's messages
                        : "bg-gray-700 text-white self-start" // Other person's messages
                    }`}
                  >
                    {m.content}
                  </div>
                  <span
                    className={`text-xs text-gray-400 mt-1 ${
                      isCurrentUser ? "text-right" : "text-left"
                    }`}
                  >
                    {moment(m.createdAt).format("h:mm A")}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-500 p-4">No messages yet</div>
      )}
    </ScrollToBottom>
  );
};

export default ScrollableChat;