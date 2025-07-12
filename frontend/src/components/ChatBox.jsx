import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain, setSelectedChat }) => {
  const { selectedChat } = ChatState();

  return (
    <div
      className={`
        flex-1
        bg-gradient-to-br from-gray-900/40 to-gray-800/40
        backdrop-blur-md
        border border-gray-700/50
        rounded-2xl
        p-4 sm:p-6
        m-2 
        text-white 
        shadow-2xl 
        transition-all 
        duration-300 
        ease-in-out 
        overflow-hidden 
        w-full 
        h-[80vh] 
        max-h-[80vh]
        min-h-[300px] 
        sm:min-h-[400px] 
        md:min-h-[500px] 
        ${selectedChat ? "block" : "hidden"} 
        md:block
        relative
        hover:shadow-3xl
        hover:border-gray-600/50
        hover:bg-gradient-to-br hover:from-gray-900/50 hover:to-gray-800/50
      `}
    >
      {/* Decorative blurred background dots */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col">
        {selectedChat ? (
          <>
            {/* Back button for small screens */}
            <div className="sm:hidden mb-4">
              <button
                onClick={() => setSelectedChat(null)}
                className="text-sm px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              >
                ← Back to chats
              </button>
            </div>

            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-fade-in">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-gray-700/50 shadow-lg animate-pulse-slow">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-gray-200 mb-3 tracking-wide">
                Select a chat to start messaging
              </h3>

              <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
                Choose from your existing conversations or start a new one to begin chatting
              </p>

              <div className="mt-8 flex justify-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Ready to chat</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom styles */}
      <style jsx="true">{`
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.5);
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }

        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBox;
