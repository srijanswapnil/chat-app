// axios.js
import axios from "axios";

const instance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  baseURL:  "https://talk-a-tive-79vq.onrender.com",

  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
