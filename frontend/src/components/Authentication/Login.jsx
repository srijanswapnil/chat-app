import React from 'react';
import Signup from './Signup';
import { useState } from 'react';
const Login = () => {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    
    const submitHandler=()=>{}





  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              required
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              required
              onChange={(e)=>setPassword(e.target.value)} 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            variant="solid"
            colorscheme="red"
            width="100%"
            onClick={submitHandler}
          >
            Login
          </button>
          <button
            variant="solid"
            colorscheme="red"
            width="100%"
            onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
            }}>
            Get Guest User Credentials
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account? <a href={"Signup"} className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;