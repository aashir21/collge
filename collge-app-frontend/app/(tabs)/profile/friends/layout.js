//@Authored by: Muhammad Aashir Siddiqui

import React from 'react'
import { Stack } from 'expo-router'
import { ANIMATION } from '../../../../constants/theme'

const FriendLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name='[id]' options={{ animationDuration: ANIMATION.duration, animation: ANIMATION.style, headerShown: false }}></Stack.Screen>
        </Stack>
    )
}

export default FriendLayout