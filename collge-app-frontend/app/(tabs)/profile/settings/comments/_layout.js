import React from 'react'
import { Stack } from 'expo-router'
import { ANIMATION } from '../../../../../constants/theme'

const SettingsCommentLayout = () =>
{
    return (
        <Stack screenOptions={{ headerShown: false, animation: ANIMATION.style, }}>
        </Stack>
    )
}

export default SettingsCommentLayout