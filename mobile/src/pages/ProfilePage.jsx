// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import assets from '../assets/assets';
// import { useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext';

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets'; // ✅ make sure this path is correct
import { AuthContext } from '../../context/AuthContext'; // ✅ check for case-sensitive path


const ProfilePage = () => {



  const {authUser,updateProfile}=useContext(AuthContext)






  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const navigate = useNavigate();


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedImg) {
    await updateProfile({ fullName: name, bio });
    navigate('/');
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(selectedImg);
  reader.onload = async () => {
    const base64Image = reader.result; // this is a full data URL
    console.log("Sending base64 to backend"); // ✅ confirm in browser
    await updateProfile({ profilePic: base64Image, fullName: name, bio });
    navigate('/');
  };
};



  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile details</h3>

          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
              alt="avatar"
              className={`w-12 h-12 ${selectedImg ? 'rounded-full' : ''}`}
            />
            Upload profile image
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md "
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
            className="p-2 border border-gray-500 rounded-md "
            rows={4}
          ></textarea>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>

        <img
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg ? 'rounded-full' : ''}`}
          src={authUser?.profilePic||assets.logo_icon}
          alt="logo"
        />
      </div>
    </div>
  );};


export default ProfilePage;
