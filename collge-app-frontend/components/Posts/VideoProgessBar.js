import { StyleSheet, Text, View, Animated, Easing } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS } from '../../constants/theme';

const VideoProgressBar = ({ duration, position }) =>
{
    const progressAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() =>
    {
        if (duration > 0)
        {
            const currentProgress = (position / duration) * 100;
            Animated.timing(progressAnimation, {
                toValue: currentProgress,
                duration: 250, // Smoother transition duration
                useNativeDriver: false
            }).start();
        }
    }, [position, duration]);

    return (
        <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, {
                width: progressAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                })
            }]} />
        </View>
    );
};

export default VideoProgressBar

const styles = StyleSheet.create({
    progressBarContainer: {
        height: 2,
        width: '100%',
        backgroundColor: COLORS.whiteAccent
    },
    progressBar: {
        height: 2,
        backgroundColor: COLORS.secondary,
    }
})