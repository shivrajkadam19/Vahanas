import React, { useEffect, useState } from 'react';
import { View, Text, Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { databaseInstance } from './firebaseConfig.js';
import { ref, set } from '@react-native-firebase/database';

const DriverScreen = () => {
  const [location, setLocation] = useState(null);
  const [driverExists, setDriverExists] = useState(true); // Track driver existence

  const requestLocationPermission = async () => {
    try {
      const fineLocationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Foreground location permission granted.');

        if (Platform.Version >= 29) {
          const backgroundGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
          );

          if (backgroundGranted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Background location permission granted.');
            updateLocation(); // Start location updates after permissions are granted
          } else {
            Alert.alert(
              'Background Permission Denied',
              'Background location permission is required for continuous tracking.'
            );
          }
        } else {
          updateLocation(); // For Android versions < 10
        }
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to track your location.'
        );
      }
    } catch (err) {
      console.warn('Error requesting location permission:', err);
    }
  };

  const updateLocation = () => {
    if (!driverExists) {
      Alert.alert('No Driver Found', 'The driver is not available currently.');
      return; // Stop further updates if no driver exists
    }

    const latitude = 20.987798675355773; // Dastur Nagar, Amravati (Static demo coordinates)
    const longitude = 77.75748610275781;

    const newLocation = { latitude, longitude };
    setLocation(newLocation);

    const locationRef = ref(databaseInstance, '/busLocation');
    set(locationRef, newLocation)
      .then(() => console.log('Location updated in Firebase'))
      .catch((error) => console.error('Error updating location:', error));
  };

  useEffect(() => {
    requestLocationPermission(); // Request permission on mount

    const intervalId = setInterval(updateLocation, 10000000); // Update location every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [driverExists]); // Track driver existence in the dependency array

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        Driver's Location: {location ? `${location.latitude}, ${location.longitude}` : 'Loading...'}
      </Text>
    </View>
  );
};

export default DriverScreen;
