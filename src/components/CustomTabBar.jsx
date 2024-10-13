import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import tw from 'twrnc'; // Import twrnc for styling
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Updated to use react-native-vector-icons
import * as Animatable from 'react-native-animatable'; // For animations

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={tw`flex-row bg-black p-1 justify-between rounded-t-10 h-20 absolute bottom-0 w-full`}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        // Use appropriate icons for your two tabs.
        const iconNames = ['home', 'cog']; // Icons for the two tabs: Home and Settings (cogwheel for settings)
        const iconName = iconNames[index]; // Get the right icon name for each tab
        
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

        // Use yellow for focused tab, white for unfocused tabs
        const iconColor = isFocused ? 'yellow' : 'white';
        const iconSize = 33; // Larger icon size

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={tw`flex-1 justify-center items-center`}
          >
            <Animatable.View
              animation={isFocused ? 'bounceIn' : undefined} // Animation on active tab
              duration={800}
              style={tw`items-center`}
            >
              <FontAwesome5 name={iconName} size={iconSize} color={iconColor} />
            </Animatable.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
