import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../pages/auth/authSlice"
import postReducer from "../pages/Home/blogSlice"
import commentReducer from "../pages/Home/commentSlice"
import postListReducer from "../pages/userPost/postsSlice"
const store = configureStore({
    reducer: {
      // Your reducers will go here
      auth:authReducer,
      blog:postReducer,
      comment:commentReducer,
      post:postListReducer


    },
  });
  
  export default store;