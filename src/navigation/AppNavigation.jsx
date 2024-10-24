import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../redux/authSlice'; // Import the action
import MainNavigator from './MainNavigation';
import AuthNavigator from './AuthNavigation';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Keychain from 'react-native-keychain';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  // const dispatch = useDispatch();
  // const { user, loading } = useSelector((state) => state.auth); // Get user & loading state from Redux
  // const [isInitializing, setIsInitializing] = useState(true);

  // Function to initialize user session from Keychain
  // const initializeUser = async () => {
  //   try {
  //     const credentials = await Keychain.getGenericPassword();
  //     if (credentials) {
  //       // If token exists, fetch user profile
  //       await dispatch(fetchUser());
  //     }
  //   } catch (error) {
  //     console.error('Failed to initialize user:', error);
  //   } finally {
  //     setIsInitializing(false); // Stop the splash/loading screen
  //   }
  // };

  // useEffect(() => {
  //   initializeUser(); // Check if user token exists on app start
  // }, []);

  // if (loading || isInitializing) {
  //   // Show loader while initializing or during Redux state changes
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <LottieView
  //         source={require('../assets/loader.json')}
  //         autoPlay
  //         loop
  //         style={{ height: '50%', width: '50%' }}
  //       />
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* {user ? ( */}
          {/* // If user exists, show MainNavigator */}
          <Stack.Screen name="Main" component={MainNavigator} />
        {/* ) : ( */}
          {/* // If no user, show AuthNavigator */}
          <Stack.Screen name="Auth" component={AuthNavigator} />
        {/* )} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
