// CustomTabBar.js
import React from 'react';
import { View, TouchableOpacity, Text, Dimensions, Platform } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable'; // For animations

const { width } = Dimensions.get('window'); // Get screen width

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#9333EA',
        height: 70,
        justifyContent: 'space-around',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        position: 'absolute',
        bottom: 0,
        width: width,
      }}
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

        const iconNames = ['home', 'user-cog']; // Customize icons based on index
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
              animation={isFocused ? 'pulse' : undefined} // Pulse effect for active tabs
              duration={500}
              easing="ease-out"
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: isFocused ? 70 : 50, // Adjust icon size when focused
                height: isFocused ? 70 : 50,
                borderRadius: isFocused ? 35 : 25, // Circle border when focused
                backgroundColor: isFocused ? 'white' : 'transparent', // Reversed color on focus
                borderWidth: isFocused ? 4 : 0, // Border around active icon
                borderColor: '#9333EA', // Same color as the tab bar
                marginBottom: isFocused ? 30 : 5, // Smooth margin adjustment
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 5, // Elevation for shadow (Android)
              }}
            >
              <FontAwesome5
                name={iconName}
                size={isFocused ? 30 : 24}
                color={isFocused ? '#9333EA' : '#EDE9FE'} // Purple icon for active tab
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
