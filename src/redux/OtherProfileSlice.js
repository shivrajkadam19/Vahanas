import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state for the other user's profile slice
const initialState = {
  profile: null,
  loading: false,
  error: null,
};

// Utility function to get the user token from AsyncStorage
const getUserToken = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user).token : null;
  } catch (error) {
    console.error('Failed to fetch user from AsyncStorage:', error);
    return null;
  }
};

// Thunk to fetch another user's profile
export const fetchOtherUserProfile = createAsyncThunk(
  'otherProfile/fetchOtherUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const token = await getUserToken();
      if (!token) {
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.get(`${base_api}/profile/view-profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }

      // console.log(response.data.data)
      // Return the other user's profile data
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch profile';
      return rejectWithValue(message);
    }
  }
);

// Slice to manage other user's profile state
const otherProfileSlice = createSlice({
  name: 'otherProfile',
  initialState,
  reducers: {
    // Action to reset the other user's profile state
    resetOtherProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch other user's profile pending
      .addCase(fetchOtherUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fetch other user's profile fulfilled
      .addCase(fetchOtherUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      // Fetch other user's profile rejected
      .addCase(fetchOtherUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Exporting actions and reducer
export const { resetOtherProfile } = otherProfileSlice.actions;
export default otherProfileSlice.reducer;
