import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomBottomSheet from '../components/CustomBottomSheet';
import { TextInput, RadioButton, Snackbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { sendOtp } from '../redux/authSlice';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [visible, setVisible] = useState(false); // Snackbar visibility

  const bottomSheetRef = useRef(null);
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const isValidEmail = (email) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

  const isValidPhoneNumber = (number) => /^\d{10}$/.test(number);

  const showError = (message) => {
    setErrorMessage(message);
    setVisible(true); // Show Snackbar
  };

  const handleSendOtp = async () => {
    try {
      Keyboard.dismiss();

      if (
        !fullName.trim() ||
        !email.trim() ||
        !phoneNumber.trim() ||
        !password.trim() ||
        !gender
      ) {
        showError('All fields are required.');
        return;
      }

      if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
      }

      if (!isValidPhoneNumber(phoneNumber)) {
        showError('Please enter a valid 10-digit phone number.');
        return;
      }

      const formData = {
        userName: fullName.trim(),
        email: email.trim(),
        phoneNo: phoneNumber.trim(),
        password: password.trim(),
        gender,
      };

      setLoading(true);

      await dispatch(sendOtp({ email, phoneNumber, formData })).unwrap();
      console.log('OTP sent successfully');

      navigation.navigate('OtpScreen', { formData });
    } catch (error) {
      console.error('OTP sending failed:', error);
      showError(error.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={tw`flex-1 bg-white`}>
        <View style={tw`bg-white h-24 p-6`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tw`mr-4`}
            >
              <FontAwesome name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={tw`text-black text-xl font-semibold`}>Sign Up</Text>
          </View>
        </View>

        <View style={tw`bg-purple-600 h-36 p-6 rounded-t-3xl -mt-6`}>
          <Text style={tw`text-white text-center mt-4 text-lg`}>
            Sign up to access all the features in Barber Shop
          </Text>
        </View>

        <View style={tw`bg-white p-6 -mt-6 rounded-t-3xl rounded-b-3xl`}>
          <ScrollView
            contentContainerStyle={tw`flex-grow`}
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              placeholder="Enter Full Name"
              style={tw`mb-4`}
              theme={{ colors: { primary: '#6200EE' } }}
            />

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

            <TouchableOpacity
              style={tw`border border-gray-300 p-4 rounded-lg mb-4`}
              onPress={() => bottomSheetRef.current?.open()}
            >
              <Text style={tw`text-gray-600`}>{gender || 'Select Gender'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`mt-6 py-3 bg-purple-600 rounded-full items-center`}
              onPress={handleSendOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={tw`text-white text-lg font-semibold`}>
                  Send OTP
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <CustomBottomSheet ref={bottomSheetRef} snapPoints={['45%']}>
        <View style={tw`p-6 bg-white rounded-t-3xl`}>
          <Text style={tw`text-lg font-semibold mb-4 text-center text-gray-800`}>
            Select Gender
          </Text>

          <RadioButton.Group onValueChange={setGender} value={gender}>
            {['Male', 'Female', 'Other'].map((option) => (
              <TouchableOpacity
                key={option}
                style={tw`flex-row items-center justify-between py-3 px-4 border-b border-gray-200`}
                onPress={() => setGender(option)}
              >
                <Text style={tw`text-gray-700 text-lg`}>{option}</Text>
                <RadioButton value={option} />
              </TouchableOpacity>
            ))}
          </RadioButton.Group>

          <TouchableOpacity
            style={tw`mt-6 py-3 bg-purple-600 rounded-full items-center`}
            onPress={() => bottomSheetRef.current?.close()}
          >
            <Text style={tw`text-white text-lg font-semibold`}>Done</Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={tw`bg-red-600`}
      >
        {errorMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
