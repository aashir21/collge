import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'

const SWentWrong = () =>
{

    const { width } = useWindowDimensions()

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: width, backgroundColor: COLORS.primary }}>
            <Image style={styles.errorImage} source={require("../../assets/images/code.png")} />
            <Text style={styles.title}>We are migrating to the UK!</Text>
            <Text style={styles.subTitle}>Goodbye Pakistan. Any data you provided has been deleted.</Text>
            <Text style={styles.subTitle}>If you have any queries regarding your data, please contact support@collge.io</Text>
        </View>
    )
}

export default SWentWrong

const styles = StyleSheet.create({
    errorImage: {
        height: 160,
        width: 160,
        resizeMode: "contain"
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.tertiary,
        marginTop: SIZES.medium
    },
    subTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.whiteAccent,
        textAlign: "center"
    }
})