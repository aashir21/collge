import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { Image } from 'expo-image'
import * as SecureStore from "expo-secure-store"
import SpanText from '../General Component/SpanText'
import { router } from 'expo-router'

const PendingVerification = () =>
{

    const logout = async () =>
    {

        await SecureStore.deleteItemAsync("__isLoggedIn")
        await SecureStore.deleteItemAsync("__refreshToken")
        await SecureStore.deleteItemAsync("__jwtToken")
        await SecureStore.deleteItemAsync("__userId")

        router.replace("/auth/login")

    }

    return (
        <View style={styles.container}>
            <Image style={styles.img} source={require("../../assets/images/Jack-Phone.png")} />
            <Text style={styles.title}>Pending <SpanText subtext={"Verification"} /></Text>
            <Text style={styles.subTitle}>Our team is still reviewing your verification request.</Text>
            <Text style={[styles.subTitle, { marginTop: SIZES.small }]}>If it has been more than 24 hours, please contact support@collge.io</Text>
            <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                <Text style={styles.btnTitle}>
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default PendingVerification

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.primary,
        justifyContent: "center"
    },
    title: {
        fontSize: SIZES.large,
        color: COLORS.tertiary,
        fontFamily: FONT.bold
    },
    subTitle: {
        fontSize: SIZES.small,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        textAlign: "center",
        marginHorizontal: SIZES.medium
    },
    img: {
        height: 300,
        width: 300,
        objectFit: "contain"
    },
    logoutBtn: {
        paddingHorizontal: SIZES.large,
        paddingVertical: SIZES.small,
        backgroundColor: COLORS.tertiary,
        borderRadius: SIZES.medium,
        marginTop: SIZES.large
    },
    btnTitle: {
        fontSize: SIZES.small,
        color: COLORS.primary,
        fontFamily: FONT.regular
    }

})