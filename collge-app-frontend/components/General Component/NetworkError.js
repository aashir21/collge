import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NetworkError = () =>
{
    return (
        <View>
            <Image />
            <Text>No Internet Connection</Text>
        </View>
    )
}

export default NetworkError

const styles = StyleSheet.create({})