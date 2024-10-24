import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { databaseInstance } from './firebaseConfig.js';
import { ref, set } from '@react-native-firebase/database';

const DriverScreen = () => {
  const [location, setLocation] = useState(null);
  const [driverExists, setDriverExists] = useState(true); // Track driver existence
  const watchId = useRef(null); // Track the Geolocation watcher ID

  // Request Location Permissions
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
            startLocationUpdates(); // Start tracking after permissions are granted
          } else {
            Alert.alert(
              'Background Permission Denied',
              'Background location permission is required for continuous tracking.'
            );
          }
        } else {
          startLocationUpdates(); // For Android versions < 10
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

  // Start Location Updates
  const startLocationUpdates = () => {
    if (!driverExists) {
      Alert.alert('No Driver Found', 'The driver is not available currently.');
      return; // Stop if no driver exists
    }

    watchId.current = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };
        setLocation(newLocation); // Update local state

        // Update location in Firebase
        const locationRef = ref(databaseInstance, '/busLocation');
        set(locationRef, newLocation)
          .then(() => console.log('Location updated in Firebase'))
          .catch((error) => console.error('Error updating location:', error));
      },
      (error) => {
        console.error('Location Error:', error);
        Alert.alert('Location Error', 'Unable to track your location.');
      },
      { enableHighAccuracy: true, distanceFilter: 10, interval: 5000, fastestInterval: 2000 } // Config options for location updates
    );
  };

  // Stop Location Updates when component unmounts
  const stopLocationUpdates = () => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      console.log('Stopped location updates.');
    }
  };

  useEffect(() => {
    requestLocationPermission(); // Request permission on mount

    return () => stopLocationUpdates(); // Cleanup on unmount
  }, [driverExists]); // Track driver existence in the dependency array

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        Driver's Location:{' '}
        {location ? `${location.latitude}, ${location.longitude}` : 'Loading...'}
      </Text>
    </View>
  );
};

export default DriverScreen;
