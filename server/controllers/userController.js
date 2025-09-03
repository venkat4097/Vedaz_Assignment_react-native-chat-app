  import cloudinary from "../lib/cloudinary.js";
  import { generateToken } from "../lib/utils.js"; // corrected spelling
  import User from "../models/User.js";
  import bcrypt from "bcryptjs";
  import jwt from "jsonwebtoken"

  import express from "express"
  const app=express();
  app.use(express.json());

  export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
      if (!fullName || !email || !password || !bio) {
        return res.status(400).json({ success: false, message: "Missing details" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ success: false, message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
        bio,
      });

      const token = generateToken(newUser._id);

      // Remove password before sending user data
      const { password: _, ...userWithoutPassword } = newUser.toObject();

      res.status(201).json({
        success: true,
        message: "Account created successfully",
        userData: userWithoutPassword,
        token,
      });

    } catch (error) {
      console.error("Signup error:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };



  //controller to login user

  export const login=async(req,res)=>{


      try{
          const {email,password}=req.body;
          const userData=await User.findOne({email});
          const isPasswordCorrect=await bcrypt.compare(password,userData.password);
          if(!isPasswordCorrect){
              return res.json({success:false,message:"Invalid user credentails"});
          }
          const token=generateToken(userData._id);
          res.json({success:true,userData,token,message:"login successs"});
      }catch(error){
          console.error("login error:", error.message);
      res.status(500).json({ success: false, message: error.message});
      }
  }



  // Controller to check if user is authenticated
  export const checkAuth = (req, res)=>{
  res.json({success: true, user: req.user});
  }


  // Controller to update user profile details
  // export const updateProfile = async (req, res)=>{
  //     try {
  // const { profilePic, bio, fullName } = req.body;
  // const userId = req.user._id;
  // let updatedUser;
  // if(!profilePic){
  //   updatedUser=  await User.findByIdAndUpdate(userId,{bio,fullName},{new:true})
  // }
  // else{
  //     const upload=await cloudinary.uploader.upload(profilePic);
  //     updatedUser= await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true})
  // }
  // res.json({success:true,user:updatedUser})
  // } catch (error) {
  //     console.log(error.message);
  //     res.json({success:false,message:error.message})
  // }
  // }
export const updateProfile = async (req, res) => {
//   console.log("REQ BODY in updateProfile:", JSON.stringify(req.body).slice(0, 300));
// console.log("User ID:", req.user?._id);

  try {
    const { profilePic, bio, fullName } = req.body;
    // console.log("REQ BODY:", req.body); // ✅ This should print in terminal
    // console.log("First 100 chars of image:", profilePic?.slice(0, 100)); // optional

    const userId = req.user._id;

    let updatedUser;
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("updateProfile ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
