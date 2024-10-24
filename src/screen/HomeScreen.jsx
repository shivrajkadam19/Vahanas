import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  // Request permission for location (Android only)
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      } else {
        getCurrentLocation();
      }
    };
    requestLocationPermission();
  }, []);

  // Get current location
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.error('Error getting location: ', error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 20.9449, // Central point between Kathora Naka and Pote College
          longitude: 77.7567,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
      >
        {/* Marker for Kathora Naka */}
        <Marker
          coordinate={{ latitude: 20.9220, longitude: 77.7587 }}
          title="Kathora Naka"
          description="Starting Point"
        />

        {/* Marker for Pote College */}
        <Marker
          coordinate={{ latitude: 20.9612, longitude: 77.7737 }}
          title="Pote College"
          description="Destination"
        />

        {/* Route from Kathora Naka to Pote College */}
        <MapViewDirections
          origin={{ latitude: 20.9220, longitude: 77.7587 }}
          destination={{ latitude: 20.9612, longitude: 77.7737 }}
          apikey={"AIzaSyDdyUi-67ydqERmMHRYMemxXci7hLUt5qg"}
          strokeWidth={5}
          strokeColor="blue"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default HomeScreen;
