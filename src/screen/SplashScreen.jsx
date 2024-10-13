// screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';

const SplashScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <LottieView
                source={require('../assets/animation4.json')}
                autoPlay
                loop
                style={styles.animation}
                onError={(error) => console.log('Animation error:', error)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    animation: {
        width: 300,
        height: 400,
    },
});

export default SplashScreen;
