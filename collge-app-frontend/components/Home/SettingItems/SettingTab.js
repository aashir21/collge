import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { COLORS, FONT, SIZES } from '../../../constants/theme'


const SettingTab = (props) =>
{

    const { width } = useWindowDimensions();

    return (
        <View style={[styles.container, { width: width - 32 }]}>
            <AntDesign name="user" size={24} color={COLORS.tertiary} />
            <Text style={styles.tabTitle}>Change Details</Text>
        </View>
    )
}

export default SettingTab

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: COLORS.textAccent,
        height: 58,
        borderRadius: SIZES.large,
        marginVertical: 64,
        padding: SIZES.medium
    },

    tabTitle: {
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        marginHorizontal: SIZES.medium
    }
})