import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, Keyboard } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const OtpScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to the next input field automatically
    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const clearInputs = () => {
    setOtp(['', '', '', '']);
    inputRefs.current[0].focus();
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join('');
    console.log('OTP Entered:', enteredOtp);
    Keyboard.dismiss(); // Dismiss the keyboard
    // Add your OTP verification logic here
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header Section */}
      <View style={tw`bg-white h-24 p-6`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-black text-xl font-semibold`}>Enter OTP</Text>
        </View>
      </View>

      {/* Lower Purple Section */}
      <View style={tw`bg-purple-600 h-36 p-6 rounded-t-3xl -mt-6`}>
        <Text style={tw`text-white text-center mt-4 text-lg`}>
          Please enter the 4-digit OTP sent to your phone
        </Text>
      </View>

      {/* OTP Input Section */}
      <View style={tw`bg-white p-6 -mt-6 rounded-t-3xl rounded-b-3xl`}>
        <View style={tw`flex-row justify-between items-center mt-10`}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={value}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleBackspace(e, index)}
              keyboardType="numeric"
              maxLength={1}
              style={[
                tw`border-2 border-gray-300 rounded-xl text-center`,
                { width: width * 0.15, height: 60, fontSize: 24 },
              ]}
            />
          ))}
        </View>

        {/* Clear and Verify Buttons */}
        <View style={tw`flex-row justify-between mt-12`}>
          <TouchableOpacity
            style={tw`py-3 px-8 bg-gray-200 rounded-full items-center`}
            onPress={clearInputs}
          >
            <Text style={tw`text-black font-semibold`}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`py-3 px-8 bg-purple-600 rounded-full items-center`}
            onPress={verifyOtp}
          >
            <Text style={tw`text-white font-semibold`}>Verify OTP</Text>
          </TouchableOpacity>
        </View>

        {/* Resend OTP Section */}
        <View style={tw`flex-row justify-center mt-8`}>
          <Text style={tw`text-gray-500`}>Didn't receive the OTP? </Text>
          <TouchableOpacity onPress={() => console.log('Resend OTP')}>
            <Text style={tw`text-purple-600 font-semibold`}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OtpScreen;
