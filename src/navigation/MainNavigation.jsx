import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import SettingScreen from '../screen/SettingScreen';
import DriverScreen from '../screen/DriverScreen';
import CustomTabBar from '../components/CustomTabBar';
import CustomAppBar from '../components/CustomAppBar';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

const ScreenWithAppBar = ({ component: Component, title, navigation, ...props }) => {
  return (
    <View style={{ flex: 1 }}>
      <CustomAppBar title={title} navigation={navigation} />
      <Component {...props} />
    </View>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
      tabBarHideOnKeyboard={true}
    >
      <Tab.Screen name="Home">
        {(props) => <ScreenWithAppBar {...props} component={HomeScreen} title="Home" />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {(props) => <ScreenWithAppBar {...props} component={SettingScreen} title="Profile" />}
      </Tab.Screen>
      {/* <Tab.Screen name="Driver" >
        {(props) => <ScreenWithAppBar {...props} component={DriverScreen} title="Driver" />}
      </Tab.Screen> */}
    </Tab.Navigator>
  );
};

export default MainNavigator;
