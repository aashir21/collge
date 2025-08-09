import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, useWindowDimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView, Pressable } from 'react-native'
import { SIZES, COLORS, FONT, ENDPOINT, NOTIFICATION_TYPES } from "../../constants/theme"
import { router } from "expo-router"
import * as SecureStore from 'expo-secure-store';
import DropDown from "react-native-dropdown-picker"
import GeneralLoading from "../Loading/GeneralLoading"
import { useDispatch, useSelector } from "react-redux"
import { useToast } from 'react-native-toast-notifications'
import { sendNotification } from '../../utility/notification'
import SpanText from '../General Component/SpanText'
import { setUniDetails } from '../../state/unidetails/uniDetailsSlice'
import { setVerificationData } from "../../state/verification/verificationSlice"

const PhotoUserUniDetails = () =>
{

    const { width } = useWindowDimensions();
    const [uniErrors, setUniErrors] = useState({
        isError: false,
        errorMsg: ""
    })

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
    const dispatch = useDispatch()


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

    const checkIfUserAlreadyExists = async () =>
    {
        const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/user/getUserByEmail?email=${registerData.email}`)
        return response.status
    }

    const checkForExisitingRequest = async () =>
    {

        const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/admin/verify/getVerificationStatusByEmail?email=${registerData.email}`)
        const existingReqStatus = await response.text()

        return existingReqStatus;

    }

    const validateAndStartVerification = async () =>
    {

        try
        {

            if (!validateForm())
            {
                return;
            }

            const isUserRegisteredAlreadyStatus = await checkIfUserAlreadyExists()
            const userVerificationStatus = await checkForExisitingRequest()

            if (isUserRegisteredAlreadyStatus === 200)
            {
                setUniErrors({ isError: true, errorMsg: "Looks like you're already registered with us." })
                return;
            }

            if (userVerificationStatus !== "NOT_PRESENT")
            {
                setUniErrors({ isError: true, errorMsg: "Looks like you already have a pending verification request. Please contact support@collge.io for help." })
                return;
            }

            dispatch(
                setUniDetails(
                    {
                        universityName: university,
                        email: registerData.email,
                        yearOfGraduation: selectedYear,
                        location: selectedLocation
                    }
                )
            )

            dispatch(
                setVerificationData(
                    {
                        key: "verificationType",
                        value: "SIGN_UP"
                    }
                )
            )

            router.replace("/auth/verification/selfieWarning")

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
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
            {
                !formState.isLoading ? <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

                    <View style={styles.container}>

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
                                    placeholder='Personal Email'
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
                                <TouchableOpacity disabled={isRegistering} onPress={validateAndStartVerification} style={[styles.registerButton, { width: width - 32, opacity: isRegistering ? 0.25 : 1 }]}>
                                    <Text style={{ fontFamily: FONT.regular, textAlign: "center" }}>
                                        Start Verification!
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </KeyboardAvoidingView>
                        <View style={styles.buttonContainer}>
                            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                <Text style={{ color: COLORS.whiteAccent }}>Need to change something?</Text>
                                <Pressable onPress={() => router.back()}>
                                    <Text style={[styles.fancyUnderline, { color: "#FAFAFA", margin: SIZES.xSmall, fontFamily: FONT.bold, fontSize: SIZES.small }]} >Go Back</Text>
                                </Pressable>
                            </View>

                            <TouchableOpacity style={{ width: "100%", flexDirection: "row" }}>
                                <Text style={{ fontFamily: FONT.regular, color: COLORS.whiteAccent, fontSize: SIZES.small }}>Cant see your university?</Text>
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

export default PhotoUserUniDetails

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