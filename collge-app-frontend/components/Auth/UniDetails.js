import { Keyboard, KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, useWindowDimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView, Pressable } from 'react-native'
import { SIZES, COLORS, FONT, ENDPOINT, NOTIFICATION_TYPES, LINKS } from "../../constants/theme"
import { router } from "expo-router"
import * as SecureStore from 'expo-secure-store';
import DropDown from "react-native-dropdown-picker"
import GeneralLoading from "../Loading/GeneralLoading"
import { useSelector } from "react-redux"
import { useToast } from 'react-native-toast-notifications'
import { sendNotification } from '../../utility/notification'
import SpanText from '../General Component/SpanText'


const UniDetails = () =>
{

    const { width } = useWindowDimensions();
    const [uniErrors, setUniErrors] = useState({
        isError: false,
        errorMsg: ""
    })

    const personalDomains = ["hotmail.com", "gmail.com", "yahoo.com", "icloud.com", "live.com", "outlook.com", "aol.com"]


    const [formState, setFormState] = useState({
        isOpen: false,
        isUniOpen: false,
        isLocationOpen: false,
        isLoading: true,
        uniOptions: [],
        locationOptions: []
    });

    const [errors, setErrors] = useState({
        errorMsg: "",
        isUniNull: false,
        isYearNull: false,
        isLocationNull: false,
        isEmailNull: false
    })

    const toast = useToast()
    const [university, setUniversity] = useState(null)
    const [selectedYear, setSelectedYear] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [isRegistering, setIsRegistering] = useState(false)


    const userDetails = useSelector((state) => state.user);


    const [registerData, setRegisterData] = useState({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        username: userDetails.username,
        password: userDetails.password,
        universityName: "",
        email: "",
        yearOfGraduation: "",
        location: ""
    }, [])


    const yearOptions = Array.from({ length: 5 }, (_, index) => ({
        label: (new Date().getFullYear() + index).toString(),
        value: (new Date().getFullYear() + index).toString(),
    }));

    const fetchUniNames = async () =>
    {
        const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/university/getAllUniNames`)

        if (response.ok)
        {

            const data = await response.json()

            const options = Array.from({ length: data.length }, (_, index) => ({
                label: data[index],
                value: String(data[index])
            }));

            setFormState({ ...formState, isLoading: false, uniOptions: options })
        }
    }

    const handleUniOption = async (uniName) =>
    {

        const universityName = uniName()

        setUniversity(String(uniName()))


        try
        {
            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/university/getUniLocationsByName?uniName=${universityName}`)

            if (response.ok)
            {
                const data = await response.json();

                const locations = Array.from({ length: data.length }, (_, index) => ({
                    label: data[index],
                    value: String(data[index])
                }));

                setFormState({ ...formState, locationOptions: locations, isUniOpen: false })
            }

        } catch (err)
        {
            console.log(err);
        }

    }

    const validateForm = () =>
    {

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/


        if (university === null)
        {
            setErrors({ ...errors, errorMsg: "Please select a university, so we can connect you with the right people", isUniNull: true })
            return;
        }
        else if (!emailRegex.test(registerData.email))
        {
            setUniErrors({ isError: true, errorMsg: "Email is required, please enter a valid student email" })
            return;
        }
        else if (selectedYear === null)
        {
            setErrors({ ...errors, errorMsg: "We need to know when you're graduating", isYearNull: true })
            return;
        }
        else if (selectedLocation === null)
        {
            setErrors({ ...errors, errorMsg: "We need to know your campus, so you can connect with people you can bump into!", isLocationNull: true })
            return;
        }

        else
        {
            return true
        }
    }

    const handleSubmitData = async () =>
    {
        const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: userDetails.firstName.trim(),
                lastName: userDetails.lastName.trim(),
                username: userDetails.username.trim(),
                password: userDetails.password.trim(),
                universityName: university,
                email: registerData.email.trim(),
                yearOfGraduation: selectedYear,
                location: selectedLocation
            })
        })

        if (response.ok)
        {
            const data = await response.json();

            // Use async/await for AsyncStorage operations
            await SecureStore.setItem("__isLoggedIn", "true");
            await SecureStore.setItem("__avatar", String(data.avatarUri))
            await SecureStore.setItem("__isPremiumUser", String(data.isPremiumUser));
            await SecureStore.setItem("__isVerified", String(data.isVerified));
            await SecureStore.setItem("__jwtToken", data.jwtToken);
            await SecureStore.setItem("__refreshToken", data.refreshToken);
            await SecureStore.setItem("__userId", String(data.userId));
            await SecureStore.setItem("__username", data.username);
            await SecureStore.setItem("__email", data.email);
            await SecureStore.setItem("__universityId", String(data.universityId))
            await SecureStore.setItem("__registrationType", "EMAIL")

            sendNotification(data.userId, new Array(String(-1)), [data.universityId], "null", "null", "", NOTIFICATION_TYPES.APP_JOIN);

            router.replace({
                pathname: "/(tabs)/home/feeds",
                params: { email: registerData.email }
            })

        }
        else if (response.status === 409)
        {
            setUniErrors({ isError: true, errorMsg: "Looks like you're already registered with us." })
        }
    }

    const handleRegister = async () =>
    {

        try
        {
            const uniEmailValue = registerData.email.split("@")

            if (personalDomains.includes(uniEmailValue[1]))
            {

                setUniErrors({ isError: true, errorMsg: "Hold up! No personal emails, party pooper!" })

                return;
            }

            if (!validateForm())
            {
                return;
            }

            toast.show("Hold on! Signing you up", {
                placement: "top",
                animationType: "slide-in",
                duration: 3000,
                swipeEnabled: true,
                type: "normal"
            })

            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/university/checkUniEmail`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uniName: String(university),
                    uniEmail: String(uniEmailValue[1])
                })
            })

            if (response.ok)
            {
                handleSubmitData()
            }
            else if (response.status === 404)
            {
                //We have not reached your uni yet. But we will, promise!
                setUniErrors({ isError: true, errorMsg: `Something does'nt look right. Are you sure, this is a ${university} email?` })
            }
        }
        catch (err)
        {
            toast.show("Something went wrong", {
                animationType: "slide-in",
                placement: "top",
                duration: 3000,
                type: "normal"
            })
        }
        finally
        {
            setIsRegistering(false)
        }

    }


    useEffect(() =>
    {

        Promise.all[fetchUniNames()]

    }, [])


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary, paddingTop: Platform.OS === "android" ? 64 : 0 }}>
            {
                !formState.isLoading ? <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

                    <View style={styles.container}>
                        {/* <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                            style={{ alignSelf: "center" }}>
                            
                        </ScrollView> */}
                        <View style={[styles.titleContainer, { width: width }]}>
                            <Text style={[styles.title]}>Your <SpanText subtext={"University"} /> Details</Text>
                            <Text style={[styles.subTitle]}>Almost there.....</Text>
                        </View>
                        <KeyboardAvoidingView style={{ flex: 0.6 }} behavior={Platform.OS === 'ios' ? "padding" : "padding"}>
                            <View style={styles.fieldContainer}>
                                {errors.isUniNull ? <Text style={[styles.errorText, { width: width - 32 }]}>{errors.errorMsg}</Text> : null}
                                <DropDown
                                    placeholder='University'
                                    setOpen={() => setFormState({ ...formState, isUniOpen: !formState.isUniOpen })}
                                    open={formState.isUniOpen}
                                    value={university}
                                    setValue={(text) =>
                                    {
                                        handleUniOption(text)
                                        setErrors({ ...errors, isUniNull: false })
                                    }}
                                    style={[styles.dropdown, { width: width - 32, zIndex: 2, alignSelf: "center" }]}
                                    items={formState.uniOptions}
                                    placeholderStyle={{ fontFamily: FONT.regular }}
                                    zIndex={3}
                                    searchable={true}
                                    searchPlaceholder='Search University'

                                />

                                {
                                    uniErrors.isError ? <Text style={[styles.errorText, { width: width - 32 }]}>{uniErrors.errorMsg}</Text> : null
                                }

                                <TextInput
                                    onChangeText={(text) =>
                                    {
                                        setRegisterData({ ...registerData, email: text })
                                        setUniErrors(false)
                                    }}
                                    style={[styles.input, { width: width - 32, zIndex: 1, alignSelf: "center" }]}
                                    placeholder='Student Email'
                                    placeholderTextColor={COLORS.tertiary}
                                    autoCapitalize='none'
                                />
                                {errors.isYearNull ? <Text style={[styles.errorText, { width: width - 32 }]}>{errors.errorMsg}</Text> : null}
                                <DropDown
                                    placeholder='Year Of Graduation'
                                    setOpen={() => setFormState({ ...formState, isOpen: !formState.isOpen })}
                                    open={formState.isOpen}
                                    value={selectedYear}
                                    setValue={(text) =>
                                    {
                                        setSelectedYear(text)
                                        setErrors({ ...errors, isYearNull: false })
                                    }}
                                    style={[styles.dropdown, { width: width - 32, alignSelf: "center" }]}
                                    items={yearOptions}
                                    placeholderStyle={{ fontFamily: FONT.regular }}
                                    zIndex={2}
                                />
                                {errors.isLocationNull ? <Text style={[styles.errorText, { width: width - 32 }]}>{errors.errorMsg}</Text> : null}
                                <DropDown
                                    placeholder='Location'
                                    setOpen={() => setFormState({ ...formState, isLocationOpen: !formState.isLocationOpen })}
                                    open={formState.isLocationOpen}
                                    value={selectedLocation}
                                    setValue={(text) =>
                                    {
                                        setSelectedLocation(text)
                                        setErrors({ ...errors, isLocationNull: false })
                                    }}
                                    style={[styles.dropdown, { width: width - 32, alignSelf: "center" }]}
                                    items={formState.locationOptions}
                                    placeholderStyle={{ fontFamily: FONT.regular }}
                                    zIndex={1}

                                />
                                <TouchableOpacity disabled={isRegistering} onPress={handleRegister} style={[styles.registerButton, { width: width - 32, opacity: isRegistering ? 0.25 : 1 }]}>
                                    <Text style={{ fontFamily: FONT.regular, textAlign: "center" }}>
                                        Sign Up!
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </KeyboardAvoidingView>
                        <View style={styles.buttonContainer}>
                            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                <Text style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.small }}>Need to change something?</Text>
                                <Pressable onPress={() => router.back()}>
                                    <Text style={[styles.fancyUnderline, { color: "#FAFAFA", margin: SIZES.xSmall, fontFamily: FONT.bold, fontSize: SIZES.small }]} >Go Back</Text>
                                </Pressable>
                            </View>

                            <TouchableOpacity style={{ width: "100%", flexDirection: "row" }}>
                                <Text style={{ fontFamily: FONT.regular, color: COLORS.whiteAccent, fontSize: SIZES.small }}>Can't see your university?</Text>
                                <TouchableOpacity onPress={() => Linking.openURL(LINKS.UNIVERSITY_REGISTRATION)}>
                                    <Text style={{ fontFamily: FONT.bold, color: COLORS.tertiary, fontSize: SIZES.small, marginHorizontal: SIZES.xSmall - 2 }}>Click here</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback> : <GeneralLoading />
            }
        </SafeAreaView>
    )
}

export default UniDetails

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
        fontSize: SIZES.large,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        textAlign: "left"
    },
    titleContainer: {
        flex: 0.2,
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingHorizontal: SIZES.large,

    },
    fieldContainer: {
        marginVertical: 32,
        justifyContent: "center",
        alignItems: "center",


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
    buttonContainer: {
        flex: 0.2,
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
    }
    ,
    dropdown: {
        height: 52,
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: SIZES.small,
        borderColor: COLORS.tertiary,
        color: COLORS.tertiary,
        fontFamily: FONT.regular,

    },
    dropdownAndroid: {
        // Additional styles for Android
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
    }
    ,
    errorText: {
        color: "#ed4337",
        fontFamily: FONT.regular,
        marginBottom: 10,
        textAlign: "left",
    }
})