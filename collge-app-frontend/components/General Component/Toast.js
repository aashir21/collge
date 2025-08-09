import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../../constants/theme'

const Toast = ({ title }) =>
{
    const { width } = useWindowDimensions()

    return (
        <View style={[styles.container, { width: width - 128 }]}>
            <Text style={{ color: "white" }}>{title}</Text>
        </View>
    )
}

export default Toast

const styles = StyleSheet.create({
    container: {
        height: 64,
        backgroundColor: COLORS.sucess,
        marginVertical: SIZES.large,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.large,

    }
})