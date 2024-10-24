import React from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import tw from 'twrnc'; // Tailwind styling
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Vector icons
import { useDispatch } from 'react-redux'; // Redux dispatch
import { logoutUser } from '../redux/authSlice'; // Logout action

const CustomAppBar = ({ navigation, title }) => {
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get('window').width; // Get screen width for centering

  // Logout handler
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(logoutUser()).unwrap(); // Dispatch logout action
              navigation.replace('Auth'); // Navigate to Login screen
            } catch (error) {
              console.error('Logout Error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View
      style={[
        tw`bg-purple-600 z-10 p-6 justify-between flex-row items-center absolute w-full rounded-b-10 h-20`,
      ]}
    >
      {/* Title Centered */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          alignItems: 'center',
        }}
      >
        <Text style={tw`text-white text-3xl`}>{title}</Text>
      </View>

      {/* Logout Button on the Right */}
      <TouchableOpacity onPress={handleLogout} style={tw`mr-2 ml-auto`}>
        <FontAwesome5 name="sign-out-alt" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomAppBar;
