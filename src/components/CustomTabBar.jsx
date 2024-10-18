// CustomTabBar.js

import React from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable'; // For animations

const { width } = Dimensions.get('window'); // Get screen width

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 80,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        width: width,
      }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const iconNames = [
          'newspaper',
          'file-alt',
          'calendar-alt',
          'smile',
          'user',
        ];
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
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Animatable.View
              animation={isFocused ? 'bounceIn' : undefined}
              duration={800}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: isFocused ? 60 : 50,
                height: isFocused ? 60 : 50,
                borderRadius: 30,
                backgroundColor: isFocused ? '#E0E7FF' : 'transparent',
              }}>
              <FontAwesome5
                name={iconName}
                size={isFocused ? 30 : 24}
                color={isFocused ? '#4F46E5' : '#6B7280'}
              />
              {isFocused && (
                <Text style={{ fontSize: 12, color: '#4F46E5', marginTop: 5 }}>
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
