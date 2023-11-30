// BlogPost.js
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getAllBlogPosts, updateBlogPost } from "../pages/Home/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../pages/Home/commentSlice";
import userIcon from "../assets/user.png";
import Lottie from 'lottie-react';
import animationData from '../assets/loading.json'; 

const BlogPost = () => {
  // Extend dayjs with the relativeTime plugin
  dayjs.extend(relativeTime);
  
  // Redux setup
  const dispatch = useDispatch();
  const [commentInput, setCommentInput] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);
  const [loading, setLoading] = useState(true)
  const [isEditingMap, setIsEditingMap] = useState({});
  const blogPosts = useSelector((state) => state.blog.blogPosts);
  const user = useSelector((state) => state.auth.user);

  // Fetch all blog posts on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dispatch the action to get all blog posts
        await dispatch(getAllBlogPosts());
        setLoading(false); // Set loading to false once data is loaded
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();
  }, [dispatch]);

  // Handle adding a comment to a specific blog post
  const handleAddComment = async (postId) => {
    try {
      // Dispatch the action to add a comment
      await dispatch(addComment({ postId, commentData: { content: commentInput[postId] } }));
      
      // Update local state immediately
      setCommentInput({ ...commentInput, [postId]: '' });

      // Optionally, you can fetch the updated blog posts after adding a comment
      dispatch(getAllBlogPosts());
    } catch (error) {
      console.error("Error adding comment:", error);
      // Display an error message to the user (you can use a state variable for this)
      // For simplicity, let's log the error to the console for now
      alert("Error adding comment. Please try again.");
    }
  };

  // Show more comments handler
  const handleShowMoreComments = () => {
    setShowAllComments(true);
  };

  // If data is still loading, display a loading indicator
  if (loading) {
    return <div className="flex justify-center items-center mt-52"><Lottie animationData={animationData} className="w-36" /></div>;
  }

  // Render the blog posts
  return (
    <div>
      {blogPosts.map((post) => (
        <div
          key={post._id}
          className="max-w-2xl mx-auto my-8 p-6 bg-white shadow-md rounded-md"
        >
          <>
            {/* Display user information */}
            <div className="flex ">
              <div className="border rounded-full w-8 h-8  ">
                <img src={userIcon} alt="user" className="object-contain w-full h-full rounded-full" />
              </div>
              <div className="ml-2 flex mt-2 ">
                {/* Display the author's username and post creation time */}
                <span className="text-sm text-stone-800 m-0">{<p>{post.author.username}</p>} </span>
                <span className="text-xs text-gray-300 mt-1 ml-1">{dayjs(post.createdAt).fromNow()}</span>
              </div>
            </div>
            {/* Display the blog post title and content */}
            <h1 className="text-xl font-bold  text-black mb-6">
              {post.title}
            </h1>
            <p className="text-gray-800 mb-6">{post.content}</p>
          </>

          {/* Display comments section */}
          <div className="mb-1">
            <h2 className="text-xl text-black  font-semibold mb-4">
              Comments
            </h2>
            <ul>
              {post.comments
                .filter((comment) => comment) // Filter out undefined comments
                .slice(0, showAllComments ? undefined : 2)
                .map((comment) => (
                  <li key={comment._id} className="mb-1">
                    {/* Display comment author, creation time, and content */}
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-blue-400">
                        {comment.author && comment.author.username}
                      </span>
                      <span className="text-gray-500 ml-2 text-xs">
                        {comment.createdAt && dayjs(comment.createdAt).fromNow()}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm">{comment.content}</p>
                  </li>
                ))}
            </ul>
            {/* Show "Show More" button if there are more than 2 comments */}
            {!showAllComments && post.comments.length > 2 && (
              <button
                onClick={handleShowMoreComments}
                className="text-black text-xs hover:underline cursor-pointer"
              >
                Show More
              </button>
            )}
          </div>

          {/* Display comment input section */}
          <div className="mb-1">
            <h2 className=" text-base font-semibold text-black">
              Add a Comment
            </h2>
            {/* Textarea for entering a new comment */}
            <textarea
              value={commentInput[post._id] || ""}
              onChange={(e) =>
                setCommentInput({ ...commentInput, [post._id]: e.target.value })
              }
              className="w-full p-2 border border-indigo-500 rounded-md"
              placeholder="Write your comment here... 😊"
            ></textarea>
            {/* Button to add a new comment */}
            <button
              onClick={() => handleAddComment(post._id)}
              className="mt-4 bg-black text-white px-3 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:shadow-outline-indigo"
            >
              Add Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogPost;
