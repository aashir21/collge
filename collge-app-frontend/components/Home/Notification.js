import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'

const Notification = () =>
{
    return (
        <View style={styles.container}>
            <Text style={{ color: COLORS.tertiary, fontFamily: FONT.regular, fontSize: SIZES.xxLarge }}>For You</Text>
        </View>
    )
}

export default Notification

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
    }
})