import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import tw from 'twrnc'; // Importing twrnc for Tailwind styling
import HomeScreen from '../screen/HomeScreen';

const Tab = createBottomTabNavigator();

const MainNavigator = ({ navigation }) => {
    return (
        <>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'person' : 'person-outline';
                        }

                        return (
                            <Icon 
                                name={iconName} 
                                size={28} 
                                color={focused ? 'green' : 'gray'} 
                                style={tw`p-1`} // Adding some padding for better appearance
                            />
                        );
                    },
                    tabBarShowLabel: false,
                    tabBarStyle: tw`bg-white shadow-md p-2`, // Tailwind for background and shadow
                    tabBarActiveTintColor: 'green', // Active icon color
                    tabBarInactiveTintColor: 'gray', // Inactive icon color
                    tabBarHideOnKeyboard: true, // Automatically hides tab bar when keyboard is open
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
            </Tab.Navigator>
        </>
    );
}

export default MainNavigator;
