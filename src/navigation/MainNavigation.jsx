import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import SettingScreen from '../screen/SettingScreen';
import CustomTabBar from '../components/CustomTabBar';
import CustomAppBar from '../components/CustomAppBar';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain'; // For secure token storage

const Tab = createBottomTabNavigator();

const ScreenWithAppBar = ({ component: Component, title, navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <CustomAppBar title={title} navigation={navigation} />
      <Component />
    </View>
  );
};

const MainNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Loading state for auth check
  const navigation = useNavigation();

  // Check if the user is authenticated by fetching the token from Keychain
  const checkAuthentication = async () => {
    try {
      const credentials = await Keychain.getGenericPassword(); // Check for token
      if (credentials) {
        console.log('User authenticated:', credentials); // Debug log
        setIsAuthenticated(true); // User is authenticated
      } else {
        setIsAuthenticated(false); // No valid token found, redirect to Login
      }
    } catch (error) {
      console.error('Authentication Check Error:', error);
      setIsAuthenticated(false); // Handle error by logging out
    }
  };

  // Redirect to Login screen if not authenticated
  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigation.navigate('Login'); // Redirect to Login if not authenticated
    }
  }, [isAuthenticated]);

  // Show a loading indicator while authentication is being checked
  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen name="Home">
        {(props) => <ScreenWithAppBar {...props} component={HomeScreen} navigation={navigation} title="Home" />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {(props) => <ScreenWithAppBar {...props} component={SettingScreen} navigation={navigation} title="Profile" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MainNavigator;
