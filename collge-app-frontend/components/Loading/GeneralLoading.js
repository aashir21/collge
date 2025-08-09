import { StyleSheet, Text, View, ActivityIndicator, useWindowDimensions } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'

const GeneralLoading = ({ title, subtext }) =>
{
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
            <ActivityIndicator size="small" color={COLORS.whiteAccent} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.title}>{subtext}</Text>
        </View>
    )
}

export default GeneralLoading

const styles = StyleSheet.create({

    title: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        color: COLORS.whiteAccent,
        marginTop: SIZES.medium
    }

})