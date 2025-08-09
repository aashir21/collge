import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../../../constants/theme'

const DeletePostView = () =>
{
    return (
        <View>
            <Text style={{ color: COLORS.secondary, fontSize: SIZES.fontBodySize, textAlign: "center" }}>Post Deleted Successfully...</Text>
        </View>
    )
}

export default DeletePostView

const styles = StyleSheet.create({})