import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import SpanText from "../../components/General Component/SpanText"
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

const CameraRequest = ({ shouldDisplay }) =>
{
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Before you make a masterpiece, we need to access your <SpanText subtext={"camera"} /> and <SpanText subtext={"microphone"} />!</Text>
            <Text style={styles.subTitle}>Go to your phone settings and enable camera permissions for <SpanText subtext={"Collge"} /></Text>
            {
                shouldDisplay &&
                <TouchableOpacity onPress={() => router.replace("/(tabs)/home/feeds")} style={styles.permissionBtn}>
                    <AntDesign name="back" size={24} color={COLORS.secondary} />
                    <Text style={{ fontFamily: FONT.regular, color: COLORS.secondary, fontSize: SIZES.small, marginHorizontal: SIZES.xSmall }}>Go back</Text>
                </TouchableOpacity>
            }
        </View>
    )
}

export default CameraRequest

const styles = StyleSheet.create({

    container: {
        width: "100%",
        borderRadius: SIZES.large,
        justifyContent: "center",
        alignItems: "center"
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
        fontSize: SIZES.fontBodySize,
        color: COLORS.whiteAccent,
        marginTop: SIZES.small
    },
    permissionBtn: {

        paddingVertical: SIZES.medium,
        paddingHorizontal: SIZES.xxLarge,
        borderRadius: SIZES.medium,
        marginTop: SIZES.xLarge,
        flexDirection: "row",
        alignItems: "center"

    }

})