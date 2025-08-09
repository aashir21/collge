import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'

const EmptyComments = () =>
{

    return (
        <View style={[styles.container]}>
            <Text style={{ textAlign: "center", fontFamily: FONT.bold, color: COLORS.tertiary, fontSize: SIZES.xLarge }}>Tumbleweeds Rollin' Through... 🌵</Text>
            <Text style={{ textAlign: "center", fontFamily: FONT.regular, color: COLORS.whiteAccent, fontSize: SIZES.medium - 2, marginTop: SIZES.small }}>No comments!</Text>
        </View>
    )
}

export default EmptyComments

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    }

})