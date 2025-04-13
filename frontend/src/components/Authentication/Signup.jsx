import React, { useState } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState("");
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
    <div className="bg-gray-900 text-white rounded-2xl shadow-lg w-96 border border-gray-200 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 transition"
            placeholder="Enter your full name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 transition"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 transition"
            placeholder="Create a password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 transition"
            placeholder="Confirm your password"
            value={confirmpassword}
            required
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium">Upload Your Picture</label>
          <input
            type="file"
            className="w-full text-sm file:py-2 file:px-4 file:rounded-lg file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
          {pic && <img src={pic} alt="Preview" className="mt-2 rounded-lg w-24 h-24" />}
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold shadow-md"
          
        >
          Sign Up
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-green-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default Signup;