import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from "expo-router"
import { ANIMATION } from "../../constants/theme"

const ReelLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name='reel/[id]' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>
        </Stack>
    )
}

export default ReelLayout