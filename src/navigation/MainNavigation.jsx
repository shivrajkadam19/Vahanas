// MainNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import SettingScreen from '../screen/SettingScreen';
import CustomTabBar from '../components/CustomTabBar';
import CustomAppBar from '../components/CustomAppBar';
import { View } from 'react-native';

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
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen name="News">
        {(props) => <ScreenWithAppBar {...props} component={HomeScreen} title="News" />}
      </Tab.Screen>
      <Tab.Screen name="Files">
        {(props) => <ScreenWithAppBar {...props} component={SettingScreen} title="Files" />}
      </Tab.Screen>
      <Tab.Screen name="Calendar">
        {(props) => <ScreenWithAppBar {...props} component={HomeScreen} title="Calendar" />}
      </Tab.Screen>
      <Tab.Screen name="Chat">
        {(props) => <ScreenWithAppBar {...props} component={SettingScreen} title="Chat" />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {(props) => <ScreenWithAppBar {...props} component={SettingScreen} title="Profile" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MainNavigator;
