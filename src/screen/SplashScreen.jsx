import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        // Set a timeout to navigate to the Onboarding screen after 3 seconds
        const timer = setTimeout(() => {
            navigation.navigate('Onboarding'); // Navigate to the Onboarding screen
        }, 3000); // 3000 milliseconds = 3 seconds

        // Cleanup the timer when the component is unmounted
        return () => clearTimeout(timer);
    }, [navigation]);

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
