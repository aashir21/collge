import React, { useState, useEffect, useRef } from 'react';
import { Animated, Text, Easing } from 'react-native';

const TextTransition = ({ messages, style }) =>
{
    const [currentIndex, setCurrentIndex] = useState(0);
    const opacity = useRef(new Animated.Value(0)).current;
    const isAnimating = useRef(false); // Flag to track animation state

    useEffect(() =>
    {
        const animate = () =>
        {
            isAnimating.current = true; // Set animating flag before starting

            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 750,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.delay(1500),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 750,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ]).start(() =>
            {
                isAnimating.current = false; // Reset animating flag after completion

                if (!isAnimating.current)
                {
                    setCurrentIndex(prevIndex => (prevIndex + 1) % messages.length);
                }
            });
        };

        animate(); // Start initial animation

        const intervalId = setInterval(() =>
        {
            if (!isAnimating.current)
            { // Only animate if not already animating
                animate();
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }, [messages.length]);

    return (
        <Animated.Text style={[style, { opacity }]}>
            {messages[currentIndex]}
        </Animated.Text>
    );
};

export default TextTransition;
