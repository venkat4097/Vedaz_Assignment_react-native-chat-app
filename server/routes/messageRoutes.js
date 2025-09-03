import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage,
  markAllMessagesSeen
} from "../controllers/messageController.js";

const messageRouter = express.Router();

// Get all users for sidebar
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Get messages between current user and selected user
messageRouter.get("/:id", protectRoute, getMessages);

// Mark a specific message as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

// Send a new message to a specific user
messageRouter.post("/send/:id", protectRoute, sendMessage);
messageRouter.put("/markAllSeen/:userId", protectRoute, markAllMessagesSeen);

export default messageRouter;
