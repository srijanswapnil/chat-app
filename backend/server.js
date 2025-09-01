import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import cors from "cors";
import messageRoutes from './routes/messageRoutes.js';
import { Server } from 'socket.io';

dotenv.config(); 

const app = express();

// ✅ Correct CORS setup
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

connectDB();

app.use(express.json());
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("⚡ Connected to socket.io");

  socket.on("setup", (userData) => {
  socket.join(userData._id);
  socket.userId = userData._id;
  console.log(`✅ User ${userData.name || userData._id} joined room: ${userData._id}`);
  socket.emit("connected");
});

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`👥 User joined room: ${room}`);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("newMessage", (newMessageReceived) => {
  const chat = newMessageReceived.chat;
  if (!chat?.users) return console.log("⚠️ Chat.users not defined");

  console.log(`📤 Broadcasting message to ${chat.users.length} users`);

  chat.users.forEach((user) => {
    if (user._id === newMessageReceived.sender._id) return;
    
    console.log(`📨 Sending to user: ${user._id}`);
    // Send to user's personal room
    socket.to(user._id).emit("message received", newMessageReceived);
    
    // Optional: Send separate notification event
    socket.to(user._id).emit("notification received", newMessageReceived);
  });
});

  socket.on("disconnect", () => {
    console.log("🔌 User Disconnected");
    if (socket.userId) socket.leave(socket.userId);
  });

 
});
 