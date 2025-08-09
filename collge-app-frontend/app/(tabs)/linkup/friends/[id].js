import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FriendsListScreen from '../../../../components/Profile/FriendsListScreen'
import { useLocalSearchParams } from 'expo-router'


const FriendsDynamicRoute = () =>
{
    const localParams = useLocalSearchParams()

    return (
        <FriendsListScreen userId={localParams.userId} />
    )
}

export default FriendsDynamicRoute