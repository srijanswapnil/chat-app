import { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      
      
      
      if (!userInfo) {
        console.log("No userInfo found, redirecting to login");
        navigate("/");
      } else {
        
        
        // Test if the pic URL is accessible
        if (userInfo.pic) {
          console.log("Testing image URL accessibility...");
          const img = new Image();
          
          img.src = userInfo.pic;
        } else {
          console.log("No profile picture URL found");
        }
        
        setUser(userInfo);
      }
    } catch (error) {
      console.error("Error parsing userInfo from localStorage:", error);
      console.log("Removing corrupted userInfo and redirecting to login");
      localStorage.removeItem("userInfo");
      navigate("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debug effect to monitor user state changes
  useEffect(() => {
    if (user) {
      console.log("User state updated:", user);
      console.log("Current user pic:", user.pic);
    }
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  const context = useContext(ChatContext);
  
  
  return context;
};

export default ChatProvider;