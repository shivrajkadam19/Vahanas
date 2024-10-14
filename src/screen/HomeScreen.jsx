import React from 'react'
import { View,Text } from 'react-native'
import tw from 'twrnc'

const HomeScreen = () => {
  return (
    <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-9xl`}>Home</Text>
    </View>
  )
}

export default HomeScreen