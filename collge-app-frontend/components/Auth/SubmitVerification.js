import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from "../../constants/theme"
import GeneralLoading from '../Loading/GeneralLoading'
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import * as SecureStore from "expo-secure-store"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from 'expo-router';
import { useSelector } from 'react-redux';

const SubmitVerification = ({ verificationType, selfie, cardFront, cardRear, shouldDisplayButton, isRetrying }) =>
{

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const userDetails = useSelector((state) => state.user);
    const uniDetails = useSelector((state) => state.uniDetails)

    const { width } = useWindowDimensions()

    const submitVerificationData = async () =>
    {
        const formData = new FormData();

        let emailToSendInRequest = await SecureStore.getItem("__email");
        let storedEmail = await SecureStore.getItem("__email");

        if (!isRetrying)
        {
            emailToSendInRequest = (verificationType === "LINKUP") ? storedEmail : uniDetails.email
        }

        // Append each file individually to FormData

        formData.append('files', {
            uri: selfie,
            type: 'image/jpeg',
            name: `selfie_${Date.now()}.jpg`
        });

        formData.append('files', {
            uri: cardFront,
            type: 'image/jpeg',
            name: `cardFront_${Date.now()}.jpg`
        });

        formData.append('files', {
            uri: cardRear,
            type: 'image/jpeg',
            name: `cardRear_${Date.now()}.jpg`
        });

        // Append the verification data as a stringified JSON
        const verificationData = {
            email: emailToSendInRequest,
            verificationType: verificationType
        };


        formData.append('verificationDataRequest', JSON.stringify(verificationData));

        try
        {
            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/admin/verify`, {
                method: "POST",
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.ok && verificationType === "SIGN_UP" && isRetrying)
            {
                router.replace({
                    pathname: "/(tabs)/home/feeds",
                    params: { email: emailToSendInRequest }
                })
            }

            if (response.ok && verificationType === "SIGN_UP" && !isRetrying)
            {
                await registerUser()
            }

        } catch (err)
        {
            setIsError(true);
        } finally
        {
            setIsLoading(false);
        }
    };

    const registerUser = async () =>
    {

        const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/auth/registerByPhotoID`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: userDetails.firstName.trim(),
                lastName: userDetails.lastName.trim(),
                username: userDetails.username.trim(),
                password: userDetails.password.trim(),
                universityName: uniDetails.universityName,
                email: uniDetails.email.trim(),
                yearOfGraduation: uniDetails.yearOfGraduation,
                location: uniDetails.location
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
            await SecureStore.setItem("__registrationType", "PHOTO_ID")

            router.replace({
                pathname: "/(tabs)/home/feeds",
                params: { email: uniDetails.email }
            })

        }

    }

    const navigateToHome = () =>
    {
        router.replace("/(tabs)/home")
    }

    useEffect(() =>
    {

        submitVerificationData()

    }, [])


    if (isLoading)
    {
        return <GeneralLoading title={"All set! Sending verification request!"} subtext={"Do not close the application."} />
    }

    if (isError == true)
    {

        return (
            <SafeAreaView style={styles.container}>

                <MaterialIcons name="error-outline" size={150} color={COLORS.error} />
                <Text style={styles.title}>Verification submission failed!</Text>
                <Text style={styles.subTitle}>Something went wrong while trying to submit verification request</Text>

                {
                    shouldDisplayButton && verificationType === "LINKUP" ?
                        <View>
                            <TouchableOpacity style={styles.startBtn} onPress={navigateToHome}>
                                <Text style={styles.btnTitle}>Continue using Collge</Text>
                            </TouchableOpacity>
                        </View> : null
                }

            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={[styles.container]}>

            <View style={{ width: width - 32, alignSelf: "center", justifyContent: "center" }}>

                <AntDesign style={{ alignSelf: "center" }} name="checkcircleo" size={180} color={COLORS.secondary} />
                <View style={{ marginVertical: SIZES.medium }}>
                    <Text style={styles.title}>Successfully submitted verification!</Text>
                    <Text style={styles.subTitle}>Hold on tight! Our team is reviewing your details and will get back to you soon!</Text>
                </View>

                {
                    shouldDisplayButton && verificationType === "LINKUP" ?
                        <View>
                            <TouchableOpacity style={styles.startBtn} onPress={navigateToHome}>
                                <Text style={styles.btnTitle}>Continue using Collge</Text>
                            </TouchableOpacity>
                            <Text style={styles.subTitle}>Meanwhile you can continue using Collge!</Text>
                        </View>
                        :
                        null
                }
            </View>

        </SafeAreaView>
    )
}

export default SubmitVerification

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
    },
    title: {
        fontSize: SIZES.xLarge + 2,
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        textAlign: "center"
    },
    subTitle: {
        fontSize: SIZES.fontBodySize,
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        textAlign: "center"
    },
    startBtn: {
        paddingVertical: SIZES.medium,
        paddingHorizontal: SIZES.large,
        backgroundColor: COLORS.textAccent,
        width: "50%",
        alignSelf: "center",
        marginVertical: SIZES.medium,
        borderRadius: SIZES.large
    },
    btnTitle: {
        fontFamily: FONT.regular,
        color: COLORS.secondary,
        fontSize: SIZES.small,
        textAlign: "center"
    }

})