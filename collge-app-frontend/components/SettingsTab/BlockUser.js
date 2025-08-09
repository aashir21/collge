import { StyleSheet, Text, useWindowDimensions, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS, ENDPOINT, FONT, REPORT_REQUEST_TYPES, SIZES } from '../../constants/theme'
import { MaterialIcons } from '@expo/vector-icons';
import { navigateToReportPage } from '../../utility/navigation';
import * as SecureStore from "expo-secure-store"
import { useToast } from 'react-native-toast-notifications';
import { router } from 'expo-router';

const BlockUser = ({ userId, onClose }) =>
{
    const { width } = useWindowDimensions()
    const [isDisabled, setIsDisabled] = useState(false)
    const toast = useToast()

    const fetchBlockUser = async () =>
    {

        setIsDisabled(true)

        try
        {
            const currentUserId = SecureStore.getItem("__userId");

            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/user/block`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    blockerId: currentUserId,
                    blockedId: userId
                })
            })

            if (response.ok)
            {

                toast.show("User Blocked! Refresh the feed / app to see changes", {
                    placement: "top",
                    duration: 3000,
                    type: "normal"
                })

                onClose()
                router.back()

            }

        } catch (err)
        {
            toast.show("Something went wrong", {
                placement: "top",
                duration: 3000,
                type: "normal"
            })
        }
        finally
        {
            setIsDisabled(false)
        }

    }

    return (
        <TouchableOpacity onPress={fetchBlockUser} disabled={isDisabled} style={[styles.container, { width: width - 32, opacity: isDisabled ? 0.2 : 1 }]}>
            <View style={styles.innerContainer}>
                <MaterialIcons name="block" size={22} color={COLORS.error} />
                <Text style={styles.tabName}>Block User</Text>
            </View>
        </TouchableOpacity>
    )
}

export default BlockUser

const styles = StyleSheet.create({

    container: {
        alignSelf: "center",
        backgroundColor: COLORS.lightBlack,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.large,
        borderRadius: SIZES.large,
        marginBottom: SIZES.small
    },
    innerContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center"
    },
    tabName: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        marginHorizontal: SIZES.medium
    }

})