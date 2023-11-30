// Header.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../pages/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve user data from localStorage
  const storeData = localStorage.getItem('user');
  // Parse user data, or set it to an empty object if null
  const userData = JSON.parse(storeData) || {};

  // Extract username from user data, or set it to null if undefined
  const user = userData.username || null;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="text-black border-b bg-white p-4 fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className=' cursor-pointer' onClick={(e)=>navigate("/")}>
          <h1 className="text-2xl font-bold">BloGSpot</h1>
        </div>
        <div>
          {user ? (
            <div className="flex justify-center">
              <span className="mr-4 text-black">{user}</span>
              <div onClick={(e)=>navigate("/userBlogs")} className='mr-1 cursor-pointer'>
                <p>My blogs</p>
              </div>
              <button onClick={handleLogout} className=" text-xs px-2 bg-black py-2 text-white rounded-md">
                Logout
              </button>
              
            </div>
          ) : (
            <div className="flex">
              <button onClick={(e)=>navigate("/login")} className="mr-4 px-4 py-2 bg-blue-500 text-white rounded-md">
                Login
              </button>
              <button onClick={(e)=>navigate("/register")} className="px-4 py-2 bg-green-500 text-white rounded-md">
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
