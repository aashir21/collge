import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, useWindowDimensions, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT, SIZES, ENDPOINT } from '../../constants/theme'
import { router } from "expo-router"
import { useToast } from 'react-native-toast-notifications'


const EmailCheck = () =>
{

    const [email, setEmail] = useState("");
    const { width } = useWindowDimensions()
    const [isDisabled, setIsDisbaled] = useState(false)
    const [errors, setErrors] = useState(({
        isTrue: false,
        errorMsg: ""
    }))
    const toast = useToast()

    const handleSubmit = async () =>
    {
        try
        {

            setIsDisbaled(true)
            toast.show("Checking email...", {
                placement: "top",
                type: "normal",
                duration: 3500,
            })

            const emailRegex = /^(?!.*\.\.)[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/

            if (emailRegex.test(email) && email.length > 3)
            {
                const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/otp/sendOTP?email=${email}`)

                if (response.ok)
                {
                    const data = await response.json()

                    router.push("/auth/otp")
                    router.setParams({ userId: data.userId, email: data.email, username: data.username });
                }
                else if (response.status === 400)
                {
                    setErrors({
                        isTrue: true,
                        errorMsg: "We could'nt find an account with this email."
                    })
                }
            }
            else
            {
                setErrors({
                    isTrue: true,
                    errorMsg: "Please enter a valid email address."
                })
            }

        } catch (err)
        {
            toast.show("Something went wrong...", {
                placement: "top",
                type: "normal",
                duration: 3500,
                swipeEnabled: true
            })
        }
        finally
        {
            setIsDisbaled(false)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView style={[styles.container]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View style={[styles.fieldContainer, { width: width }]}>
                        <Text style={[styles.title, { width: width - 32 }]}>It happens, dont worry. Let's get you sorted.</Text>

                        {errors.isTrue ? <Text style={[styles.errorText, { width: width - 32 }]}>{errors.errorMsg}</Text> : null}
                        <TextInput onChangeText={(text) =>
                        {
                            setEmail(text)
                            setErrors({ isTrue: false, errorMsg: "" })
                        }} style={[styles.input, { width: width - 32 }]} autoCorrect={false} autoCapitalize="none" placeholder='Your student email' placeholderTextColor={COLORS.tertiary} />
                        <TouchableOpacity role='next-btn' disabled={isDisabled} style={[styles.nextBtn, { opacity: isDisabled ? 0.2 : 1 }]} onPress={handleSubmit}>
                            <Text style={styles.btnText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default EmailCheck

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    fieldContainer: {
        flex: 0.5,
        justifyContent: "space-between",
        alignItems: "center",

    },
    title: {
        fontSize: SIZES.xxLarge,
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        marginBottom: SIZES.medium
    },
    input: {
        height: 52,
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: SIZES.small,
        borderColor: COLORS.tertiary,
        color: COLORS.tertiary,
        fontFamily: FONT.regular
    },
    nextBtn: {
        backgroundColor: COLORS.textAccent,
        paddingHorizontal: SIZES.xxLarge,
        paddingVertical: SIZES.medium,
        marginVertical: SIZES.xxLarge,
        borderRadius: SIZES.medium
    }
    , btnText: {
        color: COLORS.tertiary,
        fontFamily: FONT.bold,
    },
    errorText: {
        color: "#ed4337",
        fontFamily: FONT.regular,
        marginBottom: 10,
        textAlign: "left",

    }
})