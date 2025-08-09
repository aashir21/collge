import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from "../../constants/theme"
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { customFetch } from '../../utility/tokenInterceptor';
import { useToast } from 'react-native-toast-notifications';
import * as SecureStore from "expo-secure-store"
import * as Haptics from "expo-haptics"

const VerifyPassword = () =>
{

    const [input, setInput] = useState("")
    const [isDisabled, setIsDisabled] = useState(true)
    const [error, setError] = useState(false)
    const [warning, setWarning] = useState({
        isVisible: false,
        message: ""
    })
    const toast = useToast()

    const submit = async () =>
    {

        setIsDisabled(true)
        if (warning)
        {
            setWarning({
                isVisible: false,
                message: ""
            })
        }

        try
        {

            const trimmedPassword = input.trim()

            toast.show("Verifying password...", {
                placement: "top",
                duration: 3500,
                type: "normal"
            })

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/profile/verifyPassword`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: await SecureStore.getItem("__userId"),
                    newPassword: trimmedPassword
                })
            })

            if (response.ok)
            {

                setInput("")
                router.push({
                    pathname: "/(tabs)/profile/settings/password/changepassword"
                })

            }

            if (response.status === 400)
            {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                )
                setWarning({
                    isVisible: true,
                    message: "Incorrect password."
                })
            }

        } catch (err)
        {
            toast.show("Something went wrong...", {
                type: "normal",
                duration: 3500,
                placement: "top"
            })
        }
        finally
        {
            setIsDisabled(false)
        }

    }

    const handleInput = (text) =>
    {

        const trimmedText = text.trim()
        setInput(text); // Update caption with the new text
        if (trimmedText)
        {
            setIsDisabled(false); // Enable if the trimmed text is not empty
        } else
        {
            setIsDisabled(true); // Disable if the trimmed text is empty
        }
    }

    return (
        <SafeAreaView style={[styles.container]}>
            <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: SIZES.xSmall, marginTop: SIZES.medium }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign style={{ marginRight: 8 }} name="left" size={24} color={COLORS.tertiary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>Verify Password</Text>
                    <Text style={styles.subTitle}>Enter your current password</Text>
                </View>
            </View>

            <View style={{ marginTop: 30 }}>
                {
                    warning.isVisible && <Text style={styles.warningTitle}>{warning.message}</Text>
                }
                <TextInput secureTextEntry={true} onChangeText={(text) => handleInput(text)} style={styles.input} autoFocus placeholder='Current Password' placeholderTextColor={COLORS.whiteAccent} />
                <TouchableOpacity onPress={submit} disabled={isDisabled} style={[styles.submitBtn, { opacity: isDisabled ? 0.5 : 1 }]}>
                    <Text style={styles.btnTitle}>Verify</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default VerifyPassword

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge + 2,
        color: COLORS.tertiary,
    },
    subTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.whiteAccent,
    },
    input: {
        height: 48,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        fontSize: SIZES.small,
        borderRadius: SIZES.small,
        borderColor: COLORS.tertiary,
        color: COLORS.tertiary,
        fontFamily: FONT.regular
    },
    submitBtn: {
        backgroundColor: COLORS.tertiary,
        width: "25%",
        marginHorizontal: SIZES.xSmall,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.large,
        borderRadius: SIZES.large,
        marginVertical: SIZES.large
    },
    btnTitle: {
        color: COLORS.primary,
        fontFamily: FONT.regular,
        fontSize: SIZES.small
    },
    errorTitle: {
        color: COLORS.error,
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        marginVertical: SIZES.small,
        marginHorizontal: SIZES.small
    },
    warningTitle: {
        color: COLORS.warning,
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        marginVertical: SIZES.small,
        marginHorizontal: SIZES.small
    }
})