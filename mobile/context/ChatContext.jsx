import { useContext,useState,useEffect } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
// import { get } from "mongoose";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
const [otherUserTyping, setOtherUserTyping] = useState(false);

const [messages, setMessages] = useState([]);
const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null)
const [unseenMessages, setUnseenMessages] = useState({})

const {socket,axios}=useContext(AuthContext)
useEffect(() => {
  if (!socket) return;

  // Listen for typing events
  socket.on("typing", ({ from, isTyping }) => {
    if (selectedUser && from === selectedUser._id) {
      setOtherUserTyping(isTyping);
    }
  });

  return () => socket.off("typing");
}, [socket, selectedUser]);
useEffect(() => {
  if (!socket) return;

  socket.on("messageDelivered", (msgId) => {
    setMessages(prev => prev.map(m => m._id === msgId ? { ...m, delivered: true } : m));
  });

  socket.on("messageSeen", (msgId) => {
    setMessages(prev => prev.map(m => m._id === msgId ? { ...m, seen: true } : m));
  });

  return () => {
    socket.off("messageDelivered");
    socket.off("messageSeen");
  };
}, [socket]);
// function to get all users for sidebar
const getUsers = async () => {
try {
const { data } = await axios.get("/api/messages/users");
if (data.success) {
setUsers(data.users)
setUnseenMessages (data.unseenMessages)
}
} catch (error) {
toast.error(error.message)
}
}


// function to get messages for selected user
const getMessages = async (userId)=>{
try {
const { data } = await axios.get(`/api/messages/${userId}`);
if (data.success) {
setMessages (data.messages)
}
} catch (error) {
toast.error(error.message)
}
}

// Function to send message to selected user
const sendMessage = async (messageData) => {
  try {
    const { data } = await axios.post(
      `/api/messages/send/${selectedUser._id}`,
      messageData
    );

    if (data.success) {
      setMessages((prevMessages) => [...prevMessages, data.newMessage]);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


// Function to subscribe to messages for selected user
const subscribeToMessages = async () => {
  if (!socket) return;

  socket.on("newMessage", async (newMessage) => {
    if (selectedUser && newMessage.senderId === selectedUser._id) {
      newMessage.seen = true;
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Mark message as seen on the server
      await axios.put(`/api/messages/mark/${newMessage._id}`);
    } else {
      // Optionally handle notifications for other users here
      // Example: show toast notification
      setUnseenMessages((prevUnseenMessages) => ({
  ...prevUnseenMessages,
  [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
    ? prevUnseenMessages[newMessage.senderId] + 1
    : 1,
}));

    }
  });
};

// Function to unsubscribe from messages
const unsubscribeFromMessages = () => {
  if (socket) socket.off("newMessage");
};

useEffect(() => {
  subscribeToMessages();
  
  return () => {
    unsubscribeFromMessages();
  };
}, [socket, selectedUser]);



  const value = {
    messages, users, selectedUser,setMessages, getUsers, getMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages,otherUserTyping, setOtherUserTyping
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
