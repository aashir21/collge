import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS, ENDPOINT, FONT, REGEX, SIZES } from "../../constants/theme"
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { customFetch } from '../../utility/tokenInterceptor';
import { useToast } from 'react-native-toast-notifications';
import * as SecureStore from "expo-secure-store"
import * as Haptics from "expo-haptics"

const ChangeUsername = () =>
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

        const currentUsername = await SecureStore.getItem("__username");

        try
        {

            const trimmedUsername = input.trim()

            if (!REGEX.USERNAME_REGEX.test(trimmedUsername))
            {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                )
                setError(true)
                return;
            }

            if (currentUsername === trimmedUsername)
            {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                )
                setWarning({
                    isVisible: true,
                    message: "New username should not match the current username."
                })

                return;
            }

            toast.show("Updating username...", {
                placement: "top",
                duration: 3500,
                type: "normal"
            })

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/profile/updateUsername`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: await SecureStore.getItem("__userId"),
                    newUsername: trimmedUsername
                })
            })

            if (response.ok)
            {

                const data = await response.json()
                await SecureStore.setItemAsync("__username", data.newUsername)
                await SecureStore.setItemAsync("__jwtToken", data.newJwtToken)

                toast.show("Username updated", {
                    placement: "top",
                    duration: 3500,
                    type: "normal"
                })

                router.back()
            }

            if (response.status === 409)
            {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                )
                setWarning({
                    isVisible: true,
                    message: "Username is already taken."
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

        if (error)
        {
            setError(false)
        }

        if (warning)
        {
            setWarning({
                isVisible: false,
                message: ""
            })
        }

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
                    <Text style={styles.title}>Change Username</Text>
                    <Text style={styles.subTitle}>A new identity perhaps?</Text>
                </View>
            </View>

            <View style={{ marginTop: 30 }}>
                {
                    error && <Text style={styles.errorTitle}>Username should be at least 3-15 characters long.</Text>
                }
                {
                    warning.isVisible && <Text style={styles.warningTitle}>{warning.message}</Text>
                }
                <TextInput defaultValue={SecureStore.getItem("__username")} onChangeText={(text) => handleInput(text)} style={styles.input} autoFocus placeholder='New username' placeholderTextColor={COLORS.whiteAccent} />
                <TouchableOpacity onPress={submit} disabled={isDisabled} style={[styles.submitBtn, { opacity: isDisabled ? 0.5 : 1 }]}>
                    <Text style={styles.btnTitle}>Update</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default ChangeUsername

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