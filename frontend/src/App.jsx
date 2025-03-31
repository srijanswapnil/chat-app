import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';

import './App.css'
import Homepage from './Pages/Homepage';
import Chatpage from './Pages/Chatpage';
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Routes>
      <Route path='/' Component={Homepage}></Route>
      <Route path='/chats' Component={Chatpage}></Route>
      <Route path="/login" Component={Login } ></Route>
      <Route path="/signup" Component={Signup } ></Route>
      </Routes>
    </div>
  )
}

export default App
