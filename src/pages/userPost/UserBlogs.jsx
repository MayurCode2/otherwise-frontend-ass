import React, { useState,useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getAllPosts, updatePost, deletePost } from "./postsSlice";
import { useDispatch, useSelector } from "react-redux";
import Lottie from 'lottie-react';
import animationData from '../../assets/loading.json'; 

import userIcon from "../../assets/user.png";
import axios from "axios";

const UserBlogs = () => {
  dayjs.extend(relativeTime);
  const dispatch = useDispatch();
  const [commentInput, setCommentInput] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);
  const [isEditingMap, setIsEditingMap] = useState({});
  const [updatedData, setUpdatedData] = useState({
    id: null,
    title: "",
    content: "",
  });
  const [setData, setSetData] = useState([]);
  const [blogPost, setBlogPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const blogPosts = useSelector((state) => state.post.postList);
  const storeData = localStorage.getItem('user');
  const userData = JSON.parse(storeData) || {};
  const user = userData.id || null;
  const userBlogs = blogPosts.filter((post) => post.author && post.author._id === user);

  useEffect(() => {
    // Fetch all posts on component mount
    const fetchData = async () => {
      try {
        await dispatch(getAllPosts());
        setLoading(false); // Set loading to false once data is loaded
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();
  }, [dispatch]);





  const handleUpdatePost = (postId) => {
    const postToUpdate = userBlogs.find((post) => post._id === postId);
    if (postToUpdate) {
      setUpdatedData({
        id: postId,
        title: postToUpdate.title,
        content: postToUpdate.content,
      });
      setIsEditingMap({ ...isEditingMap, [postId]: true });
    }
  };

  const handleSaveUpdate = async (postId) => {
    try {
      await dispatch(updatePost({ id: postId, postData: updatedData })); // Change 'blogData' to 'postData'
      setIsEditingMap({ ...isEditingMap, [postId]: false });
  
      // Update the local state with the new data directly from updatedData
      setUpdatedData({
        id: null,
        title: updatedData.title,
        content: updatedData.content,
      });
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post. Please try again.');
    }
  };


  const handleCancelUpdate = (postId) => {
    setIsEditingMap({ ...isEditingMap, [postId]: false });
    setUpdatedData({
      id: null,
      title: "",
      content: "",
    });
  };

  const handleDeletePost = async (postId) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete this post?');
      if (isConfirmed) {
        await dispatch(deletePost(postId));
        // No need to dispatch getAllPosts() here, as the deletePost action should handle it
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post. Please try again.');
    }
  };



  if (loading) {
    // Display a loading indicator while data is being fetched
    return <div className=" flex justify-center items-center mt-52"><Lottie animationData={animationData} className=" w-36 " /></div>;
  }


  
  return (
    <div className="mt-20">
      {userBlogs.map((post) => (
        <div key={post._id} className="max-w-2xl mx-auto my-8 p-6 bg-white shadow-md rounded-md">
          <>
            <div className=" flex ">
              <div className=" border rounded-full w-8 h-8  ">
                <img src={userIcon} alt="user" className=" object-contain w-full h-full rounded-full" />
              </div>
              <div className="ml-2 flex mt-2 ">
                <span className="text-sm text-stone-800 m-0">{<p>{post.author.username}</p>} </span>
                <span className=" text-xs text-gray-300 mt-1 ml-1">{dayjs(post.createdAt).fromNow()}</span>
              </div>
            </div>
            {isEditingMap[post._id] ? (
              <div className="mb-4">
                <input
                  type="text"
                  value={updatedData.title}
                  onChange={(e) => setUpdatedData({ ...updatedData, title: e.target.value })}
                  className="w-full p-2 border border-indigo-500 rounded-md mb-2"
                  placeholder="Update title..."
                />
                <textarea
                  value={updatedData.content}
                  onChange={(e) => setUpdatedData({ ...updatedData, content: e.target.value })}
                  className="w-full p-2 border border-indigo-500 rounded-md"
                  placeholder="Update content... 😊"
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleSaveUpdate(post._id)}
                    className="bg-green-500 text-white px-3 py-1 mr-2 rounded-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleCancelUpdate(post._id)}
                    className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 focus:outline-none focus:shadow-outline-gray"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold  text-black mb-6">{post.title}</h1>
                <p className="text-gray-800 mb-6">{post.content}</p>
              </>
            )}
          </>
          <div className="mb-1">
            {/* ... (other code) */}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => handleUpdatePost(post._id)}
              className="bg-blue-500 text-white px-3 py-1 mr-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
            >
              Update
            </button>
            <button
              onClick={() => handleDeletePost(post._id)}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:shadow-outline-red"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserBlogs;
