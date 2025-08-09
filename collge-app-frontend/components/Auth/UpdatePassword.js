import { StyleSheet, Text, View, TextInput, useWindowDimensions, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { COLORS, ENDPOINT, FONT, REGEX, SIZES } from '../../constants/theme'
import { router, useLocalSearchParams } from "expo-router"
import { useToast } from 'react-native-toast-notifications'
import { customFetch } from "../../utility/tokenInterceptor"
import * as SecureStore from "expo-secure-store"
import * as Haptics from "expo-haptics"

const UpdatePassword = () =>
{

    const { width } = useWindowDimensions();
    const localSearchParams = useLocalSearchParams()
    const [isDisabled, setIsDisbaled] = useState(false)
    const [error, setError] = useState({
        isError: false,
        errorMsg: ""
    })

    const [newPassword, setNewPassword] = useState({
        password: "",
        confirmPassword: ""
    })
    const toast = useToast()

    const handleFormValidations = () =>
    {

        const passwordRegex = REGEX.PASSWORD_REGEX

        if (newPassword.password !== newPassword.confirmPassword)
        {
            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
            )
            setError({ isError: true, errorMsg: "Passwords do not match" })
            return false;
        }
        else if (!passwordRegex.test(newPassword.password))
        {
            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
            )
            setError({ isError: true, errorMsg: "Password should be :\n- At least 8-32 characters long.\n- Contains at least one uppercase letter.\n- Contains at least one lowercase letter.\n- Contains at least one digit. \n- And a special character." })
            return false;
        }
        else if (newPassword.password === newPassword.confirmPassword && passwordRegex.test(newPassword))
        {
            setError({})
            return true;
        }

    }

    const handleChangePassword = async () =>
    {

        setIsDisbaled(true)

        toast.show("Hold on", {
            duration: 3000,
            placement: "top",
            swipeEnabled: "true",
            type: "normal"
        })

        handleFormValidations()

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/profile/updatePassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: await SecureStore.getItem("__userId"),
                    newPassword: newPassword.password
                })
            })

            if (response.ok)
            {

                toast.show("Password changed!", {
                    duration: 3000,
                    placement: "top",
                    swipeEnabled: "true",
                    type: "normal"
                })

                router.back()
            }
            else if (response.status === 400)
            {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                )
                setError({ isError: true, errorMsg: "Old password should not match the new password" })
            }

        } catch (err)
        {
            toast.show("Could not change password", {
                duration: 3000,
                placement: "top",
                swipeEnabled: "true",
                type: "normal"
            })
        }
        finally
        {
            setIsDisbaled(false)
        }

    }

    return (

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Text style={[styles.title, { width: width - 32 }]}>Choose a new password</Text>
                {error ? <Text style={[styles.errorText, { width: width - 32 }]}>{error.errorMsg}</Text> : null}
                <TextInput onChangeText={(text) =>
                {
                    setNewPassword({ ...newPassword, password: text })
                    setError({ isError: false, errorMsg: "" })
                }} secureTextEntry={true} placeholder='New password' placeholderTextColor={COLORS.tertiary} style={[styles.input, { width: width - 32 }]}></TextInput>
                <TextInput onChangeText={(text) =>
                {
                    setNewPassword({ ...newPassword, confirmPassword: text })
                    setError({ isError: false, errorMsg: "" })
                }} secureTextEntry={true} placeholder='Confirm new password' placeholderTextColor={COLORS.tertiary} style={[styles.input, { width: width - 32 }]}></TextInput>
                <TouchableOpacity disabled={isDisabled} onPress={handleChangePassword} style={[styles.resendBtn, { width: width - 32, opacity: isDisabled ? 0.2 : 1 }]}>
                    <Text style={styles.resendLink}>Update</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>

        </TouchableWithoutFeedback>

    )
}

export default UpdatePassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xxLarge,
        color: COLORS.tertiary,
        textAlign: "center"
    },
    subTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.whiteAccent,
        textAlign: "center",
        marginBottom: SIZES.large
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
        marginTop: SIZES.medium,
        marginBottom: SIZES.small
    },
    resendLink: {
        color: COLORS.tertiary,
        fontFamily: FONT.bold,
        fontSize: SIZES.small,
        textAlign: "center"
    },
    resendBtn: {
        backgroundColor: COLORS.textAccent,
        paddingHorizontal: 48,
        paddingVertical: SIZES.medium,
        marginVertical: SIZES.large,
        borderRadius: SIZES.medium
    },
    errorText: {
        color: COLORS.warning,
        fontFamily: FONT.regular,
        marginTop: SIZES.small,
        textAlign: "left",

    }
})