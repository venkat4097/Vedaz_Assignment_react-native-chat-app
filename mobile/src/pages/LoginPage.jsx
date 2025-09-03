import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import assets from '../assets/assets';

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    // First phase of sign up: ask for bio
    if (currState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    // Call login/signup function from context
    login(
      currState === "Sign up" ? 'signup' : 'login',
      { fullName, email, password, bio }
    );
  };

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      
      {/* Logo (Left side) */}
      {/* <img src={assets.logo_big} alt="Logo" className='w-[min(30vw, 250px)]' /> */}

      {/* Form (Right side) */}
     <form
  onSubmit={onSubmitHandler}
  className="w-[90%] max-w-md bg-white/10 backdrop-blur-md text-white border border-white/20 
             p-8 flex flex-col gap-6 rounded-2xl shadow-2xl transition-all"
>
  {/* Title */}
  <h2 className="font-semibold text-3xl flex justify-between items-center">
    {currState}
    {isDataSubmitted && (
      <img
        onClick={() => setIsDataSubmitted(false)}
        src={assets.arrow_icon}
        alt="Back"
        className="w-6 cursor-pointer hover:scale-110 transition"
      />
    )}
  </h2>

  {/* Name input */}
  {currState === "Sign up" && !isDataSubmitted && (
    <input
      onChange={(e) => setFullName(e.target.value)}
      value={fullName}
      type="text"
      className="p-3 rounded-lg border border-white/30 bg-white/10 placeholder-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-violet-500"
      placeholder="Full Name"
      required
    />
  )}

  {/* Email & Password */}
  {!isDataSubmitted && (
    <>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email Address"
        required
        className="p-3 rounded-lg border border-white/30 bg-white/10 placeholder-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
        required
        className="p-3 rounded-lg border border-white/30 bg-white/10 placeholder-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
    </>
  )}

  {/* Bio */}
  {currState === "Sign up" && isDataSubmitted && (
    <textarea
      onChange={(e) => setBio(e.target.value)}
      value={bio}
      rows={4}
      className="p-3 rounded-lg border border-white/30 bg-white/10 placeholder-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-violet-500"
      placeholder="Provide a short bio..."
      required
    />
  )}

  {/* Submit */}
  <button
    type="submit"
    className="py-3 px-4 bg-gradient-to-r from-orange-400 to-violet-600 rounded-lg 
               font-semibold text-white shadow-md hover:opacity-90 
               hover:scale-[1.02] transition"
  >
    {currState === "Sign up" ? "Create Account" : "Login Now"}
  </button>


  {/* Switch */}
  <div className="flex flex-col gap-2 text-center">
    {currState === "Sign up" ? (
      <p className="text-sm text-gray-300">
        Already have an account?{" "}
        <span
          onClick={() => {
            setCurrState("Login");
            setIsDataSubmitted(false);
          }}
          className="font-medium text-orange-400 hover:underline cursor-pointer"
        >
          Login here
        </span>
      </p>
    ) : (
      <p className="text-sm text-gray-300">
        Create an account{" "}
        <span
          onClick={() => setCurrState("Sign up")}
          className="font-medium text-violet-400 hover:underline cursor-pointer"
        >
          Click here
        </span>
      </p>
    )}
  </div>
</form>

    </div>
  );
};

export default LoginPage;
