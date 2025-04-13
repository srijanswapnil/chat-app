import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div
      className={`
        flex-1
        bg-gray-900 
        rounded-2xl 
        p-4 
        m-2 
        text-white 
        shadow-xl 
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
        ${selectedChat ? 'block' : 'hidden'} 
        md:block
      `}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
