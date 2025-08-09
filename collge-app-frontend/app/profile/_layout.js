import { View, Text } from 'react-native'
import React from 'react'
import { ANIMATION } from '../../constants/theme'
import { Stack } from "expo-router"

const AuthLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name='user/[id]' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>

        </Stack>
    )
}

export default AuthLayout