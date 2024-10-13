import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

// Helper function to get the user token from AsyncStorage
const getUserToken = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user).token : null;
  } catch (error) {
    console.error('Failed to fetch user from AsyncStorage:', error);
    return null;
  }
};

// Fetch all posts
export const getAllPost = createAsyncThunk(
  'post/getAllPost',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getUserToken();  // Retrieve token from AsyncStorage
      if (!token) {
        console.error('User not authenticated');
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.get(`${base_api}/post/getallpost`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching posts from API:', error);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// Create a new post
// Create a new post
export const createPost = createAsyncThunk(
  'post/createPost',
  async ({ postContent, description }, { rejectWithValue }) => { // Change `content` to `postContent`
    try {
      const token = await getUserToken();  // Retrieve token from AsyncStorage
      if (!token) {
        console.error('User not authenticated');
        return rejectWithValue('User not authenticated');
      }

      const formData = new FormData();
      formData.append('description', description);

      postContent.forEach((file) => {  // Update from `content` to `postContent`
        formData.append('postContent', { // Change field name to `postContent`
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
      });

      const response = await axios.post(`${base_api}/post/new-post`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);



const postSlice = createSlice({
  name: 'post',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
