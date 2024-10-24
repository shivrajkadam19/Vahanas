// CustomTabBar.js
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { View, TouchableOpacity, Text, Dimensions, Platform, Keyboard } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable'; // For animations

const { width } = Dimensions.get('window'); // Get screen width

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  if (isKeyboardVisible) return null; // Hide tab bar when keyboard is open

  return (
    <View
      style={[
        tw`rounded-t-10`,
        {
          flexDirection: 'row',
          backgroundColor: '#9333EA',
          height: 70,
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          position: 'absolute',
          bottom: 0,
          width: width,
          zIndex: 1, // Ensure tab bar is always above other content
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const iconNames = ['home', 'user-cog','home']; // Customize icons based on index
        const iconName = iconNames[index];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Animatable.View
              animation={isFocused ? 'pulse' : undefined}
              duration={500}
              easing="ease-out"
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: isFocused ? 70 : 50,
                height: isFocused ? 70 : 50,
                borderRadius: isFocused ? 35 : 25,
                backgroundColor: isFocused ? 'white' : 'transparent',
                borderWidth: isFocused ? 4 : 0,
                borderColor: '#9333EA',
                marginBottom: isFocused ? 30 : 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <FontAwesome5
                name={iconName}
                size={isFocused ? 30 : 24}
                color={isFocused ? '#9333EA' : '#EDE9FE'}
              />
              {isFocused && (
                <Text style={{ fontSize: 12, color: '#9333EA', marginTop: 5 }}>
                  {label}
                </Text>
              )}
            </Animatable.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
