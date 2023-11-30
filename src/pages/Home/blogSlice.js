// blogSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addComment } from './commentSlice';

const API_URL = "https://otherwise-z5vp.onrender.com/api"

;
const getToken = () => {
    return localStorage.getItem('token'); // Replace 'yourAuthTokenKey' with the actual key you use to store the token
  };


  const storeData = localStorage.getItem('user');
  // Parse user data, or set it to an empty object if null
  const userData = JSON.parse(storeData) || {};

  // Extract username from user data, or set it to null if undefined
  const userid = userData.id || null;



// Async Thunks
export const getAllBlogPosts = createAsyncThunk('blog/getAllBlogPosts', async () => {
  try {
    const response = await axios.get(`${API_URL}/blog`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const createBlogPost = createAsyncThunk('blog/createBlogPost', async (blogData) => {
  try {
    const response = await axios.post(`${API_URL}/blog`, blogData, {
      headers: {
        Authorization: `${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const updateBlogPost = createAsyncThunk('blog/updateBlogPost', async ({ id, blogData }) => {
  try {
    const response = await axios.put(`${API_URL}/blog/${id}`, blogData, {
      headers: {
        Authorization: `${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});



export const getUserBlogs = createAsyncThunk('blog/getUserBlogs', async (_, { getState }) => {
    try {
      const { auth } = getState(); // Assuming you have an auth slice
      const response = await axios.get(`${API_URL}/blog/user-blogs`, {
        headers: {
          Authorization: `${getToken()}`,
        },
        params: {
          userId: userid 
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  });

// Slice
const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    blogPosts: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addBlogPost: (state, action) => {
        state.blogPosts.push(action.payload);
      },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getAllBlogPosts.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(getAllBlogPosts.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.blogPosts = action.payload;
    })
    .addCase(getAllBlogPosts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    })
    .addCase(createBlogPost.fulfilled, (state, action) => {
      state.blogPosts.push(action.payload);
    })
    
    
   
    .addCase(addComment.fulfilled, (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.blogPosts.find((p) => p.id === postId);
      if (post) {
        post.comments.unshift(comment);
      }
    });

    
},
});

export const { addBlogPost } = blogSlice.actions;

export default blogSlice.reducer;
