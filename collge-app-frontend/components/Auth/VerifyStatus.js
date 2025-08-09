import { StyleSheet, Text, View, useWindowDimensions, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import * as SecureStore from 'expo-secure-store';

const VerifyStatus = () =>
{

    const { width } = useWindowDimensions();
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState(-1);

    const getEmail = async () =>
    {

        try
        {

            const email = await SecureStore.getItem("__email")

            if (email != null)
            {
                setEmail(email)
            }

        }
        catch (err)
        {
            console.log("Error @getEmail method: ", err);
        }

    }

    const handleResendEmail = async () =>
    {

        const id = await SecureStore.getItem("__userId")

        if (id != null)
        {
            setUserId(id)
        }

        fetch(`${ENDPOINT.BASE_URL}/api/v1/user/resendVerifyEmail?userId=${String(userId)}`)
            .then(res =>
            {
                res.json()
            })
            .then(data =>
            {
            })


    }

    const handleLogout = async () =>
    {
        try
        {
            await SecureStore.deleteItemAsync(("__clearOnboarding"))
            await SecureStore.deleteItemAsync("__isLoggedIn")

        } catch (err)
        {
            console.log("Error @clearOnboarding: ", err);
        }
    }

    useEffect(() =>
    {
        getEmail()
    })

    return (
        <View style={[styles.container, { width: width }]}>

            <Image style={styles.verifyImage} source={require("../../assets/images/Verify.png")}></Image>
            <Text style={[styles.title, { width: width - 32 }]}>Please Verify Your Email</Text>
            <Text style={[styles.subTitle, { width: width }]}>We have sent an email to: {email}</Text>

            <TouchableOpacity style={styles.resendBtn} onPress={handleResendEmail}>
                <Text style={styles.resendLink}>Resend email</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.resendLink}>Logout</Text>
            </TouchableOpacity>

        </View>

    )
}

export default VerifyStatus

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
    },
    animation: {
        height: 300,

        backgroundColor: "red",

    },
    verifyImage: {
        height: 225,
        width: 225,
        resizeMode: "contain",
        objectFit: "contain"
    },
    title: {
        fontSize: SIZES.xxLarge,
        color: COLORS.tertiary,
        textAlign: "center",
        fontFamily: FONT.bold,
        marginVertical: SIZES.medium
    },
    subTitle: {
        fontSize: SIZES.medium,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        textAlign: "center",

        paddingHorizontal: SIZES.xxLarge
    },
    resendBtn: {
        backgroundColor: COLORS.textAccent,
        paddingHorizontal: SIZES.xxLarge,
        paddingVertical: SIZES.medium,
        marginVertical: SIZES.xxLarge,
        borderRadius: SIZES.medium
    },
    resendLink: {
        color: COLORS.tertiary,
        fontFamily: FONT.bold,

    }
})