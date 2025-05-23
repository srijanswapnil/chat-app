import asyncHandler from "express-async-handler";
import Message from "../models/message.Model.js";
import User from "../models/user.Model.js";
import Chat from "../models/chat.Model.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const allMessage = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate(
      "sender",
      "name pic email"
    ).populate("chat");
    res.json(messages)
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
