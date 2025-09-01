import asyncHandler from 'express-async-handler';
import Chat from '../models/chat.Model.js';
import User from '../models/user.Model.js'; 

export const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("userID param not sent with request");
        return res.sendStatus(400);
    }
    try {
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } } 
            ],
        })
            .populate("users", "-password")
            .populate("latestMessage");

        isChat = await Chat.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };

            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("users", "-password");

            res.status(200).send(fullChat);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


export const fetchChats = asyncHandler(async (req, res) => {
    try {
        let chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

        
        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name pic email"
        });

        res.status(200).json(chats); 
    } catch (error) {
        console.error(error); 
        res.status(400).json({ message: error.message });
    }
});


export const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: "Please provide all required fields (users, name)." });
    }

    let users;
    try {
        users = Array.isArray(req.body.users) ? req.body.users : JSON.parse(req.body.users);
    } catch (error) {
        return res.status(400).json({ message: "Invalid users format. Must be a valid JSON array." });
    }

    if (!Array.isArray(users) || users.length < 1) {
        return res.status(400).json({ message: "A group chat must have at least 2 members." });
    }

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized request. User not found." });
    }

    users.push(req.user._id); 

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user._id, 
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
export const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
  
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  });

export const removefromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
  
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  }); 

  export const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    
  
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  });