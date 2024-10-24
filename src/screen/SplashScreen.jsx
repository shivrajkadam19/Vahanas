import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Keychain from 'react-native-keychain'; // Import Keychain to retrieve token

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const credentials = await Keychain.getGenericPassword(); // Check if token exists
        if (credentials) {
          console.log('User is logged in, navigating to Main screen.');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }], // Navigate to Login/Main screen
          });
        } else {
          console.log('No user found, navigating to Onboarding.');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }], // Navigate to Onboarding screen
          });
        }
      } catch (error) {
        console.error('Error checking user token:', error);
        Alert.alert('Error', 'An error occurred while checking login status.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        });
      }
    };

    // Start checking if user is logged in
    checkUserLoggedIn();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animation4.json')}
        autoPlay
        loop
        style={styles.animation}
        onError={(error) => console.log('Animation error:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animation: {
    width: 300,
    height: 400,
  },
});

export default SplashScreen;
