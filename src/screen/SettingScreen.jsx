import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux'; // Redux hooks
import { fetchUser } from '../redux/authSlice'; // Import the correct thunk
import tw from 'twrnc';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-viewing';
import CustomBottomSheet from '../components/CustomBottomSheet';

const SettingScreen = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth); // Select from auth slice

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(
    'https://cdn3.pixelcut.app/1/3/profile_picture_1728ecf2bd.jpg'
  );
  const [isImageViewVisible, setImageViewVisible] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Update state if user data is available
  useEffect(() => {
    if (user) {
      setUserName(user.userName);
      setEmail(user.email);
      setPhoneNo(user.phoneNo);
      setEnrollNo(user.enrollNumber || 'N/A');
      setBranch(user.branch || 'N/A');
      setYear(user.year || 'N/A');
      setProfileImage(user.profilePicture || profileImage);
    }
  }, [user]);

  // Profile fields
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [enrollNo, setEnrollNo] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');

  const bottomSheetRef = useRef(null);

  const handleEditPress = () => setIsEditing(!isEditing);

  const selectProfileImage = async () => {
    try {
      const croppedImage = await ImageCropPicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
      });
      setProfileImage(croppedImage.path);
      Alert.alert('Success', 'Profile image updated successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to pick or crop the image.');
    }
  };

  const handleBottomSheetOption = (option) => {
    if (option === 'view') {
      setImageViewVisible(true);
    } else if (option === 'edit') {
      selectProfileImage();
    }
    bottomSheetRef.current?.close();
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500`}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={tw`flex-1 bg-white mt-10`}>
        <View style={tw`bg-yellow-400 rounded-b-10 pt-16 pb-5 items-center relative`}>
          <TouchableOpacity onPress={() => bottomSheetRef.current?.open()}>
            <Image
              source={{ uri: profileImage }}
              style={tw`w-30 h-30 rounded-full border-4 border-white`}
            />
          </TouchableOpacity>

          <View style={tw`absolute right-10 top-16`}>
            {isEditing ? (
              <TouchableOpacity onPress={handleEditPress} style={tw`bg-black p-2 rounded-full`}>
                <MaterialIcons name={"save"} size={20} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleEditPress} style={tw`bg-black p-2 rounded-full`}>
                <MaterialIcons name={"edit"} size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <ImageView
            images={[{ uri: profileImage }]}
            imageIndex={0}
            visible={isImageViewVisible}
            onRequestClose={() => setImageViewVisible(false)}
          />

          <Text style={tw`text-black text-xl mt-4`}>{user?.name || 'Rutuja Ghongade'}</Text>
        </View>

        <ScrollView style={tw`flex-1 bg-white mb-15`}>
          <View style={tw`p-6`}>
            <View style={tw`mb-4`}>
              <Text style={tw`text-black text-lg font-bold`}>Username</Text>
              <TextInput
                style={tw`border-b border-gray-300 py-2 text-lg`}
                editable={isEditing}
                value={userName}
                onChangeText={setUserName}
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-black text-lg font-bold`}>Email</Text>
              <TextInput
                style={tw`border-b border-gray-300 py-2 text-lg`}
                editable={isEditing}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-black text-lg font-bold`}>Phone Number</Text>
              <TextInput
                style={tw`border-b border-gray-300 py-2 text-lg`}
                editable={isEditing}
                value={phoneNo}
                onChangeText={setPhoneNo}
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-black text-lg font-bold`}>Enroll Number</Text>
              <TextInput
                style={tw`border-b border-gray-300 py-2 text-lg`}
                editable={isEditing}
                value={enrollNo}
                onChangeText={setEnrollNo}
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-black text-lg font-bold`}>Branch</Text>
              <TextInput
                style={tw`border-b border-gray-300 py-2 text-lg`}
                editable={isEditing}
                value={branch}
                onChangeText={setBranch}
              />
            </View>

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

        <CustomBottomSheet ref={bottomSheetRef} snapPoints={['50%']}>
          <View style={tw`z-10`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4 text-center`}>Profile Options</Text>
            <TouchableOpacity
              onPress={() => handleBottomSheetOption('view')}
              style={tw`mb-4 p-4 bg-gray-200 rounded-lg`}
            >
              <Text style={tw`text-center`}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleBottomSheetOption('edit')}
              style={tw`p-4 bg-gray-200 rounded-lg`}
            >
              <Text style={tw`text-center`}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </CustomBottomSheet>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SettingScreen;
