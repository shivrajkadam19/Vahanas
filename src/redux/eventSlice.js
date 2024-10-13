import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  events: [],
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

// Async thunk to fetch all events
export const getAllEvents = createAsyncThunk(
  'event/getAllEvents',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getUserToken();  // Retrieve token from AsyncStorage
      if (!token) {
        console.error('User not authenticated');
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.get(`${base_api}/event/get-event`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching events from API:', error);
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to create a new event with file uploads
export const createEvent = createAsyncThunk(
  'event/createEvent',
  async ({ eventData }, { rejectWithValue }) => {
    try {
      const token = await getUserToken();  // Retrieve token from AsyncStorage
      if (!token) {
        console.error('User not authenticated');
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.post(`${base_api}/event/create-event`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating event:', error.response?.data || error.message);
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      return rejectWithValue(message);
    }
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  extraReducers: (builder) => {
    builder
      // Handling getAllEvents
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling createEvent
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = [action.payload, ...state.events]; // Prepending the newly created event
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
