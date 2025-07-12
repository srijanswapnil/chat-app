import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" className="App" element={<Login />} />
        <Route path="/signup" className="App" element={<Signup />} />
        <Route path="/chats" className="App" element={<Chatpage />} />
      </Routes>
    </div>
  );
}

export default App;
