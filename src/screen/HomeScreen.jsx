import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions'; // Directions library
import { databaseInstance } from './firebaseConfig.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'twrnc'; // Tailwind utility for styling

const GOOGLE_MAPS_API_KEY = 'AIzaSyDdyUi-67ydqERmMHRYMemxXci7hLUt5qg'; // Replace with your API key

const HomeScreen = () => {
  const [busLocation, setBusLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  const kathoraNaka = { latitude: 20.96084501096055, longitude: 77.75715980357701 };
  const poteCollege = { latitude: 20.987798675355773, longitude: 77.75748610275781 };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted.');
        getUserLocation();
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to display your location.'
        );
      }
    } catch (err) {
      console.warn('Error requesting location permission:', err);
    }
  };

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        // Do not focus on the user location, only update the marker
        console.log('User location updated:', latitude, longitude);
      },
      (error) => {
        console.log('Location Error:', error);
        Alert.alert('Location Error', 'Unable to fetch your location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    requestLocationPermission(); // Request permission on mount

    const locationRef = databaseInstance.ref('/busLocation');
    const listener = locationRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const { latitude, longitude } = data;
        setBusLocation({ latitude, longitude });

        // Animate the camera to the bus location
        mapRef.current?.animateCamera(
          { center: { latitude, longitude }, zoom: 15 },
          { duration: 1000 }
        );
      } else {
        Alert.alert('No Bus Found', 'The bus/driver location is not available at the moment.');
      }
    });

    return () => locationRef.off('value', listener); // Cleanup on unmount
  }, []);

  const focusRouteArea = () => {
    const coordinates = [kathoraNaka, poteCollege]; // Route coordinates
    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, // Add padding around the route
      animated: true,
    });
  };

  // Focus the route when the map is ready
  const onMapReady = () => {
    focusRouteArea(); // Automatically focus the route area
  };

  return (
    <View style={tw`flex-1`}>
      <MapView
        ref={mapRef}
        style={tw`flex-1`}
        showsUserLocation={true} // Show the user marker
        onMapReady={onMapReady} // Focus route area when map loads
        initialRegion={{
          latitude: kathoraNaka.latitude,
          longitude: kathoraNaka.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Draw Directions between Kathora Naka and Pote College */}
        <MapViewDirections
          origin={kathoraNaka}
          destination={poteCollege}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={4}
          strokeColor="#007bff"
          onError={(error) => {
            console.log('Directions Error:', error);
            Alert.alert('Directions Error', 'Unable to fetch directions.');
          }}
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker coordinate={userLocation}>
            <View style={tw`items-center`}>
              <Icon name="user-circle" size={40} color="#007bff" />
              <Text style={tw`text-black font-bold mt-1`}>Me</Text>
            </View>
          </Marker>
        )}

        {/* Bus Location Marker */}
        {busLocation && (
          <Marker coordinate={busLocation}>
            <View style={tw`items-center`}>
              <Icon name="bus" size={40} color="#ff5733" />
              <Text style={tw`text-black font-bold mt-1`}>Bus</Text>
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
};

export default HomeScreen;
