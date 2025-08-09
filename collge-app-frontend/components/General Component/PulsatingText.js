import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';

const PulsatingText = ({ children, style }) =>
{
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() =>
    {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.1, // Increase scale for the pulse effect
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.Text style={[style, { transform: [{ scale }] }]}>
            {children}
        </Animated.Text>
    );
};

export default PulsatingText;
