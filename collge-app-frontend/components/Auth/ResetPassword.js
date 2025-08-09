import { StyleSheet, Text, View, TextInput, useWindowDimensions, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import { router, useLocalSearchParams } from "expo-router"
import { useToast } from 'react-native-toast-notifications'
import * as Haptics from "expo-haptics"

const ResetPassword = () =>
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

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

        if (newPassword.password !== newPassword.confirmPassword)
        {
            setError({ isError: true, errorMsg: "Passwords do not match" })
            return false;
        }
        else if (!passwordRegex.test(newPassword.password))
        {
            setError({ isError: true, errorMsg: "Password should be :\n- At least 8 characters long.\n- Contains at least one uppercase letter.\n- Contains at least one lowercase letter.\n- Contains at least one digit. \n- And a special character." })
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
            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/otp/changePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: localSearchParams.userId,
                    newPassword: newPassword.password
                })
            })

            if (response.ok)
            {
                router.replace("/auth/login")

                toast.show("Password changed!", {
                    duration: 3000,
                    placement: "top",
                    swipeEnabled: "true",
                    type: "normal"
                })
            }
            else if (response.status === 400)
            {
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
                <Text style={[styles.title, { width: width - 32 }]}>We know its you now, {localSearchParams.username}</Text>
                <Text style={[styles.subTitle, { width: width - 32 }]}>Choose a new password to hop back in</Text>
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
                    <Text style={styles.resendLink}>Reset</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>

        </TouchableWithoutFeedback>

    )
}

export default ResetPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
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
        color: "#ed4337",
        fontFamily: FONT.regular,
        marginBottom: 10,
        textAlign: "left",

    }
})