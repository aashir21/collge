import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'

const LinkUpInterestHeaderComponent = () =>
{
    return (
        <View>
            <Text style={styles.title}>LinkUp Requests</Text>
            <Text style={styles.subTitle}>Meet new people, go on new adventures</Text>
        </View>
    )
}

export default LinkUpInterestHeaderComponent

const styles = StyleSheet.create({

    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.tertiary
    },
    subTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.whiteAccent
    }

})