import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES, BLAZE } from '../../constants/theme'
import Fontisto from '@expo/vector-icons/Fontisto';
import SpanText from '../General Component/SpanText';

const GetBlaze = ({ subTitle }) =>
{
    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.screenImg} source={require("../../assets/images/profile-visit-blaze.png")} />
            <Text style={styles.title}>Know <SpanText subtext={"who visited"} /> your profile!</Text>
            <Text style={styles.subTitle}>Unlock Blaze after earning {BLAZE.pointsToUnlock} fire points.</Text>
        </SafeAreaView>
    )
}

export default GetBlaze

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 32 : 0,
        alignItems: "center",
        backgroundColor: COLORS.primary
    },
    title: {
        fontSize: SIZES.large + 2,
        color: COLORS.tertiary,
        fontFamily: FONT.bold,
        textAlign: "center"
    },
    subTitle: {
        fontSize: SIZES.small,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        textAlign: "center"
    },
    screenImg: {
        width: 425,
        height: 425,
        objectFit: "contain"
    },

})