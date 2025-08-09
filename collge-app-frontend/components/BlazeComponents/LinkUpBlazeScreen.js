import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { BLAZE, COLORS, FONT, SIZES } from '../../constants/theme'
import SpanText from '../General Component/SpanText'

const LinkUpBlazeScreen = () =>
{
    return (
        <View style={styles.container}>
            <Image style={styles.screenImg} source={require("../../assets/images/Blaze-LinkUp.png")}></Image>
            <Text style={styles.title}>Meet people from other <SpanText subtext={"universities"} /> in your city!</Text>
            <Text style={styles.subTitle}>Unlock Blaze after earning {BLAZE.pointsToUnlock} fire points.</Text>
        </View>
    )
}

export default LinkUpBlazeScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: COLORS.primary
    },
    screenImg: {
        width: 325,
        height: 325,
        objectFit: "contain"
    },
    title: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.large,
        textAlign: "center",
        paddingHorizontal: SIZES.medium,
        marginVertical: SIZES.small
    }
    ,
    subTitle: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.small
    }

})