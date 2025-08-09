import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'

const BannedScreen = () =>
{
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Your Account Has Been Banned!</Text>
            <Text style={styles.subTitle}>Please contact support@collge.io for more information.</Text>
        </SafeAreaView>
    )
}

export default BannedScreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.xLarge + 2,
        textAlign: "center"
    },
    subTitle: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.medium,
        textAlign: "center",
        marginTop: SIZES.xSmall
    }

})