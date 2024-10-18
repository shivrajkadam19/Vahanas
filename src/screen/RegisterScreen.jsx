import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import tw from 'twrnc';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomBottomSheet from '../components/CustomBottomSheet'; // Import the bottom sheet component
import { RadioButton } from 'react-native-paper'; // Ensure you're using a basic radio button

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
        <ScrollView contentContainerStyle={tw`flex-grow`} keyboardShouldPersistTaps="handled">
          {/* Lower Purple Section */}
          <View style={tw`bg-purple-600 h-36 p-6 rounded-t-3xl -mt-6`}>
            <Text style={tw`text-white text-center mt-4 text-lg`}>
              Sign Up to access all the features in Barber Shop
            </Text>
          </View>

          {/* Form Section with Rounded Corners */}
          <View style={tw`bg-white p-6 mt-[-20] rounded-t-3xl rounded-b-3xl`}>
            {/* Full Name Input */}
            <Text style={tw`text-lg text-gray-600 mb-2`}>Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter Full Name"
              style={tw`border border-gray-300 p-4 rounded-lg mb-4`}
              placeholderTextColor="#999"
            />

            {/* Email Input */}
            <Text style={tw`text-lg text-gray-600 mb-2`}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter Email"
              keyboardType="email-address"
              style={tw`border border-gray-300 p-4 rounded-lg mb-4`}
              placeholderTextColor="#999"
            />

            {/* Phone Number Input */}
            <Text style={tw`text-lg text-gray-600 mb-2`}>Phone Number</Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter Phone Number"
              keyboardType="phone-pad"
              style={tw`border border-gray-300 p-4 rounded-lg mb-4`}
              placeholderTextColor="#999"
            />

            {/* Password Input */}
            <Text style={tw`text-lg text-gray-600 mb-2`}>Password</Text>
            <View style={tw`flex-row items-center border border-gray-300 px-4 py-2 rounded-lg mb-4`}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter Password"
                secureTextEntry={!showPassword}
                style={tw`flex-1`}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <MaterialIcon name={showPassword ? 'visibility' : 'visibility-off'} size={20} color="#999" />
              </TouchableOpacity>
            </View>

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
              onPress={() => navigation.navigate('Main')}
            >
              <Text style={tw`text-white text-lg font-semibold`}>Sign Up</Text>
            </TouchableOpacity>

            {/* Footer Section */}
            <View style={tw`flex-row justify-center mt-6`}>
              <Text style={tw`text-gray-500`}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={tw`text-purple-600 font-semibold`}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>


      {/* Custom Bottom Sheet for Gender Selection */}
      <CustomBottomSheet ref={bottomSheetRef} snapPoints={['40%']}>
        <View style={tw`p-4`}>
          <Text style={tw`text-lg font-semibold mb-4`}>Select Gender</Text>
          <RadioButton.Group onValueChange={value => setGender(value)} value={gender}>
            <View style={tw`flex-row items-center mb-2`}>
              <RadioButton value="Male" />
              <Text>Male</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <RadioButton value="Female" />
              <Text>Female</Text>
            </View>
            <View style={tw`flex-row items-center mb-2`}>
              <RadioButton value="Other" />
              <Text>Other</Text>
            </View>
          </RadioButton.Group>
          <TouchableOpacity
            style={tw`mt-4 py-3 bg-purple-600 rounded-full items-center`}
            onPress={() => bottomSheetRef.current?.close()}
          >
            <Text style={tw`text-white text-lg font-semibold`}>Done</Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>
    </KeyboardAvoidingView >
  );
};

export default RegisterScreen;
