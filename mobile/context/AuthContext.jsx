import { createContext, useState,useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client"
// Create the context
// import jwt from "jsonwebtoken"
export const AuthContext = createContext();

// Set base URL for axios from environment variable
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

// Create the provider component
export const AuthProvider = ({ children }) => {
  // Define all states inside the component
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);



  // Check if user is authenticated and if so, set the user data and connect the socket
  const checkAuth = async () => {
    try {
        const { data } = await axios.get("/api/auth/check");
        if (data.success) {
            setAuthUser(data.user)
            }
} catch (error) {
    toast.error(error.message)
}       
  }


useEffect(() => {
  if (authUser && !socket) {
    connectSocket(authUser);
  }
}, [authUser]);


// Login function to handle user authentication and socket connection
const login = async (state, credentials) => {
  try {
    const { data } = await axios.post(`/api/auth/${state}`, credentials);

    if (data.success) {
      setAuthUser(data.userData);                // Store user info
      connectSocket(data.userData);              // Connect to socket.io
      axios.defaults.headers.common["token"] = data.token; // Set default token for future requests
      setToken(data.token);                      // Store in state
      localStorage.setItem("token", data.token);// Store in localStorage
      toast.success(data.message);
    }
    else{
        toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};




// Logout function to handle user logout and socket disconnection
const logout = async () => {
localStorage.removeItem("token");
setToken(null);
setAuthUser(null);
setOnlineUsers([]);
axios.defaults.headers.common["token"] = null;
toast.success("Logged out successfully")
socket.disconnect();
}


// Update profile function to handle user profile updates
const updateProfile = async (body)=>{
    try {
    const { data } = await axios.put("/api/auth/update-profile", body);
        if(data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully")
            }
        } catch (error) {
        toast.error(error.message)
        }
}



// Function to connect socket and listen for online users
const connectSocket = (userData) => {
  if (!userData || socket?.connected) return;

  const newSocket = io(backendUrl, {
    query: {
      userId: userData._id,
       token: localStorage.getItem("token"),
    },
  });

  // Store socket instance
  setSocket(newSocket);

  // Listen for online users event
  newSocket.on("getOnlineUsers", (userIds) => {
    setOnlineUsers(userIds);
  });
};








useEffect(()=>{
    if(token) {
        axios.defaults.headers.common ["token"] = token;
                                            }
                                            checkAuth();
                                        }, [])

  // Bundle all values into a context object
  const value = {
    axios,
    token,
    setToken,
    authUser,
    setAuthUser,
    onlineUsers,
    setOnlineUsers,
    socket,
    setSocket,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
