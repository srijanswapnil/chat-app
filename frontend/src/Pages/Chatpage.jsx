import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Chatpage = () => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/chat');
      console.log('Fetched Data:', data);

      setChats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {
        chats.map((chat) => <div key={chat._id}>{chat.chatName}</div>)
      }
    </div>
  );
};

export default Chatpage;
