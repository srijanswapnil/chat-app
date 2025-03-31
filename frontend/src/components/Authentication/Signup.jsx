import React, { useState } from 'react'

const Signup = () => {

  
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [confirmpassword,setConfirmpassword]=useState("")
  const [pic,setPic]=useState()
 

  


  const postDetails=(pics)=>{

  }

  const submitHandler=()=>{}

    return (
      
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
  <div className="bg-yellow p-8 rounded-xl shadow-xl w-96 border border-gray-100">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
    <form>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
          placeholder="Enter your full name"
          required
          onChange={(e)=>setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
          placeholder="Enter your email"
          required
          onChange={(e)=>setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
          placeholder="Create a password"
          required
          onChange={(e)=>setPassword(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
          placeholder="Confirm your password"
          required
          onChange={(e)=>setConfirmpassword(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Upload Your Picture</label>
        <input
          type="file"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
          accept="image/*"
          onChange={(e)=>postDetails(e.target.files[0])}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 font-medium text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        onClick={submitHandler}
      >
        Sign Up
      </button>
    </form>
    <p className="text-center text-gray-600 text-sm mt-6">
      Already have an account? <a href="/login" className="text-green-600 hover:text-green-800 font-medium hover:underline transition duration-300">Login</a>
    </p>
  </div>
</div>
      
    );
  };

export default Signup
