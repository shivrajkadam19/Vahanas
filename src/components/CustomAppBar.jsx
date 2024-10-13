import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc'; // Tailwind styling
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Vector icons

const CustomAppBar = ({ navigation, title }) => {
  return (
    <View style={tw`bg-black z-10 p-6 justify-center flex-row items-center absolute w-full rounded-b-10 h-20`}>
      {/* <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesome5 name="arrow-left" size={24} color="white" />
      </TouchableOpacity> */}
      
      <Text style={tw`text-white text-3xl`}>{title}</Text>
      
      {/* <TouchableOpacity onPress={() => navigation.openDrawer && navigation.openDrawer()}>
        <FontAwesome5 name="bars" size={24} color="white" />
      </TouchableOpacity> */}
    </View>
  );
};

export default CustomAppBar;
