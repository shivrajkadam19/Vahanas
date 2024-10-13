import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { TextInput, Menu, Divider } from 'react-native-paper';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const App = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header Section */}
      <View style={tw`bg-white h-24 p-6`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => { }} style={tw`mr-4`}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-black text-xl font-semibold`}>Sign Up</Text>
        </View>
      </View>

      {/* Lower Purple Section */}
      <View style={tw`bg-purple-600 h-36 p-6 rounded-t-3xl -mt-6`}>
        <Text style={tw`text-white text-center mt-4 text-lg`}>
          Sign Up to access all the features in Barber Shop
        </Text>
      </View>

      {/* Form Section with Rounded Corners */}
      <View style={tw`bg-white p-6 mt-[-20] rounded-t-3xl shadow-lg rounded-b-3xl`}>
        {/* Full Name Input */}
        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          mode="outlined"
          style={tw`mb-4`}
          placeholder="Enter Full Name"
          theme={{ colors: { primary: '#6200EE', underlineColor: 'transparent' } }}
        />

        {/* Email Input */}
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={tw`mb-4`}
          placeholder="Enter Email"
          keyboardType="email-address"
          theme={{ colors: { primary: '#6200EE', underlineColor: 'transparent' } }}
        />

        {/* Phone Number Input */}
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          mode="outlined"
          style={tw`mb-4`}
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
          theme={{ colors: { primary: '#6200EE', underlineColor: 'transparent' } }}
        />

        {/* Password Input */}
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          style={tw`mb-4`}
          placeholder="Enter Password"
          right={
            <TextInput.Icon
              name={showPassword ? 'eye-off' : 'eye'}
              onPress={togglePasswordVisibility}
            />
          }
          theme={{ colors: { primary: '#6200EE', underlineColor: 'transparent' } }}
        />

        {/* Gender Dropdown */}
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TextInput
              label="Gender"
              value={gender}
              mode="outlined"
              style={tw`mb-4`}
              placeholder="Select Gender"
              onFocus={openMenu} // Open menu on focus
              theme={{ colors: { primary: '#6200EE', underlineColor: 'transparent' } }}
            />
          }
        >
          <Menu.Item onPress={() => { setGender('Male'); closeMenu(); }} title="Male" />
          <Divider />
          <Menu.Item onPress={() => { setGender('Female'); closeMenu(); }} title="Female" />
          <Divider />
          <Menu.Item onPress={() => { setGender('Other'); closeMenu(); }} title="Other" />
        </Menu>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={tw`mt-6 py-3 bg-purple-600 rounded-full items-center`}
          onPress={() => { }}
        >
          <Text style={tw`text-white text-lg font-semibold`}>Sign Up</Text>
        </TouchableOpacity>

        {/* Footer Section */}
        <View style={tw`flex-row justify-center mt-6`}>
          <Text style={tw`text-gray-500`}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => { }}>
            <Text style={tw`text-purple-600 font-semibold`}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default App;
