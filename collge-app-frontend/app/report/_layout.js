import React from 'react'
import { Stack } from 'expo-router'
import { ANIMATION } from '../../constants/theme'

const ReportRootLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
            <Stack.Screen name="appReport" options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
        </Stack>
    )
}

export default ReportRootLayout