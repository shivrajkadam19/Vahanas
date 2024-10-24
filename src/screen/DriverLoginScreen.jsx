import React, { useState } from 'react';
import { View, Alert, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import auth from '@react-native-firebase/auth';
import { databaseInstance } from './firebaseConfig';

const DriverLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Both fields are required.');
      return;
    }

    try {
      setLoading(true);
      const result = await auth().signInWithEmailAndPassword(email, password);
      Alert.alert('Login Successful', 'Location sharing started.');
      startSharingLocation(result.user.uid);
      navigation.replace('Main'); // Navigate to main screen
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const startSharingLocation = (uid) => {
    Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationRef = databaseInstance.ref(`/drivers/${uid}/location`);
        locationRef.set({ latitude, longitude });
      },
      (error) => console.error('Location Error:', error),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );
  };
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <View style={tw`flex-1 bg-white p-6`}>
      <View style={tw`flex-row items-center mb-6`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-black text-xl font-semibold`}>Driver Login</Text>
      </View>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        placeholder="Enter your email"
        style={tw`mb-4`}
        theme={{ colors: { primary: '#6200EE' } }}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry={!showPassword}
        placeholder="Enter your password"
        style={tw`mb-6`}
        theme={{ colors: { primary: '#6200EE' } }}
        right={
          <TextInput.Icon
            icon={() => (
              <MaterialIcon
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={24}
                color="black"
                onPress={togglePasswordVisibility}
              />
            )}
          />
        }
      />

      <TouchableOpacity
        style={tw`py-3 bg-purple-600 rounded-full items-center`}
        onPress={navigation.navigate('DriverScreen')}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={tw`text-white text-lg font-semibold`}>Log In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DriverLoginScreen;
