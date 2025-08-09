import React from 'react'
import { Stack } from "expo-router"
import { ANIMATION } from '../../constants/theme'

const ChatLayout = () =>
{

    return (
        <Stack>
            <Stack.Screen name="home" options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
            <Stack.Screen name='userChat' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
            <Stack.Screen name='post' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
            <Stack.Screen name='user/[id]' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
            <Stack.Screen name='friends/[id]' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
        </Stack>
    )
}

export default ChatLayout