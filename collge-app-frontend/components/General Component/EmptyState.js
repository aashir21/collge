import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, SIZES, FONT } from '../../constants/theme'

const EmptyState = () =>
{
    return (
        <View style={styles.container}>
            <Image style={styles.img} source={require("../../assets/images/ghost.png")}></Image>
            <Text style={styles.title}>Nothing to see here, folks. </Text>
        </View>
    )
}

export default EmptyState

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        // backgroundColor: COLORS.textAccent,
        padding: SIZES.medium,
        borderRadius: 16
    },
    img: {
        width: 128,
        height: 128,
        objectFit: "contain",
        resizeMode: "contain"

    },
    title: {
        color: COLORS.tertiary, fontFamily: FONT.bold, fontSize: SIZES.large,
        textAlign: "center"
    }
})