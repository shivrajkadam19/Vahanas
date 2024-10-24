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

const MainNavigator = (navigation) => {

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
