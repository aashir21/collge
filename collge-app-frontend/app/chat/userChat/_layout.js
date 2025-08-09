
import React from 'react'
import { Stack } from 'expo-router'
import { ANIMATION } from '../../../constants/theme'

const UserChatLayout = () =>
{
    return (
        <Stack>
            <Stack.Screen name='[id]' options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
        </Stack>
    )
}

export default UserChatLayout
