import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = (fetchAgain,setFetchAgain) => {
  const { selectedChat } = ChatState();

  return (
    <div className="flex-1 bg-gray-900 rounded-lg p-4 m-2 text-white shadow-lg">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div>
  );
};

export default ChatBox;
