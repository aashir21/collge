import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const RootLayout = () =>
{
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='[id]' options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
        </Stack>
    )
}

export default RootLayout

const styles = StyleSheet.create({})