// postsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, postData }) => {
  try {
    const response = await axios.put(`${API_URL}/blog/${id}`, postData, {
      headers: {
        Authorization: `${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/blog/${id}`, {
      headers: {
        Authorization: `${getToken()}`,
      },
    });
    return id;
  } catch (error) {
    throw error.response.data;
  }
});

export const getAllPosts = createAsyncThunk('posts/getAllPosts', async () => {
  try {
    const response = await axios.get(`${API_URL}/blog`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

// Redux Slice
const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    postList: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updatePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Assuming the API returns the updated post, replace the old post with the new one
        state.postList = state.postList.map((post) =>
          post._id === action.payload.id ? action.payload : post
        );

        
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Remove the deleted post from the array
        state.postList = state.postList.filter((post) => post._id !== action.payload);
       
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.postList = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        }
      );
  },
});

export default postsSlice.reducer;

