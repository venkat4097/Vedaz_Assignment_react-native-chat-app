import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    sendMessage,
    getMessages,
    otherUserTyping,
    setOtherUserTyping,
  } = useContext(ChatContext);

  const { authUser, onlineUsers, socket } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const typingTimeout = useRef(null);
  const messagesContainerRef = useRef(null);
  const scrollEnd = useRef(null);

  // Typing handler
  const handleTyping = (e) => {
    setInput(e.target.value);
    if (!socket || !selectedUser) return;

    socket.emit("typing", { to: selectedUser._id, isTyping: true });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing", { to: selectedUser._id, isTyping: false });
    }, 2000);
  };

  // Listen for typing events
  useEffect(() => {
    if (!socket) return;

    const handleTypingEvent = ({ from, isTyping }) => {
      if (selectedUser && from === selectedUser._id) {
        setOtherUserTyping(isTyping);
      }
    };

    socket.on("typing", handleTypingEvent);
    return () => socket.off("typing", handleTypingEvent);
  }, [socket, selectedUser, setOtherUserTyping]);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, otherUserTyping]);

  // Send text message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage({ text: input.trim() });
    setInput("");

    if (socket && selectedUser) {
      socket.emit("typing", { to: selectedUser._id, isTyping: false });
    }
  };

  // Send image message
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = ""; // Clear input
    };
    reader.readAsDataURL(file);
  };

  if (!selectedUser) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 py-3 px-4 border-b border-stone-500 bg-[#0a0321] z-10">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
      </div>

      {/* Messages container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 mb-2 ${
              msg.senderId === authUser._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-end gap-2 ${
                msg.senderId !== authUser._id ? "flex-row-reverse" : ""
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-2"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-2 break-all bg-black text-white ${
                    msg.senderId === authUser._id
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <div className="text-center text-xs flex flex-col items-center">
                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  alt=""
                  className="w-7 rounded-full"
                />
                <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>

                {/* Seen/Delivered/ Sent status for your messages */}
                {msg.senderId === authUser._id && (
                  <p className="text-[10px] text-gray-400">
                    {msg.seen
                      ? "Seen ✅"
                      : msg.delivered
                      ? "Delivered ✔"
                      : "Sent ✉️"}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {otherUserTyping && (
          <p className="text-gray-400 text-sm ml-2 mb-2">Typing...</p>
        )}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSendMessage}
        className="flex-shrink-0 flex items-center gap-3 p-3 bg-black/20 border-t border-stone-500"
      >
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 p-3 rounded-full bg-gray-100/12 text-white outline-none placeholder-gray-400"
          value={input}
          onChange={handleTyping}
        />
        {/* Image upload */}
        <input
          onChange={handleSendImage}
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
        />
        <label htmlFor="image" className="cursor-pointer mr-2">
          <img src={assets.gallery_icon} alt="" className="w-5" />
        </label>

        {/* Send button */}
        <button
          type="submit"
          className="w-10 h-10 flex items-center justify-center text-white border-2 rounded-full"
        >
          →
        </button>
      </form>
    </div>
  );
};

export default ChatContainer;
