import mongoose from "mongoose";

// ❌ Avoid importing User model unless absolutely necessary here
// import User from './User.js' ← Remove this if not directly using the model

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String },
  image: { type: String },
  delivered: { type: Boolean, default: false }, // new field
  seen: { type: Boolean, default: false },
}, { timestamps: true });


// ✅ Safe model registration
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
