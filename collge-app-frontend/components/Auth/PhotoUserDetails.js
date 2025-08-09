import
{
    Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput,
    TouchableOpacity, TouchableWithoutFeedback, View, useWindowDimensions,
    ScrollView,
    StatusBar
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, Pressable } from 'react-native'
import { SIZES, COLORS, FONT, ENDPOINT, REGEX } from "../../constants/theme"
import { router } from "expo-router"
import * as Haptics from 'expo-haptics';
import { useDispatch, useSelector } from "react-redux"
import { setFirstName, setLastName, setPassword, setUsername } from '../../state/user/userSlice'
import SpanText from "../General Component/SpanText"

const PhotoUserDetails = () =>
{

    const { width } = useWindowDimensions();


    const dispatch = useDispatch()

    const userData = useSelector((state) => state.user)

    const [error, setError] = useState({
        isError: false,
        errorMsg: ""
    })

    const [passError, setPassError] = useState({
        isError: false,
        errorMsg: ""
    })

    const [firstNameErr, setFirstNameErr] = useState({
        isError: false,
        errorMsg: ""
    })

    const [lastNameErr, setLastNameErr] = useState({
        isError: false,
        errorMsg: ""
    })

    const handleFormValidations = () =>
    {

        const firstNameRegex = REGEX.NAME_REGEX;
        const lastNameRegex = REGEX.NAME_REGEX;
        const usernameRegex = REGEX.USERNAME_REGEX;
        const passwordRegex = REGEX.PASSWORD_REGEX;

        if (!firstNameRegex.test(userData.firstName))
        {

            if (userData.firstName.length < 3 || userData.firstName.length > 15)
            {
                setFirstNameErr({ isError: true, errorMsg: "First name should be between 3 to 15 characters" })
                return;
            }
            setFirstNameErr({ isError: true, errorMsg: "Really? You got numbers or funny symbols in your name? No numbers or special characters! Names can be 3-15 characters long." })

        }
        else if (!lastNameRegex.test(userData.lastName))
        {
            if (userData.lastName.length < 2)
            {
                setFirstNameErr({ isError: true, errorMsg: "Sorry, last name should be atleast 3 characters long." })
                return;
            }
            setLastNameErr({ isError: true, errorMsg: "No numbers/special characters, does'nt have to be this hard guys. Names can be 3-15 characters long." })
        }
        else if (!usernameRegex.test(userData.username))
        {
            if (userData.username.length < 3 || userData.username > 15)
            {
                setError({ isError: true, errorMsg: "Username should be at least 3-15 characters long" })
                return;
            }
            setError({ isError: true, errorMsg: "We know you are creative, but no emojis/special characters in usernames. Usernames can be 3-15 characters long." })
        }
        if (!passwordRegex.test(userData.password))
        {
            setPassError({ isError: true, errorMsg: "Password should be :\n- At least 8 characters long.\n- Contains at least one uppercase letter.\n- Contains at least one lowercase letter.\n- Contains at least one digit. \n- And a special character." })
        }

        if (firstNameRegex.test(userData.firstName) && lastNameRegex.test(userData.lastName) && usernameRegex.test(userData.username) && passwordRegex.test(userData.password))
        {
            handleTransferData();
            setFirstNameErr({})
            setLastNameErr({})
            setPassError({})
            setError({})
        }
        else
        {
            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
            )
        }

    }


    const handleTransferData = async () =>
    {

        try
        {
            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/user/findByUsername?username=${userData.username}`)

            if (response.ok)
            {
                const data = await response.text()

                router.push({
                    pathname: "/auth/photoUserUniDetails"
                })


                setError({ isError: false, errorMsg: null })
            }
            else
            {

                setError({ isError: true, errorMsg: "Username is already taken" })
            }
        } catch (error)
        {
            console.log(error);
        }

    }

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

                <View style={styles.container}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        style={{ alignSelf: "stretch" }} showsVerticalScrollIndicator={false}>
                        <View style={[styles.titleContainer, { width: width }]}>
                            <Text style={[styles.title]}>It's <SpanText subtext={"fun"} /> on the other side!</Text>
                            <Text style={[styles.subTitle]}>Let's begin!</Text>
                        </View>
                        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? "padding" : "padding"}>

                            <View style={styles.fieldContainer}>

                                {
                                    firstNameErr.isError ? <Text style={[styles.errorText, { width: width }]}>{firstNameErr.errorMsg}</Text> : null
                                }
                                <TextInput onChangeText={(text) =>
                                {
                                    // setUserData({ ...userData, firstName: text })
                                    dispatch(setFirstName(text))
                                    setFirstNameErr({})
                                }} style={[styles.input, { width: width - 32 }]} placeholder='First Name' placeholderTextColor={COLORS.tertiary}></TextInput>

                                {
                                    lastNameErr.isError ? <Text style={[styles.errorText, { width: width }]}>{lastNameErr.errorMsg}</Text> : null
                                }
                                <TextInput onChangeText={(text) =>
                                {
                                    // setUserData({ ...userData, lastName: text })
                                    dispatch(setLastName(text))
                                    setLastNameErr({})
                                }} style={[styles.input, { width: width - 32 }]} placeholder='Last Name' placeholderTextColor={COLORS.tertiary}></TextInput>
                                {
                                    error.isError ? <Text style={[styles.errorText, { width: width }]}>{error.errorMsg}</Text> : null
                                }
                                <TextInput onChangeText={(text) =>
                                {
                                    // setUserData({ ...userData, username: text })
                                    dispatch(setUsername(text))
                                }} style={[styles.input, { width: width - 32 }]} placeholder='Username' placeholderTextColor={COLORS.tertiary} autoCapitalize='none'></TextInput>

                                <TextInput onChangeText={(text) =>
                                {
                                    // setUserData({ ...userData, password: text })
                                    dispatch(setPassword(text))
                                }} style={[styles.input, { width: width - 32 }]} secureTextEntry={true} placeholder='Password' placeholderTextColor={COLORS.tertiary} autoCapitalize='none'></TextInput>
                                {
                                    passError.isError ? <Text style={[styles.errorText, { width: width }]}>{passError.errorMsg}</Text> : null
                                }
                                <TouchableOpacity onPress={handleFormValidations} style={[styles.registerButton, { width: width - 32 }]}>
                                    <Text style={{ fontFamily: FONT.regular, textAlign: "center", fontSize: SIZES.small }}>
                                        Next
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                        <View style={styles.buttonContainer}>
                            <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                <Text style={{ color: COLORS.whiteAccent }}>Already have an account?</Text>
                                <Pressable onPress={() => router.push("/auth/login")}>
                                    <Text style={[styles.fancyUnderline, { color: "#FAFAFA", margin: SIZES.xSmall, fontFamily: FONT.bold, fontSize: SIZES.small }]} >Login</Text>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>

        </SafeAreaView>
    )
}

export default PhotoUserDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
    },
    title: {
        fontSize: SIZES.xxLarge,
        color: COLORS.tertiary,
        fontFamily: FONT.bold,
        textAlign: "left"
    },
    subTitle: {
        fontSize: SIZES.medium,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        textAlign: "left"
    },
    titleContainer: {
        flex: 0.2,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingHorizontal: SIZES.large,
    },
    fieldContainer: {
        flex: 1,
        marginVertical: 32,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    input: {
        height: 48,
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: SIZES.small,
        borderColor: COLORS.tertiary,
        color: COLORS.tertiary,
        fontSize: SIZES.small,
        fontFamily: FONT.regular
    },
    buttonContainer: {
        position: "absolute",
        bottom: 60,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    registerButton: {
        backgroundColor: COLORS.tertiary,
        paddingVertical: SIZES.medium,
        borderRadius: SIZES.medium,
        marginTop: SIZES.medium
    },
    fancyUnderline: {
        textDecorationLine: "underline",
        textDecorationStyle: "dotted",
        textDecorationColor: COLORS.secondary
    },
    errorText: {
        color: "#ed4337",
        fontFamily: FONT.regular,
        marginBottom: 10,
        textAlign: "left",

        paddingHorizontal: SIZES.large
    }
})