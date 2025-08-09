import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'

const EmptyNearbyList = () =>
{
    return (
        <View style={styles.container}>
            <Text style={styles.title}>No one's around currently!</Text>
            <Text style={styles.subTitle}>Try your luck again later ✨</Text>
        </View>
    )
}

export default EmptyNearbyList

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        textAlign: "center",
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge,
        color: COLORS.tertiary
    },
    subTitle: {
        textAlign: "center",
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.whiteAccent
    }

})