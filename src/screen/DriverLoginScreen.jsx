import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import auth from '@react-native-firebase/auth'; // Firebase Auth
import Geolocation from 'react-native-geolocation-service';
import { databaseInstance } from './firebaseConfig'; // Firebase Database

const DriverLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [driverId, setDriverId] = useState(null); // Track driver ID after login

  const handleLogin = async () => {
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);
      setDriverId(result.user.uid); // Save the driver ID
      Alert.alert('Login Successful', 'Location sharing started.');

      startSharingLocation(result.user.uid); // Start sharing location
      // navigation.replace('Main'); // Navigate to Main User Area after login
      console.log("success")
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error.message);
    }
  };

  const startSharingLocation = (uid) => {
    Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationRef = databaseInstance.ref(`/drivers/${uid}/location`);
        locationRef.set({ latitude, longitude }); // Store in Firebase
      },
      (error) => {
        console.error('Location Error:', error);
      },
      { enableHighAccuracy: true, distanceFilter: 10 }
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Driver Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default DriverLoginScreen;
