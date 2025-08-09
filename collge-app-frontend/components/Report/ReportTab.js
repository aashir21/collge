import { Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import { customFetch } from "../../utility/tokenInterceptor"
import { router, useGlobalSearchParams } from 'expo-router'
import * as SecureStore from "expo-secure-store"
import { useToast } from 'react-native-toast-notifications'

const ReportTab = ({ title, type }) =>
{

    const { width } = useWindowDimensions()
    const globalParams = useGlobalSearchParams()
    const toast = useToast()
    const [isDisabled, setIsDisabled] = useState(false)

    const submitReport = async () =>
    {

        try
        {
            const actorId = SecureStore.getItem("__userId")

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/admin/report`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    actorId: actorId,
                    userId: globalParams?.reportUserId,
                    postId: globalParams?.reportPostId,
                    commentId: globalParams?.reportCommmentId,
                    reportType: globalParams?.reportType,
                    reportReason: title
                })

            })

            if (response.ok)
            {

                toast.show("Report submitted", {
                    placement: "top",
                    type: "normal",
                    duration: 3500
                })

                router.back()

            }
        } catch (err)
        {
            toast.show("Something went wrong...", {
                placement: "top",
                type: "normal",
                duration: 3500
            })
        }

    }

    return (
        <TouchableOpacity disabled={isDisabled} onPress={submitReport} style={[styles.container, { width: width - 32 }]}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}

export default ReportTab

const styles = StyleSheet.create({

    container: {
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.large,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.xLarge,
        marginTop: SIZES.small,
        alignSelf: "center"
    },
    title: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.fontBodySize
    }

})