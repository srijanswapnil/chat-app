import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChat from '../components/MyChat';
import ChatBox from '../components/ChatBox';

const Chatpage = () => {
  const {user}=ChatState()

  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>} 
      <div style={{ height: "91.5vh" }} className='flex justify-between w-full p-10'>
         {user && <MyChat/>} 
        {user && <ChatBox/>}

      </div>

    </div>
  );
};

export default Chatpage;
