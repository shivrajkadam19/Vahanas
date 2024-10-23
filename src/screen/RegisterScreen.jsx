import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import tw from 'twrnc';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomBottomSheet from '../components/CustomBottomSheet';
import { TextInput, RadioButton } from 'react-native-paper';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const bottomSheetRef = useRef(null);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={tw`flex-1 bg-white`}>
        {/* Header Section */}
        <View style={tw`bg-white h-24 p-6`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
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

        {/* Form Section */}
        <View style={tw`bg-white p-6 -mt-6 rounded-t-3xl rounded-b-3xl`}>
          <ScrollView contentContainerStyle={tw`flex-grow`} keyboardShouldPersistTaps="handled">
            {/* Full Name Input */}
            <TextInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              placeholder="Enter Full Name"
              style={tw`mb-4`}
              theme={{ colors: { primary: '#6200EE' } }}
            />

            {/* Email Input */}
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              placeholder="Enter Email"
              keyboardType="email-address"
              style={tw`mb-4`}
              theme={{ colors: { primary: '#6200EE' } }}
            />

            {/* Phone Number Input */}
            <TextInput
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              mode="outlined"
              placeholder="Enter Phone Number"
              keyboardType="phone-pad"
              style={tw`mb-4`}
              theme={{ colors: { primary: '#6200EE' } }}
            />

            {/* Password Input */}
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
              style={tw`mb-4`}
              theme={{ colors: { primary: '#6200EE' } }}
            />

            {/* Gender Selection */}
            <TouchableOpacity
              style={tw`border border-gray-300 p-4 rounded-lg mb-4`}
              onPress={() => bottomSheetRef.current?.open()}
            >
              <Text style={tw`text-gray-600`}>{gender || 'Select Gender'}</Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={tw`mt-6 py-3 bg-purple-600 rounded-full items-center`}
              onPress={() => navigation.navigate('OtpScreen')}
            >
              <Text style={tw`text-white text-lg font-semibold`}>Send OTP</Text>
            </TouchableOpacity>

            {/* Footer Section */}
            <View style={tw`flex-row justify-center mt-6`}>
              <Text style={tw`text-gray-500`}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={tw`text-purple-600 font-semibold`}>Log In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Custom Bottom Sheet for Gender Selection */}
      <CustomBottomSheet ref={bottomSheetRef} snapPoints={['45%']}>
        <View style={tw`p-6 bg-white rounded-t-3xl`}>
          <Text style={tw`text-lg font-semibold mb-4 text-center text-gray-800`}>
            Select Gender
          </Text>

          <RadioButton.Group onValueChange={value => setGender(value)} value={gender}>
            <TouchableOpacity
              style={tw`flex-row items-center justify-between py-3 px-4 border-b border-gray-200`}
              onPress={() => setGender('Male')}
            >
              <Text style={tw`text-gray-700 text-lg`}>Male</Text>
              <RadioButton value="Male" />
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center justify-between py-3 px-4 border-b border-gray-200`}
              onPress={() => setGender('Female')}
            >
              <Text style={tw`text-gray-700 text-lg`}>Female</Text>
              <RadioButton value="Female" />
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center justify-between py-3 px-4`}
              onPress={() => setGender('Other')}
            >
              <Text style={tw`text-gray-700 text-lg`}>Other</Text>
              <RadioButton value="Other" />
            </TouchableOpacity>
          </RadioButton.Group>

          <TouchableOpacity
            style={tw`mt-6 py-3 bg-purple-600 rounded-full items-center`}
            onPress={() => bottomSheetRef.current?.close()}
          >
            <Text style={tw`text-white text-lg font-semibold`}>Done</Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
