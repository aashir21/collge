import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import DynamicUserTemplate from "../../../../../components/Profile/DynamicUserTemplate"

const FriendListToUser = () =>
{

    const localParams = useLocalSearchParams()

    return (
        <DynamicUserTemplate dynamicUserId={localParams.userId} />
    )
}

export default FriendListToUser