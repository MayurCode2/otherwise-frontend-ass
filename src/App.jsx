import React from 'react'
import BlogPost from './components/BlogPost'
import Header from './components/Header'

import { Routes, Route } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Home from './pages/Home/Home'
import UserBlogs from "./pages/userPost/UserBlogs"


function App() {
  return (
    <>
      <Header/>
<Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/userBlogs" element={<UserBlogs/>}/>
      </Routes>
    </> 
  )
}

export default App