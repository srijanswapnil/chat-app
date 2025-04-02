import React from 'react';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    
    <div className="bg-gray-600 text-white shadow-lg rounded-2xl p-8 flex flex-col items-center space-y-6">
      <h1 className="text-4xl font-extrabold ">Welcome to Our Website</h1>
      <p className=" text-lg">Join us today and explore amazing features.</p>
      <div className="flex space-x-4">
        <a href={"Login"}>
          <button className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
            Login
          </button>
        </a>
        
        <a href={"Signup"}>
          <button className=" px-6 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition duration-300">
            Sign Up
          </button>
        </a>
      </div>
    </div>
  );
};

export default Homepage;
