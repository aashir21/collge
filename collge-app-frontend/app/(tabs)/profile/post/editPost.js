import { View, Text } from 'react-native'
import React from 'react'
import EditPost from '../../../../components/Posts/PostSettings/EditPost'
import { useLocalSearchParams } from 'expo-router'

const editPost = () =>
{

    const dynamicPostId = useLocalSearchParams()

    return (
        <EditPost postId={dynamicPostId.id} />
    )
}

export default editPost