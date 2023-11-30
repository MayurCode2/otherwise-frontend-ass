// commentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://otherwise-z5vp.onrender.com/api";
const getToken = () => {
  return localStorage.getItem("token"); // Replace 'yourAuthTokenKey' with the actual key you use to store the token
};
// Async Thunk
export const addComment = createAsyncThunk(
  "comment/addComment",
  async ({ postId, commentData }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/comment/${postId}`,
        commentData,
        {
          headers: {
            Authorization: `${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Comment Slice
const commentSlice = createSlice({
  name: "comment",
  initialState: {
    comments: [],
    status: "idle", // "idle", "loading", "fulfilled", or "rejected"
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.comments.unshift(action.payload.comment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });
  },
});

export default commentSlice.reducer;
