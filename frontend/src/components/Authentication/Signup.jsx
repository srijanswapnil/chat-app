import React, { useState } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Upload Image to Cloudinary
  const postDetails = (pic) => {
    if (!pic) {
      alert("No image selected");
      return;
    }

    if (pic.type !== "image/jpeg" && pic.type !== "image/png") {
      alert("Invalid file type. Only JPEG and PNG are allowed.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("file", pic);
    data.append("upload_preset", "chatapp");

    fetch("https://api.cloudinary.com/v1_1/dcbzvyzho/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.secure_url) {
          setPic(data.secure_url);
          console.log("Uploaded Image URL:", data.secure_url);
        } else {
          console.error("Upload failed", data);
          alert("Image upload failed");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        alert("Error uploading image");
        setLoading(false);
      });
  };

  // Handle Sign Up
  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);

    if (!name || !email || !password || !confirmpassword) {
      alert("Please fill all the fields");
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/signup",
        { name, email, password, pic },
        config
      );

      console.log("Signup successful:", data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats"); // Use navigate instead of history.push
    } catch (error) {
      alert(`Signup failed: ${error.response?.data?.message || error.message}`);
      console.error("Error:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800/80 backdrop-blur-sm text-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/50 p-8 relative overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Sign Up
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="Enter your full name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="Enter your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="Create a password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="Confirm your password"
                value={confirmpassword}
                required
                onChange={(e) => setConfirmpassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Your Picture</label>
              <input
                type="file"
                className="w-full text-sm file:py-3 file:px-4 file:rounded-lg file:bg-green-600/20 file:text-green-400 file:border-0 hover:file:bg-green-600/30 transition-all duration-200 file:font-medium text-gray-300 border border-gray-600 rounded-lg bg-gray-700/50"
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
              />
              {pic && (
                <div className="mt-4 flex justify-center">
                  <img 
                    src={pic} 
                    alt="Preview" 
                    className="rounded-xl w-24 h-24 object-cover border-2 border-gray-600 shadow-lg" 
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={submitHandler}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign Up
            </button>
          </div>

          <p className="text-center text-sm mt-6 text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-green-400 hover:text-green-300 hover:underline transition-colors duration-200 font-medium">
              Home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;