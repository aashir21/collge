import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { MaterialIcons } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { setVerificationData } from "../../state/verification/verificationSlice"
import { useDispatch } from 'react-redux';

const RejectedVerification = () =>
{

    const dispatch = useDispatch()

    const retryVerification = () =>
    {

        dispatch(
            setVerificationData(
                {
                    key: "verificationType",
                    value: "SIGN_UP"
                }
            )
        )

        dispatch(
            setVerificationData(
                {
                    key: "isRetrying",
                    value: true
                }
            )
        )

        router.replace("/auth/verification/selfieWarning")

    }

    const logout = async () =>
    {
        await SecureStore.deleteItemAsync("__isLoggedIn")
        await SecureStore.deleteItemAsync("__refreshToken")
        await SecureStore.deleteItemAsync("__jwtToken")
        await SecureStore.deleteItemAsync("__userId")
        router.replace("/auth/login")
    }

    return (
        <View style={styles.container}>
            <MaterialIcons name="error-outline" size={150} color={COLORS.error} />
            <Text style={styles.title}>Unsuccessful <Text style={[styles.title, { color: COLORS.error }]}>Verification</Text></Text>
            <Text style={styles.subTitle}>Our team reviewed your request</Text>
            <Text style={[styles.subTitle, { marginTop: SIZES.small }]}>An email was sent to you from support@collge.io stating the reason for your rejection. Recitfy the mistakes and retry the verification process.</Text>
            <View style={styles.btnContainer}>
                <TouchableOpacity onPress={retryVerification} style={[styles.logoutBtn, { backgroundColor: COLORS.lightBlack }]}>
                    <MaterialCommunityIcons style={{ marginRight: 4 }} name="restart" size={24} color={COLORS.tertiary} />
                    <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>
                        Retry
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Text style={styles.btnTitle}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default RejectedVerification

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.primary,
        justifyContent: "center"
    },
    title: {
        fontSize: SIZES.large,
        color: COLORS.tertiary,
        fontFamily: FONT.bold
    },
    subTitle: {
        fontSize: SIZES.small,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        textAlign: "center",
        marginHorizontal: SIZES.medium
    },
    img: {
        height: 300,
        width: 300,
        objectFit: "contain"
    },
    logoutBtn: {
        paddingHorizontal: SIZES.large,
        paddingVertical: SIZES.small,
        backgroundColor: COLORS.tertiary,
        borderRadius: SIZES.medium,
        marginTop: SIZES.large,
        marginHorizontal: SIZES.small,
        flexDirection: "row",
        alignItems: "center"
    },
    btnTitle: {
        fontSize: SIZES.small,
        color: COLORS.primary,
        fontFamily: FONT.regular
    },
    btnContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    }

})