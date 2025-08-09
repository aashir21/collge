import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SettingsPostScreen from "../../../../../../components/SettingScreens/SettingsPostScreen"
import { useLocalSearchParams } from 'expo-router'

const Post = () =>
{
    const localParams = useLocalSearchParams()

    return (
        <SettingsPostScreen postId={localParams.postId} comment={localParams.comment} />
    )
}

export default Post

const styles = StyleSheet.create({})