import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate('/chats');
    }
  }, [navigate]);

  return (
    
      <div className="bg-gray-700 text-white shadow-2xl rounded-3xl p-6 sm:p-10 w-full max-w-md flex flex-col items-center space-y-6 animate-fadeIn">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center">
          Welcome Back!
        </h1>

        <p className="text-sm sm:text-lg text-gray-300 text-center">
          Join us today and explore amazing features.
        </p>

        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 w-full">
          <Link to="/login" className="w-full">
            <button className="w-full px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300">
              Login
            </button>
          </Link>

          <Link to="/signup" className="w-full">
            <button className="w-full px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 hover:scale-105 transition-all duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
  );
};

export default Homepage;
