import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state for the profile slice
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

// Thunk to fetch the logged-in user's profile
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getUserToken();
      if (!token) {
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.get(`${base_api}/profile/view-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }

      // Return the profile data for the logged-in user
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch profile';
      return rejectWithValue(message);
    }
  }
);

// Thunk to update the logged-in user's profile
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = await getUserToken();
      if (!token) {
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.put(`${base_api}/profile/update-profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Invalid response structure');
      }

      // Return the updated profile data
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update profile';
      return rejectWithValue(message);
    }
  }
);

// Thunk to update profile image for the logged-in user
export const updateProfileImage = createAsyncThunk(
  'profile/updateProfileImage',
  async (image, { rejectWithValue }) => {
    try {
      const token = await getUserToken();
      if (!token) {
        return rejectWithValue('User not authenticated');
      }

      const formData = new FormData();
      formData.append('profileContent', { 
        uri: image.uri,
        type: image.type || 'image/jpeg',  // Default to JPEG if no type provided
        name: image.name || 'profile.jpg', // Default name
      });

      const response = await axios.patch(`${base_api}/profile/update-profileimage`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update profile image');
      }

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update profile image';
      return rejectWithValue(message);
    }
  }
);

// Thunk to update cover image for the logged-in user
export const updateCoverImage = createAsyncThunk(
  'profile/updateCoverImage',
  async (image, { rejectWithValue }) => {
    try {
      const token = await getUserToken();
      if (!token) {
        return rejectWithValue('User not authenticated');
      }

      const formData = new FormData();
      formData.append('coverContent', { 
        uri: image.uri,
        type: image.type || 'image/jpeg',  // Default to JPEG if no type provided
        name: image.name || 'cover.jpg', // Default name
      });

      const response = await axios.patch(`${base_api}/profile/update-coverimage`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update cover image');
      }

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update cover image';
      return rejectWithValue(message);
    }
  }
);

// Profile slice for the logged-in user
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch profile pending
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fetch profile fulfilled
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      // Fetch profile rejected
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  
      // Update profile pending
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Update profile fulfilled
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      // Update profile rejected
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update profile image pending
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
      })
      // Update profile image fulfilled
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profile.profileImage = action.payload.profileImage; // Update profile image
      })
      // Update profile image rejected
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  
      // Update cover image pending
      .addCase(updateCoverImage.pending, (state) => {
        state.loading = true;
      })
      // Update cover image fulfilled
      .addCase(updateCoverImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profile.coverImage = action.payload.coverImage; // Update cover image
      })
      // Update cover image rejected
      .addCase(updateCoverImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
