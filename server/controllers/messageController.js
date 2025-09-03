import message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.js";
import {io,userSocketMap} from "../server.js"






//get all users except loggedin users
export const getUsersForSidebar=async(req,res)=>{
    try{
        const userId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select('-password');


        //count number of messages unseen
        const unseenMessages={}
        const promises=filteredUsers.map(async(user)=>{
            const messages=await Message.find({senderId:user._id,receiverId:userId,seen:false})
            if(messages.length>0){
                unseenMessages[user._id]=messages.length

            }
        })
        await Promise.all(promises)
        res.json({success:true,users:filteredUsers,unseenMessages})
    }catch(error){
        console.log(error.message);
         res.json({success:false,message:error.message})
    }
}



//getl all message for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    // Fetch all messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 }); // Optional: sort messages by time

    // Mark all messages from selected user as seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { $set: { seen: true } }
    );

    // Respond with messages
    return res.json({ success: true, messages });
    
  } catch (error) {
   console.log(error.message);
         res.json({success:false,message:error.message})
  }
};

//api to mark message as seen using message id
import Message from '../models/Message.js'; // adjust path as needed

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    // Update the message's 'seen' status
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true } // optional: return the updated document
    );

    if (!updatedMessage) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    return res.json({ success: true, message: "Message marked as seen" });
  } catch (error) {
    console.error("Error marking message as seen:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};



//send messge to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl = '';

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    // Emit the new message to the receiver's socket
const receiverSocketId = userSocketMap [receiverId];
if (receiverSocketId) {
io.to (receiverSocketId).emit("newMessage", newMessage)
}

    res.json({ success: true, newMessage });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
// messageController.js
// export const markAllMessagesSeen = async (req, res) => {
//   try {
//     const { userId } = req.params; // the sender whose messages we mark as seen
//     const myId = req.user._id;

//     await Message.updateMany(
//       { senderId: userId, receiverId: myId, seen: false },
//       { $set: { seen: true } }
//     );

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
export const markAllMessagesSeen = async (req, res) => {
  try {
    const { userId } = req.params; // the sender whose messages we mark as seen
    const myId = req.user._id;

    const updatedMessages = await Message.updateMany(
      { senderId: userId, receiverId: myId, seen: false },
      { $set: { seen: true } },
      { new: true }
    );

    // Emit seen event to sender's socket
    const senderSocketId = userSocketMap[userId];
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageSeenAll", { from: myId });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
