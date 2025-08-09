import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from "expo-router"
import { ANIMATION } from "../../constants/theme"

const AuthLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name='onboarding' options={{
                headerShown: false,
                animation: "none",
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>
            <Stack.Screen name='login' options={{
                headerShown: false,
                animation: "none",
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>
            <Stack.Screen name='register' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>
            <Stack.Screen name='chooseop' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>
            <Stack.Screen name='uniDetails' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>
            <Stack.Screen name='verifyStatus' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>
            <Stack.Screen name='emailcheck' options={{
                headerShown: false,
                animation: "none",
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}>
            </Stack.Screen>

            <Stack.Screen name='otp' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>

            <Stack.Screen name='confirmpassword' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>

            <Stack.Screen name='verification' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>

            <Stack.Screen name='registerType' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>

            <Stack.Screen name='photoUserDetails' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>

            <Stack.Screen name='photoUserUniDetails' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>

            <Stack.Screen name='pendingVerification' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>

            <Stack.Screen name='banned' options={{
                headerShown: false,
                animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration
            }}></Stack.Screen>

        </Stack>
    )
}

export default AuthLayout