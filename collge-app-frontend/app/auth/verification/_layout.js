import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { ANIMATION } from '../../../constants/theme'

const LinkUpLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name='selfieWarning' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }}></Stack.Screen>
            <Stack.Screen name='selfieVerification' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }}></Stack.Screen>
            <Stack.Screen name='cardFrontWarning' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }}></Stack.Screen>
            <Stack.Screen name='cardFrontVerification' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }}></Stack.Screen>
            <Stack.Screen name='cardRearWarning' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }}></Stack.Screen>
            <Stack.Screen name='cardRearVerification' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }}></Stack.Screen>
            <Stack.Screen name='submitVerification' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }}></Stack.Screen>
        </Stack>
    )
}

export default LinkUpLayout