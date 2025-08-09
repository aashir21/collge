import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ChangePasswordLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name='changepassword' options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
            <Stack.Screen name='verifyPassword' options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
        </Stack>
    )
}

export default ChangePasswordLayout