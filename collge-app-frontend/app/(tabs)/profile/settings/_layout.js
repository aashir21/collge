import React from 'react'
import { Stack } from 'expo-router'

const SettingsLayout = () =>
{
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='wink' options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
            <Stack.Screen name='profilevisit' options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
            <Stack.Screen name='comments' options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
            <Stack.Screen name='password' options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
            <Stack.Screen name='linkups' options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
            <Stack.Screen name='changeusername' options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
            <Stack.Screen name='changebio' options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
            <Stack.Screen name='changeavatar' options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
            <Stack.Screen name='blockedUsers' options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
        </Stack>
    )
}

export default SettingsLayout
