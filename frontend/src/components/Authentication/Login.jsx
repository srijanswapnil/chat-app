import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Import Axios

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault(); 
    setLoading(true);

    if (!email || !password) {
      alert("Please fill all the fields");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        config
      );

      console.log("Login successful:", data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
      console.error("Error:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white rounded-2xl shadow-lg w-96 border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={submitHandler}> {/* ✅ Add onSubmit here */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter your password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          disabled={loading} // ✅ Disable button while loading
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <button
        className="w-full my-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </button>

      <p className="text-center text-gray-500 text-sm mt-4">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-500 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default Login;
