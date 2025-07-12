import ScrollToBottom from "react-scroll-to-bottom";
import { ChatState } from "../Context/ChatProvider";
import moment from "moment";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  if (!user || !user._id) {
    return (
      <div className="text-red-500 p-3">
        User context not loaded properly.
      </div>
    );
  }

  return (
    <ScrollToBottom className="flex flex-col gap-3 py-3 px-2 h-full w-full overflow-y-auto">
      {messages && messages.length > 0 ? (
        messages.map((m, i) => {
          const senderId = m.sender[0]._id;
          const userId = user._id;
          const isCurrentUser = senderId === userId;

          return (
            <div key={m._id || i} className="w-full">
              <div
                className={`flex items-end ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar (only for others) */}
                {!isCurrentUser && (
                  <img
                    src={
                      m.sender[0].pic ||
                      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    }
                    alt="Sender"
                    className="w-9 h-9 rounded-full shadow-md mr-2"
                  />
                )}

                {/* Message bubble */}
                <div className="max-w-[70%] flex flex-col">
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow-md transition-all duration-200 ${
                      isCurrentUser
                        ? "bg-blue-600 text-white self-end rounded-br-none"
                        : "bg-gray-700 text-white self-start rounded-bl-none"
                    }`}
                  >
                    {m.content}
                  </div>

                  <span
                    className={`text-xs text-gray-400 mt-1 px-1 ${
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
