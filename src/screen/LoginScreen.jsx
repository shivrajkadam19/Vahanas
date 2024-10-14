import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { TextInput, Switch } from 'react-native-paper';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const LoginScreen = ({navigation}) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveMe, setSaveMe] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header Section */}
      <View style={tw`bg-white h-24 p-6`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => {}} style={tw`mr-4`}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-black text-xl font-semibold`}>Log In</Text>
        </View>
      </View>

      {/* Lower Purple Section */}
      <View style={tw`bg-purple-600 h-36 p-6 rounded-t-3xl -mt-6`}>
        <Text style={tw`text-white text-center mt-4 text-lg`}>
          Login to your account to access all the features in Barber Shop
        </Text>
      </View>

      {/* Form Section */}
      <View style={tw`bg-white p-6 -mt-6 rounded-t-3xl rounded-b-3xl`}>
        {/* Email/Phone Input */}
        <TextInput
          label="Email / Phone Number"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          mode="outlined"
          style={tw`mb-4`}
          placeholder="Enter Email / Phone Number"
          theme={{ colors: { primary: '#6200EE', underlineColor: 'transparent' } }}
        />

        {/* Password Input */}
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          style={tw`mb-2`}
          placeholder="Enter Password"
          right={
            <TextInput.Icon
              name={showPassword ? 'eye-off' : 'eye'}
              onPress={togglePasswordVisibility}
            />
          }
          theme={{ colors: { primary: '#6200EE', underlineColor: 'transparent' } }}
        />

        {/* Save Me and Forgot Password Section */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <View style={tw`flex-row items-center`}>
            <Switch
              value={saveMe}
              onValueChange={() => setSaveMe(!saveMe)}
              color="#6200EE"
            />
            <Text style={tw`ml-2 text-gray-700`}>Save Me</Text>
          </View>
          <TouchableOpacity onPress={() => {}}>
            <Text style={tw`text-purple-600`}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Log In Button */}
        <TouchableOpacity
          style={tw`py-3 bg-purple-600 rounded-full items-center`}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={tw`text-white text-lg font-semibold`}>Log In</Text>
        </TouchableOpacity>

        {/* Sign Up Section */}
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
