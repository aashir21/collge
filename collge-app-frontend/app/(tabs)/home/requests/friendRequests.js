import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../../../constants/theme'
import FriendRequestsList from '../../../../components/NotificationComponents/FriendRequestsList'

const friendRequests = () =>
{
    return (
        <FriendRequestsList />
    )
}

export default friendRequests
