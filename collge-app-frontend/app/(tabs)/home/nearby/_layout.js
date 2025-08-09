import React from 'react'
import { Stack } from 'expo-router'
import { ANIMATION, COLORS } from '../../../../constants/theme'

const NearbyRootLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, animation: "slide_from_right", animationDuration: ANIMATION.duration }} />
        </Stack>
    )
}

export default NearbyRootLayout
