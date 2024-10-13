import React from 'react';
import { View, Dimensions } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LottieView from 'lottie-react-native';
import { Text } from 'react-native-paper';
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: 'slide1',
    title: 'Welcome to the App',
    text: 'This is the first step of the onboarding process.',
    animation: require('./src/assets/animation1.json'),
  },
  {
    key: 'slide2',
    title: 'Stay Connected',
    text: 'Stay connected with your friends and family.',
    animation: require('./src/assets/animation2.json'),
  },
  {
    key: 'slide3',
    title: 'Explore More',
    text: 'Discover more features and content.',
    animation: require('./src/assets/Animation3.json'),
  },
];

const App = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={tw`flex-1 bg-white`}>
      {/* Upper Purple Section */}
      <View style={tw`bg-purple-600 h-48 p-6`}>
        <View style={tw`flex-row items-center justify-center`}>
          <Text style={tw`text-white text-xl font-semibold`}>
            {item.title}
          </Text>
        </View>
      </View>

      {/* Animation and Text Section with Rounded Corners */}
      <View style={tw`bg-white p-6 -mt-6 rounded-t-3xl flex-1 items-center`}>
        <LottieView
          source={item.animation}
          autoPlay
          loop
          style={tw`w-[${width * 0.8}px] h-[${height * 0.4}px] mb-8`}
        />
        <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-2`}>
          {item.title}
        </Text>
        <Text style={tw`text-lg text-gray-600 text-center px-5`}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={() => navigation.replace('Login')}
      showSkipButton={true}
      onSkip={() => navigation.replace('Login')}
      renderSkipButton={() => (
        <Text variant="bodyLarge" style={tw`text-blue-400 text-2xl`}>
          Skip
        </Text>
      )}
      renderDoneButton={() => (
        <Text variant="bodyLarge" style={tw`text-blue-400 text-2xl`}>
          Done
        </Text>
      )}
      renderNextButton={() => (
        <Text variant="bodyLarge" style={tw`text-blue-400 text-2xl`}>
          Next
        </Text>
      )}
    />
  );
};

export default App;
