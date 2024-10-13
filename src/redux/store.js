import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postSlice from './postSlice';
import eventSlice from './eventSlice';
import profileSlice from './profileSlice';
import otherProfileSlice from './OtherProfileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postSlice,
    event: eventSlice,
    profile: profileSlice,
    otherProfile: otherProfileSlice,
  },
});
