import { View, Text } from 'react-native'
import React from 'react'
import EditPost from '../../../../components/Posts/PostSettings/EditPost'
import { useLocalSearchParams } from 'expo-router'

const editPost = () =>
{

    const dynamicPostData = useLocalSearchParams()

    return (
        <EditPost postId={dynamicPostData.id} sourceScreen={dynamicPostData.sourceScreen} />
    )
}

export default editPost