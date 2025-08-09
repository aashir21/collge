import { Keyboard, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, useWindowDimensions, Image, KeyboardAvoidingView, Platform, StatusBar, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Link, router, useNavigation } from "expo-router"
import { COLORS, FONT, SIZES, ENDPOINT } from '../../constants/theme'
import * as SecureStore from 'expo-secure-store';
import { useToast } from 'react-native-toast-notifications';
import * as Haptics from "expo-haptics"
import SpanText from "../General Component/SpanText"

const Login = () =>
{

    const { width } = useWindowDimensions()
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })
    const [errors, setErrors] = useState({})
    const [inValid, setInValid] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)

    const toast = useToast()

    const handleInputValidation = () =>
    {
        let errors = {};

        if (!credentials.username) errors.username = "Username is a required field";
        if (!credentials.password) errors.password = "Password is a required field";

        setErrors(errors);

        return Object.keys(errors).length === 0;
    }

    const handleLogin = async () =>
    {
        try
        {
            if (handleInputValidation())
            {
                setIsLoggingIn(true)

                const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password
                    })
                });

                if (response.ok)
                {
                    const data = await response.json();

                    // Use async/await for AsyncStorage operations
                    await SecureStore.setItemAsync('__isLoggedIn', 'true');
                    await SecureStore.setItemAsync('__isPremiumUser', String(data.isPremiumUser));
                    await SecureStore.setItemAsync('__isVerified', String(data.isVerified));
                    await SecureStore.setItemAsync('__jwtToken', data.jwtToken);
                    await SecureStore.setItemAsync('__userId', String(data.userId));
                    await SecureStore.setItemAsync('__username', data.username);
                    await SecureStore.setItemAsync('__email', data.email);
                    await SecureStore.setItemAsync('__avatar', data.avatarUri);
                    await SecureStore.setItemAsync('__refreshToken', data.refreshToken);
                    await SecureStore.setItemAsync('__universityId', String(data.universityId));
                    await SecureStore.setItemAsync('__role', data.role);
                    await SecureStore.setItemAsync('__firstName', data.firstName);

                    router.replace("/(tabs)/home/feeds")
                    router.setParams({
                        isLoggedin: "true"
                    })

                }
                else
                {
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Error
                    )
                    setInValid(true);
                    setIsLoggingIn(false)
                }

            }
            else
            {
                console.log("Error");

            }

        } catch (error)
        {
            toast.show("Something went wrong", {
                animationType: "slide-in",
                duration: 3000,
                placement: "top",
            })
            console.error(error);

        }
        finally
        {
            setIsLoggingIn(false)
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <ScrollView contentContainerStyle={{ flex: 1 }} scrollEnabled={true}>
                <View style={styles.container}>

                    <View style={[styles.titleContainer, { paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight + 12 }]}>
                        <Text style={[styles.heading, { width: width }]}>
                            Ready to get <SpanText subtext={"back"} /> in?
                        </Text>
                        <Text style={[styles.subTitle, { width: width }]}>
                            So much has happened!
                        </Text>
                    </View>
                    <View style={styles.fieldContainer}>

                        {
                            inValid ? <Text style={[styles.errorText, { width: width }]}>Invalid username or password!</Text> : null
                        }
                        {
                            errors.username ? <Text style={[styles.errorText, { width: width }]}>{errors.username}</Text> : null
                        }

                        <TextInput onChangeText={(text) =>
                        {
                            setCredentials({ ...credentials, username: text }); setInValid(false); setErrors({})
                        }} placeholderTextColor={COLORS.tertiary} autoCapitalize='none' placeholder='Username' style={[styles.input, { width: width - 32 }]}></TextInput>

                        {
                            errors.password ? <Text style={[styles.errorText, { width: width }]}>{errors.password}</Text> : null
                        }
                        <TextInput onChangeText={(text) =>
                        {
                            setCredentials({ ...credentials, password: text })
                            setInValid(false)
                        }
                        } placeholderTextColor={COLORS.tertiary} placeholder='Password' secureTextEntry={true} style={[styles.input, { width: width - 32 }]} autoCapitalize='none'></TextInput>
                        <TouchableOpacity disabled={isLoggingIn} onPress={handleLogin} style={[styles.signInBtn, { width: width - 32, opacity: isLoggingIn ? 0.25 : 1 }]}>
                            <Text style={{ fontFamily: FONT.regular, textAlign: "center", color: COLORS.primary, fontSize: SIZES.small }}>
                                Login
                            </Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: SIZES.large, justifyContent: "center" }}>
                            <Text style={{ color: COLORS.whiteAccent, fontSize: SIZES.small, fontFamily: FONT.regular }}>Forgot Password?
                            </Text>
                            <Link href={"/auth/emailcheck/"} asChild>
                                <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.small, marginLeft: SIZES.xSmall, color: COLORS.tertiary }}>Reset</Text>
                            </Link>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                            <Text style={{ color: COLORS.whiteAccent }}>Don't have an account?</Text>
                            <Pressable onPress={() => router.push("/auth/registerType")}>
                                <Text style={[styles.fancyUnderline, { color: "#FAFAFA", marginLeft: SIZES.xSmall, fontFamily: "Poppins-Bold", fontSize: SIZES.small }]} >Register</Text>
                            </Pressable>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    titleContainer: {
        // backgroundColor: COLORS.sucess,
        justifyContent: "space-around",
        alignItems: "flex-start",
        textAlign: "left",

    },
    fieldContainer: {
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "center",
        paddingHorizontal: SIZES.large,
        marginVertical: 32
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
    heading: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xxLarge,
        color: COLORS.tertiary,
        paddingHorizontal: SIZES.large,
        marginHorizontal: 12
    },
    buttonContainer: {
        justifyContent: "flex-end",
        alignItems: "center"
    },
    signInBtn: {
        backgroundColor: COLORS.tertiary,
        paddingHorizontal: SIZES.large,
        paddingVertical: SIZES.medium,
        borderRadius: SIZES.medium,
        margin: SIZES.small,
    },
    fancyUnderline: {
        textDecorationLine: "underline",
        textDecorationStyle: "dotted",
        textDecorationColor: COLORS.secondary
    },
    subTitle: {
        fontSize: SIZES.medium,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        textAlign: "left",
        paddingHorizontal: SIZES.xxLarge
    },
    errorText: {
        color: "#ed4337",
        fontFamily: FONT.regular,
        marginTop: 6,
        marginBottom: 2,
        textAlign: "left",
        paddingHorizontal: SIZES.large
    }
})

