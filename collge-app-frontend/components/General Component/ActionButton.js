import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'

const ActionButton = ({ title }) =>
{

    const { width } = useWindowDimensions()

    return (
        <TouchableOpacity style={[styles.actionBtn]}>
            <Text style={styles.btnTitle}>{title}</Text>
        </TouchableOpacity>
    )
}

export default ActionButton

const styles = StyleSheet.create({
    actionBtn: {
        backgroundColor: COLORS.primary,
        width: "45%",
        paddingVertical: SIZES.medium,
        borderRadius: SIZES.large
    },
    btnTitle: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: 13,
        textAlign: "center"
    }
})