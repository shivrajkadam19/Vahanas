import React, { useRef, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import tw from 'twrnc'; // Tailwind styling
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Icon for Edit button
import ImageCropPicker from 'react-native-image-crop-picker'; // For image picker
import ImageView from 'react-native-image-viewing'; // For image viewing
import CustomBottomSheet from '../components/CustomBottomSheet'; // Import your CustomBottomSheet

const SettingScreen = () => {
  // State for the profile data
  const [userName, setUserName] = useState('rutuja123');
  const [email, setEmail] = useState('rutuja.ghongade@gmail.com');
  const [phoneNo, setPhoneNo] = useState('+123 456 7890');
  const [enrollNo, setEnrollNo] = useState('EN12345678');
  const [branch, setBranch] = useState('Computer Engineering');
  const [year, setYear] = useState('3rd Year');

  // To handle edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State for profile image
  const [profileImage, setProfileImage] = useState('https://cdn3.pixelcut.app/1/3/profile_picture_1728ecf2bd.jpg');
  const [isImageViewVisible, setImageViewVisible] = useState(false);

  // Reference for the BottomSheet
  const bottomSheetRef = useRef(null);

  // Toggle between view and edit modes
  const handleEditPress = () => {
    setIsEditing(!isEditing);
  };

  // Function to select and crop a new profile image
  const selectProfileImage = async () => {
    try {
      const croppedImage = await ImageCropPicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true, // Make it circular
      });

      // Set the new profile image
      setProfileImage(croppedImage.path);

      Alert.alert('Success', 'Profile image updated successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to pick or crop the image.');
    }
  };

  // Handle bottom sheet option select
  const handleBottomSheetOption = (option) => {
    if (option === 'view') {
      setImageViewVisible(true); // Open image viewer
    } else if (option === 'edit') {
      selectProfileImage(); // Open image picker
    }
    bottomSheetRef.current?.close(); // Close the bottom sheet after selecting an option
  };

  return (
    <View style={tw`flex-1 bg-white mt-10`}>
      {/* Profile Header */}
      <View style={tw`bg-yellow-400 rounded-b-10 pt-16 pb-5 items-center relative`}>
        {/* Profile Picture */}
        <TouchableOpacity onPress={() => bottomSheetRef.current?.open()}>
          <Image
            source={{ uri: profileImage }}
            style={tw`w-30 h-30 rounded-full border-4 border-white`}
          />
        </TouchableOpacity>


        {/* <View style={tw`absolute right-33 top-35`}>
          <TouchableOpacity onPress={handleEditPress} style={tw`bg-white p-2 rounded-full border`}>
            <MaterialIcons name={"add"} size={20} color="black" />
          </TouchableOpacity>
        </View> */}



        {/* Edit Profile Image Button */}
        <View style={tw`absolute right-10 top-16`}>
          {
            isEditing ?
              <TouchableOpacity onPress={handleEditPress} style={tw`bg-black p-2 rounded-full`}>
                <MaterialIcons name={"save"} size={20} color="white" />
              </TouchableOpacity> :
              <TouchableOpacity onPress={handleEditPress} style={tw`bg-black p-2 rounded-full`}>
                <MaterialIcons name={"edit"} size={20} color="white" />
              </TouchableOpacity>
          }

        </View>

        {/* Fullscreen Image Viewer */}
        <ImageView
          images={[{ uri: profileImage }]}
          imageIndex={0}
          visible={isImageViewVisible}
          onRequestClose={() => setImageViewVisible(false)}
        />

        {/* Name */}
        <Text style={tw`text-black text-xl mt-4`}>Rutuja Ghongade</Text>
      </View>

      {/* Editable User Information */}
      <ScrollView style={tw`flex-1 bg-white mb-15`}>
        <View style={tw`p-6`}>
          {/* UserName */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-black text-lg font-bold`}>Username</Text>
            <TextInput
              style={tw`border-b border-gray-300 py-2 text-lg`}
              editable={isEditing}
              value={userName}
              onChangeText={setUserName}
            />
          </View>

          {/* Email */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-black text-lg font-bold`}>Email</Text>
            <TextInput
              style={tw`border-b border-gray-300 py-2 text-lg`}
              editable={isEditing}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Phone Number */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-black text-lg font-bold`}>Phone Number</Text>
            <TextInput
              style={tw`border-b border-gray-300 py-2 text-lg`}
              editable={isEditing}
              value={phoneNo}
              onChangeText={setPhoneNo}
            />
          </View>

          {/* Enroll Number */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-black text-lg font-bold`}>Enroll Number</Text>
            <TextInput
              style={tw`border-b border-gray-300 py-2 text-lg`}
              editable={isEditing}
              value={enrollNo}
              onChangeText={setEnrollNo}
            />
          </View>

          {/* Branch */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-black text-lg font-bold`}>Branch</Text>
            <TextInput
              style={tw`border-b border-gray-300 py-2 text-lg`}
              editable={isEditing}
              value={branch}
              onChangeText={setBranch}
            />
          </View>

          {/* Year */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-black text-lg font-bold`}>Year</Text>
            <TextInput
              style={tw`border-b border-gray-300 py-2 text-lg`}
              editable={isEditing}
              value={year}
              onChangeText={setYear}
            />
          </View>
        </View>
      </ScrollView>

      {/* Custom Bottom Sheet */}
      <CustomBottomSheet ref={bottomSheetRef} snapPoints={['50%']}>
        <View style={tw`z-10`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4 text-center`}>Profile Options</Text>
          <TouchableOpacity onPress={() => handleBottomSheetOption('view')} style={tw`mb-4 p-4 bg-gray-200 rounded-lg`}>
            <Text style={tw`text-center`}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleBottomSheetOption('edit')} style={tw`p-4 bg-gray-200 rounded-lg`}>
            <Text style={tw`text-center`}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>
    </View>
  );
};

export default SettingScreen;
