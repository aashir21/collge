import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { ANIMATION } from "../../../constants/theme"

const CameraLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name='index' options={{ headerShown: false, animation: "simple_push" }}></Stack.Screen>
        </Stack>
    )
}

export default CameraLayout

