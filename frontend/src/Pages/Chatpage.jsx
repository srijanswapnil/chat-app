import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChat from "../components/MyChat";
import ChatBox from "../components/ChatBox";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);
  
  const { user, selectedChat, setSelectedChat } = ChatState();

  // Handle window resize with debouncing
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Debounced resize handler
  useEffect(() => {
    let timeoutId;
    
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    // Set initial value
    handleResize();
    
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  // Improved initialization without forced reload
  useEffect(() => {
    const initializePage = async () => {
      try {
        // Simulate any async initialization if needed
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsLoading(false);
      } catch (error) {
        setError('Failed to initialize chat page');
        setIsLoading(false);
      }
    };

    initializePage();
  }, []);

  // Memoized responsive logic
  const shouldShowMyChat = useMemo(() => {
    return !selectedChat || !isMobile;
  }, [selectedChat, isMobile]);

  // Handle back to chat list on mobile
  const handleBackToList = useCallback(() => {
    if (isMobile) {
      setSelectedChat(null);
    }
  }, [isMobile, setSelectedChat]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 border border-amber-400 opacity-20"></div>
          </div>
          <p className="text-white mt-4 text-lg font-medium">Loading Chat...</p>
          <p className="text-gray-400 text-sm mt-1">Please wait while we set up your workspace</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-white text-xl mb-2 font-semibold">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex-shrink-0">
        <SideDrawer />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Chat List Panel */}
        {shouldShowMyChat && (
          <div className={`
            ${isMobile ? 'flex-1' : 'w-80 lg:w-96'}
            ${selectedChat && isMobile ? 'hidden' : 'flex'}
            flex-col bg-gray-800 border-r border-gray-700
          `}>
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-white text-lg font-semibold">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <MyChat fetchAgain={fetchAgain} />
            </div>
          </div>
        )}

        {/* Chat Box Panel */}
        {selectedChat ? (
          <div className={`
            flex-1 flex flex-col bg-gray-900
            ${isMobile && selectedChat ? 'w-full' : ''}
          `}>
            {/* Mobile back button */}
            {isMobile && (
              <div className="p-4 border-b border-gray-700 bg-gray-800">
                <button
                  onClick={handleBackToList}
                  className="flex items-center text-amber-500 hover:text-amber-400 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Back to Chats
                </button>
              </div>
            )}
            
            <div className="flex-1 overflow-hidden">
              <ChatBox
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                setSelectedChat={setSelectedChat}
              />
            </div>
          </div>
        ) : (
          // Empty state when no chat is selected (desktop only)
          !isMobile && (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <div className="text-center max-w-md mx-auto px-4">
                <div className="text-gray-600 mb-6">
                  <svg className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-white text-xl mb-3 font-semibold">Select a conversation</h3>
                <p className="text-gray-400 leading-relaxed">
                  Choose a chat from the sidebar to start messaging, or create a new conversation.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Chatpage;