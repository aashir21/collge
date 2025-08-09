import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES, FONT, ENDPOINT, REPORT_TYPES } from '../../constants/theme'
import { MaterialIcons } from '@expo/vector-icons'
import { useToast } from 'react-native-toast-notifications'
import * as SecureStore from "expo-secure-store"
import { customFetch } from '../../utility/tokenInterceptor'
import { router } from 'expo-router'

const AppReport = () =>
{

    const [input, setInput] = useState()
    const [isDisabled, setIsDisabled] = useState(false)
    const toast = useToast()

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

    const submitReport = async () =>
    {

        const userId = SecureStore.getItem("__userId")
        setIsDisabled(true)

        try
        {

            const reponse = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/admin/report`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    actorId: userId,
                    userId: null,
                    postId: null,
                    commentId: null,
                    reportType: REPORT_TYPES.APP_REPORT,
                    reportReason: input.trim()
                })
            })

            if (reponse.ok)
            {
                toast.show("Report submitted", {
                    placement: "top",
                    duration: 3000,
                    type: "normal"
                })

                router.back()
            }

        } catch (err)
        {
            toast.show("Something went wrong...", {
                placement: "top",
                duration: 3500,
                type: "normal"
            })
        }
        finally
        {
            setIsDisabled(false)
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : SIZES.medium }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", paddingHorizontal: SIZES.large }}>
                    <MaterialIcons name="bug-report" size={28} color={COLORS.error} style={styles.settingsIcon} />
                    <Text style={styles.title}>Report A Bug</Text>
                </View>
                <Text style={styles.subTitle}>
                    Report any problems with the app, its features or functionality. Please do not report any posts / users here.
                </Text>

                <TextInput defaultValue={input} multiline textAlignVertical="top" onChangeText={(text) => handleInput(text)} style={styles.input} autoFocus placeholder='Describe the issue. Give as much details as possible.' placeholderTextColor={COLORS.whiteAccent} />
                <TouchableOpacity onPress={submitReport} disabled={isDisabled} style={[styles.submitBtn, { opacity: isDisabled ? 0.5 : 1 }]}>
                    <Text style={styles.btnTitle}>Report</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default AppReport

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    },
    settingsIcon: {
        maxWidth: "10%",
        alignSelf: "center"
    },
    title: {
        color: COLORS.tertiary,
        fontSize: SIZES.xLarge + 2,
        fontFamily: FONT.bold,
        paddingHorizontal: SIZES.xSmall,
    },
    subTitle: {
        color: COLORS.whiteAccent,
        fontSize: SIZES.small,
        fontFamily: FONT.regular,
        paddingHorizontal: SIZES.large
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
        fontFamily: FONT.regular,
        marginTop: SIZES.xxLarge
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

})