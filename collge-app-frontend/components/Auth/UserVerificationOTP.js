import { SafeAreaView, StyleSheet, Text, View, TextInput, useWindowDimensions, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard, Image, KeyboardAvoidingView, StatusBar } from 'react-native'
import React, { useState, useMemo, useRef } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme';
import * as Haptics from "expo-haptics"
import * as SecureStore from "expo-secure-store"
import { router, useLocalSearchParams } from "expo-router"
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { useToast } from 'react-native-toast-notifications';


const UserVerificationOTP = ({ email }) =>
{

    const { width } = useWindowDimensions();
    const localSearchParams = useLocalSearchParams()
    const toast = useToast()

    const [otp, setOtp] = useState("")
    const [error, setError] = useState({
        isError: false,
        errorMsg: ""
    })
    const [isDisabled, setIsDisbaled] = useState(true);

    const [key, setKey] = useState(0)

    const logout = async () =>
    {
        await SecureStore.deleteItemAsync("__isLoggedIn")
        await SecureStore.deleteItemAsync("__refreshToken")
        await SecureStore.deleteItemAsync("__jwtToken")
        await SecureStore.deleteItemAsync("__userId")
        router.replace("/auth/login")
    }

    const handleVerifyOtp = async () =>
    {

        try
        {

            setError({})

            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/otp/user/verifyOTP?userId=${localSearchParams.userId}&otp=${otp}`)

            toast.show("Verifying OTP", {
                duration: 3000,
                placement: "top",
                swipeEnabled: "true",
                type: "normal",
            })

            if (response.ok)
            {
                router.replace({
                    pathname: "/(tabs)/home"
                })
                setError({})
            }
            else if (response.status === 410)
            {

                setError({
                    isError: true,
                    errorMsg: "Token expired, please request a new one"
                })

                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                )

            }
            else if (response.status === 400)
            {
                setError({
                    isError: true,
                    errorMsg: "Incorrect OTP entered"
                })

                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                )
            }

        } catch (err)
        {
            toast.show("Something went wrong...", {
                duration: 3000,
                placement: "top",
                swipeEnabled: "true",
                type: "normal"
            })
            console.log(err);

        }

    }

    const handleValidation = () =>
    {
        const otpRegex = /^\d+$/

        if (otp.length < 6 || otp.length > 6)
        {
            setError({ isError: true, errorMsg: "OTP should be 6 digits" })
            return false
        }
        else if (otpRegex.test(otp))
        {
            handleVerifyOtp()
        }
        else
        {
            setError({ isError: true, errorMsg: "OTP should only have digits" })
            return false
        }

    }

    const resendOTP = async () =>
    {

        setIsDisbaled(true)
        setKey(prevKey => prevKey + 1)

        try
        {
            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/otp/sendOTP?email=${email}`)

            if (response.ok)
            {
                toast.show("New OTP sent", {
                    duration: 3000,
                    placement: "top",
                    swipeEnabled: "true",
                    type: "normal"
                })
            }
        } catch
        {

            setIsDisbaled(false)
            toast.show("Something went wrong...", {
                duration: 3000,
                placement: "top",
                swipeEnabled: "true",
                type: "normal"
            })
        }

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View style={styles.imgContainer}>
                        <Image style={styles.heroImg} source={require("../../assets/images/secure-shield.png")}></Image>
                    </View>
                    <View style={styles.fieldContainer}>
                        <Text numberOfLines={2} style={[styles.title, { width: width - 32 }]}>Student Status Verification</Text>
                        <Text style={[styles.subTitle, { width: width - 32 }]}>Please enter the 6-digit-code sent to {email}</Text>
                        {
                            error.isError ? <Text style={[styles.errorText, { width: width - 32 }]}>{error.errorMsg}</Text> : null
                        }
                        <TextInput onChangeText={(text) => setOtp(text)} keyboardType="numeric" placeholder='6-digit-code' placeholderTextColor={COLORS.tertiary} style={[styles.input, { width: width - 32 }]}></TextInput>
                        <TouchableOpacity style={styles.resendBtn} onPress={handleValidation}>
                            <Text style={[styles.resendLink, { color: COLORS.tertiary }]}>Verify</Text>
                        </TouchableOpacity>
                        <Text style={styles.caution}>Code is only valid for 15 minutes.</Text>
                        {
                            isDisabled ?
                                <View style={styles.btnContainer}>
                                    <Text style={{ fontFamily: FONT.regular, color: COLORS.whiteAccent, fontSize: SIZES.small }}>Request a new code in </Text>
                                    <CountdownCircleTimer
                                        isPlaying
                                        size={24}
                                        duration={180}
                                        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                                        strokeWidth={0}
                                        updateInterval={1}
                                        key={key.current}
                                        onComplete={() => setIsDisbaled(false)}
                                    >
                                        {({ remainingTime }) => <Text style={{ color: COLORS.secondary }}>{remainingTime}</Text>}

                                    </CountdownCircleTimer>
                                    <Text style={{ color: COLORS.whiteAccent }}> seconds</Text>
                                </View> :
                                <View style={styles.btnContainer}>
                                    <Text style={{ fontFamily: FONT.regular, color: COLORS.whiteAccent, fontSize: SIZES.small }}>Didn't get the code?</Text>
                                    <TouchableOpacity onPress={resendOTP}>
                                        <Text style={styles.resendLink}>Resend Code</Text>
                                    </TouchableOpacity>
                                </View>
                        }
                    </View>

                    <TouchableOpacity style={{ marginVertical: SIZES.medium }} onPress={logout}>
                        <Text style={{ color: COLORS.whiteAccent, fontSize: SIZES.small, fontFamily: FONT.regular }}>Logout</Text>
                    </TouchableOpacity>

                </KeyboardAvoidingView>

            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default UserVerificationOTP

const styles = StyleSheet.create({
    container: {
        flex: 0.9,
        justifyContent: "center",
        alignItems: "center",
    },
    titleContainer: {
        justifyContent: "flex-end",
        alignItems: "center",
    },
    title: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.xxLarge,
        textAlign: "center",
    },
    fieldContainer: {

        justifyContent: "center",
        alignItems: "center",

    },
    subTitle: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.medium,
        textAlign: "center",
    },
    input: {
        height: 52,
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: SIZES.small,
        borderColor: COLORS.tertiary,
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        marginTop: SIZES.medium
    },
    caution: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.small,
        textAlign: "center",
        marginTop: SIZES.xSmall
    },
    imgContainer: {
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
    },
    heroImg: {
        height: 200,
        width: 200,
        resizeMode: "contain",
        objectFit: "contain",

    },
    btnContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    resendLink: {
        color: COLORS.secondary,
        fontFamily: FONT.bold,
        fontSize: SIZES.small,
        marginHorizontal: 8
    },
    resendBtn: {
        backgroundColor: COLORS.textAccent,
        paddingHorizontal: 48,
        paddingVertical: SIZES.medium,
        marginVertical: SIZES.large,
        borderRadius: SIZES.medium
    },
    errorText: {
        color: "#ed4337",
        fontFamily: FONT.regular,
        marginTop: SIZES.small,
        textAlign: "left",

    }
})