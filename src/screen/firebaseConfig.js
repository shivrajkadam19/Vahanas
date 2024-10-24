// Correct imports for React Native Firebase
import { initializeApp, getApp, getApps } from '@react-native-firebase/app';
import { getDatabase } from '@react-native-firebase/database';

// Firebase configuration object (ensure values are correct)
const firebaseConfig = {
  apiKey: "AIzaSyDdyUi-67ydqERmMHRYMemxXci7hLUt5qg",
  authDomain: "realtimebustracking-f9dac.firebaseapp.com",
  databaseURL: "https://realtimebustracking-f9dac-default-rtdb.firebaseio.com",
  projectId: "realtimebustracking-f9dac",
  storageBucket: "realtimebustracking-f9dac.appspot.com",
  messagingSenderId: "421792162705",
  appId: "1:421792162705:web:1dbc6c64cf9b7f05cb3030",
};

// Ensure Firebase app is initialized only once
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use the already initialized app
}

// Export the database instance using the initialized app
export const databaseInstance = getDatabase(app);
