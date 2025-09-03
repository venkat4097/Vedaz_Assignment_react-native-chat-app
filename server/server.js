import express from 'express';
import cors from 'cors';
import "dotenv/config";
import http from 'http';
import { connectDB } from './lib/db.js';

import userRouter from './routes/userRoutes.js';

import messageRouter from './routes/messageRoutes.js';

import { Server } from 'socket.io';
const app= express();
const server=http.createServer(app);









//intialize of socket.io server
export const io = new Server(server, {
  cors: {
    origin: "*", // Adjust to match your frontend origin
    // credentials: true,
  },
});

// Store mapping of userId to socketId
export const userSocketMap = {};



// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // server-side: socket.io
socket.on("typing", ({ to, isTyping }) => {
  const recipientSocket = userSocketMap[to]; // correct map
  if (recipientSocket) {
    io.to(recipientSocket).emit("typing", { from: userId, isTyping }); // use userId
  }
});


  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});











// middleware
app.use(cors());
//size of image file shoule be less than 4mb
app.use(express.urlencoded({extended:true,limit:"10mb"}));
app.use(express.json());

app.use("/api/status",(req,res)=>{
    res.send("server is live")})    
 
app.use('/api/auth',userRouter);
app.use('/api/messages',messageRouter);

await connectDB();
    
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});