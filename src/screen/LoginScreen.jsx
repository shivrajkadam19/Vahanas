import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Switch } from 'react-native-paper';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/authSlice';  
import * as Keychain from 'react-native-keychain';  // Import Keychain for secure storage

const LoginScreen = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveMe, setSaveMe] = useState(false);

  const dispatch = useDispatch();
  const { user, error, loading } = useSelector((state) => state.auth);

  // Handle login
  const handleLogin = async () => {
    console.log('Attempting login with:', { emailOrPhone, password });
    if (!emailOrPhone || !password) {
      Alert.alert('Validation Error', 'Both fields are required.');
      return;
    }

    const response = await dispatch(loginUser({ email: emailOrPhone, password }));
    if (response.meta.requestStatus === 'fulfilled' && saveMe) {
      // Store credentials securely if Save Me is enabled
      await Keychain.setGenericPassword(emailOrPhone, password);
    }
  };

  // Fetch saved credentials on mount (if available)
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

  // Handle user login success or error
  useEffect(() => {
    if (user) {
      console.log('Login successful:', user);
      navigation.navigate('Main');
    }
    if (error) {
      console.error('Login failed:', error);
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

      {/* Lower Purple Section */}
      <View style={tw`bg-purple-600 h-36 p-6 rounded-t-3xl -mt-6`}>
        <Text style={tw`text-white text-center mt-4 text-lg`}>
          Login to your account to access all the features in Bus Tracker
        </Text>
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
