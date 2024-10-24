import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNavigator from './MainNavigation';
import AuthNavigator from './AuthNavigation';
import DriverScreen from '../screen/DriverScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
        <Stack.Screen name="DriverScreen" component={DriverScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
