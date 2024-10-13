import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useDispatch, useSelector } from 'react-redux';
import MainNavigator from './MainNavigation';
import AuthNavigator from './AuthNavigation';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  // const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const initializeUser = async () => {
  //     await dispatch(fetchUser());
  //     setLoading(false);
  //   };

  //   initializeUser();
  // }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={require('../assets/loader.json')}
          autoPlay
          loop
          style={{height:'50%',width:'50%'}}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* {user ? ( */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="Main" component={MainNavigator} /> */}
        {/* </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}> */}
          <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
          <Stack.Screen name="Main" component={MainNavigator} />
        </Stack.Navigator>
      {/* )} */}
    </NavigationContainer>
  );
};

export default AppNavigator;
