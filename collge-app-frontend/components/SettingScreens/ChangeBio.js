import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from "../../constants/theme"
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { customFetch } from '../../utility/tokenInterceptor';
import { useToast } from 'react-native-toast-notifications';
import * as SecureStore from "expo-secure-store"
import * as Haptics from "expo-haptics"
import GeneralLoading from "../Loading/GeneralLoading"

const ChangeBio = () =>
{

    const [isDisabled, setIsDisabled] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [input, setInput] = useState()
    const toast = useToast()

    const CHARACTER_LIMIT = 225

    const fetchCurrentUserBio = async () =>
    {

        const currentUserId = await SecureStore.getItem("__userId");

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/profile/getBio?userId=${currentUserId}`, {
                method: "GET"
            })

            if (response.ok)
            {
                const data = await response.text()
                setInput(data)
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
            setIsLoading(false)
        }

    }

    const submit = async () =>
    {

        setIsDisabled(true)
        toast.show("Updating bio...", {
            placement: "top",
            duration: 3500,
            type: "normal"
        })

        try
        {

            const trimmedBio = input.trim()

            if (trimmedBio >= CHARACTER_LIMIT)
            {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                )

                return;
            }

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/profile/updateBio`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: await SecureStore.getItem("__userId"),
                    bio: trimmedBio
                })
            })

            if (response.ok)
            {

                toast.show("User bio updated", {
                    placement: "top",
                    duration: 3500,
                    type: "normal"
                })

                router.back()
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

    useEffect(() =>
    {

        fetchCurrentUserBio()

    }, [])

    if (isLoading)
    {
        return <GeneralLoading />
    }

    return (
        <SafeAreaView style={[styles.container]}>
            <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: SIZES.xSmall, marginTop: SIZES.medium }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign style={{ marginRight: 8 }} name="left" size={24} color={COLORS.tertiary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>Change Bio</Text>
                    <Text style={styles.subTitle}>Describe yourself in a few words.</Text>
                </View>
            </View>

            <View style={{ marginTop: 30 }}>
                <Text style={[styles.textLimit, { color: input.length >= CHARACTER_LIMIT ? COLORS.error : COLORS.whiteAccent }]}>{input.length} / {CHARACTER_LIMIT}</Text>
                <TextInput defaultValue={input} multiline textAlignVertical="top" onChangeText={(text) => handleInput(text)} style={styles.input} autoFocus placeholder='New Bio' placeholderTextColor={COLORS.whiteAccent} />
                <TouchableOpacity onPress={submit} disabled={isDisabled} style={[styles.submitBtn, { opacity: isDisabled ? 0.5 : 1 }]}>
                    <Text style={styles.btnTitle}>Update</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default ChangeBio

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 24 : 0
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
        height: 128,
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
    textLimit: {
        alignSelf: "flex-end",
        fontSize: SIZES.small,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        paddingHorizontal: SIZES.large,
    }
})