import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Pressable } from 'react-native';
import { TextInput, Switch } from 'react-native-paper';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/authSlice';
import * as Keychain from 'react-native-keychain';

const LoginScreen = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveMe, setSaveMe] = useState(false);

  const dispatch = useDispatch();
  const { user, error, loading } = useSelector((state) => state.auth);

  // Track taps for the hidden page navigation
  const tapCounter = useRef(0);
  const timer = useRef(null);

  const handleTripleTap = () => {
    tapCounter.current += 1;
    console.log(`Tap count: ${tapCounter.current}`); // Log current tap count

    if (!timer.current) {
      timer.current = setTimeout(() => {
        console.log('Resetting tap counter'); // Log when counter resets
        tapCounter.current = 0;
        timer.current = null;
      }, 500); // Adjust timeout for tap sensitivity
    }

    if (tapCounter.current === 3) {
      console.log('Triple tap detected! Navigating to DriverLogin'); // Log when triple tap is detected
      tapCounter.current = 0; // Reset counter
      clearTimeout(timer.current);
      timer.current = null;
      navigation.navigate('DriverLogin'); // Navigate to Driver Login screen
    }
  };


  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert('Validation Error', 'Both fields are required.');
      return;
    }

    const response = await dispatch(loginUser({ email: emailOrPhone, password }));
    if (response.meta.requestStatus === 'fulfilled' && saveMe) {
      await Keychain.setGenericPassword(emailOrPhone, password);
    }
  };

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          setEmailOrPhone(credentials.username);
          setPassword(credentials.password);
          setSaveMe(true);
        }
      } catch (e) {
        console.error('Failed to load credentials:', e);
      }
    };
    loadCredentials();
  }, []);

  useEffect(() => {
    if (user) {
      navigation.navigate('Main');
    }
    if (error) {
      Alert.alert('Login Error', error, [{ text: 'OK', onPress: () => dispatch(clearError()) }]);
    }
  }, [user, error]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header Section */}
      <View style={tw`bg-white h-24 p-6`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-black text-xl font-semibold`}>Log In</Text>
        </View>
      </View>

      {/* Hidden Tap Area for Driver Login */}


      {/* Lower Purple Section */}
      <View style={tw`bg-purple-600 h-36 p-6 rounded-t-3xl -mt-6`}>
        <TouchableOpacity onPress={handleTripleTap} >
          <Text style={tw`text-white text-center mt-4 text-lg`}>
            Login to your account to access all the features in Bus Tracker
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Section */}
      <View style={tw`bg-white p-6 -mt-6 rounded-t-3xl rounded-b-3xl`}>
        <TextInput
          label="Email / Phone Number"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          mode="outlined"
          placeholder="Enter Email / Phone Number"
          style={tw`mb-4`}
          theme={{ colors: { primary: '#6200EE' } }}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          placeholder="Enter Password"
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
          style={tw`mb-2`}
          theme={{ colors: { primary: '#6200EE' } }}
        />

        <View style={tw`flex-row justify-between items-center mb-6`}>
          <View style={tw`flex-row items-center`}>
            <Switch
              value={saveMe}
              onValueChange={() => setSaveMe(!saveMe)}
              color="#6200EE"
            />
            <Text style={tw`ml-2 text-gray-700`}>Save Me</Text>
          </View>
          <TouchableOpacity>
            <Text style={tw`text-purple-600`}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={tw`py-3 bg-purple-600 rounded-full items-center`}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={tw`text-white text-lg font-semibold`}>Log In</Text>
          )}
        </TouchableOpacity>

        <View style={tw`flex-row justify-center mt-6`}>
          <Text style={tw`text-gray-500`}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={tw`text-purple-600 font-semibold`}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
