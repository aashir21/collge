import { StyleSheet, Text, TouchableOpacity, View, Image, useWindowDimensions } from 'react-native'
import React, { useEffect } from 'react'
import { SIZES, COLORS, SHADOWS, FONT } from "../../constants/theme"
import { router } from 'expo-router';
import SpanText from "../../components/General Component/SpanText"
import * as SecureStore from 'expo-secure-store';


const ChooseOp = () =>
{
    const { width } = useWindowDimensions();

    const handleSetOnboard = async () =>
    {
        await SecureStore.setItem("__viewedOnboarding", "true")
    }

    useEffect(() =>
    {

        handleSetOnboard()

    }, [])

    return (

        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={require("../../assets/images/Choose-Op-img.png")} style={{ flex: 0.75, resizeMode: "contain" }}></Image>
            </View>

            <View style={styles.textContainer}>
                <Text style={[styles.title, { width: width }]}>The Ultimate <SpanText subtext={"Student"} /> Experience</Text>
                <Text style={[styles.description, { width: width }]}>
                    Starting a new journey at university? Hop on all the fun we have to offer.
                    Make new friends, memories and more! Dive in!
                </Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/registerType")}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.replace("/auth/login")} style={[styles.button, { backgroundColor: "#FAFAFA" }]}>
                        <Text testID='Login' style={[styles.buttonText, { color: COLORS.primary }]}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default ChooseOp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
    },

    imageContainer: {
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center",

    },

    textContainer: {
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.textAccent,
        borderTopLeftRadius: SIZES.medium,
        borderTopRightRadius: SIZES.medium,
    },
    title: {
        paddingHorizontal: SIZES.large,
        paddingVertical: SIZES.large,
        marginTop: SIZES.large,
        textAlign: "center",
        fontFamily: "Poppins-Bold",
        fontSize: SIZES.xLarge + 2,
        color: COLORS.tertiary
    },
    description: {
        paddingHorizontal: SIZES.large,
        textAlign: "center",
        fontFamily: "Poppins-Regular",
        fontSize: SIZES.fontBodySize,
        lineHeight: 28,
        color: COLORS.tertiary
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        flexDirection: "row",
        marginBottom: SIZES.large
    },
    button: {
        paddingVertical: SIZES.small,
        backgroundColor: COLORS.primary,
        paddingHorizontal: SIZES.xxLarge,
        borderRadius: SIZES.medium,
        margin: SIZES.medium
    },
    buttonText: {
        color: COLORS.tertiary,
        fontSize: SIZES.fontBodySize,
        fontFamily: "Poppins-Regular",
    }
})