import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import DynamicUserTemplate from "../../../../components/Profile/DynamicUserTemplate"

const LinkUpProfilePage = () =>
{

    const params = useLocalSearchParams()

    return (
        <DynamicUserTemplate dynamicUserId={params.id} />
    )
}

export default LinkUpProfilePage
