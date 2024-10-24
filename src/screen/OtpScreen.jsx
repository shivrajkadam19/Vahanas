import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { registerUser, sendOtp } from '../redux/authSlice'; // Import sendOtp and registerUser
import * as Keychain from 'react-native-keychain'; // Import Keychain for secure token storage

const { width } = Dimensions.get('window');

const OtpScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false); 

  const inputRefs = useRef([]);
  const dispatch = useDispatch();

  const { formData } = route.params || {};
  console.log('Received Form Data:', formData);

  const handleChangeText = (text, index) => {
    if (/[^0-9]/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

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

  const storeTokenSecurely = async (token) => {
    try {
      await Keychain.setGenericPassword('auth', token, {
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
      console.log('Token stored successfully in Keychain.');
    } catch (error) {
      console.error('Failed to store token:', error);
      Alert.alert('Error', 'Failed to securely store token.');
    }
  };

  const verifyOtpAndRegister = async () => {
    const enteredOtp = otp.join('');
    Keyboard.dismiss();

    if (enteredOtp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter a complete 4-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await dispatch(
        registerUser({ formData, otp: enteredOtp })
      ).unwrap();

      await storeTokenSecurely(token); // Store token securely in Keychain
      console.log('User registered successfully:', user);

      Alert.alert('Success', 'You have successfully registered!', [
        { text: 'OK', onPress: () => navigation.navigate('Main') },
      ]);
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Registration Failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setResendDisabled(true); 
    dispatch(sendOtp({ email: formData.email, phoneNumber: formData.phoneNo }))
      .unwrap()
      .then(() => {
        Alert.alert('Success', 'OTP has been resent.');
      })
      .catch((error) => {
        console.error('OTP Resend Error:', error);
        Alert.alert('Error', 'Failed to resend OTP.');
      })
      .finally(() => {
        setTimeout(() => setResendDisabled(false), 60000); 
      });
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`bg-white h-24 p-6`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`text-black text-xl font-semibold`}>Enter OTP</Text>
        </View>
      </View>

      <View style={tw`bg-purple-600 h-36 p-6 rounded-t-3xl -mt-6`}>
        <Text style={tw`text-white text-center mt-4 text-lg`}>
          Please enter the 4-digit OTP sent to your phone
        </Text>
      </View>

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

        <View style={tw`flex-row justify-between mt-12`}>
          <TouchableOpacity
            style={tw`py-3 px-8 bg-gray-200 rounded-full items-center`}
            onPress={clearInputs}
          >
            <Text style={tw`text-black font-semibold`}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`py-3 px-8 bg-purple-600 rounded-full items-center`}
            onPress={verifyOtpAndRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-white font-semibold`}>Verify OTP</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={tw`flex-row justify-center mt-8`}>
          <Text style={tw`text-gray-500`}>Didn't receive the OTP? </Text>
          <TouchableOpacity onPress={handleResendOtp} disabled={resendDisabled}>
            <Text
              style={[
                tw`font-semibold`,
                { color: resendDisabled ? 'gray' : '#6200EE' },
              ]}
            >
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OtpScreen;
