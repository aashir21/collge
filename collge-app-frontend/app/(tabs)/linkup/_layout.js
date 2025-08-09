import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { ANIMATION } from '../../../constants/theme'

const LinkUpLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name='linkups' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
            <Stack.Screen name='friends/[id]' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
            <Stack.Screen name='user/[id]' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
            <Stack.Screen name='linkupprofile/[id]' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
        </Stack>
    )
}

export default LinkUpLayout
