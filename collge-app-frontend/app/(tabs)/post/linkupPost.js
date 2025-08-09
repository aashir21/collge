import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, ENDPOINT } from '../../../constants/theme'
import { customFetch } from "../../../utility/tokenInterceptor"
import { fetchUserIdFromStorage } from "../../../utility/general"
import { useToast } from 'react-native-toast-notifications'
import LinkUpVerification from '../../../components/LinkUp/LinkUpVerification'
import LinkUpPostPage from '../../../components/LinkUp/LinkUpPostPage'
import VerificationPending from "../../../components/Auth/VerificationPending"
import * as SecureStore from "expo-secure-store"
import GeneralLoading from '../../../components/Loading/GeneralLoading'

const LinkUpPostSettings = () =>
{

    const [isLinkUpVerified, setIsLinkUpVerified] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const toast = useToast()
    const [requestStatus, setRequestStatus] = useState("")

    const fetchUserLinkUpVerificationStatus = async () =>
    {
        try
        {
            const userId = fetchUserIdFromStorage()
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/user/getLinkUpVerificationStatus?userId=${userId}`)

            if (response.ok)
            {
                const data = await response.json()
                setIsLinkUpVerified(data)
            }
        } catch (err)
        {
            toast.show("Something went wrong...", {
                placement: "top",
                duration: 3000,
                type: "normal"
            })
        }
    }

    const fetchUserLinkUpVerificationRequestStatus = async () =>
    {
        try
        {
            const email = await SecureStore.getItemAsync("__email")
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/admin/verify/getVerificationStatusByEmail?email=${email}`)

            if (response.ok)
            {
                const data = await response.text()
                setRequestStatus(data)
            }
        } catch (err)
        {
            toast.show("Something went wrong...", {
                placement: "top",
                duration: 3000,
                type: "normal"
            })
        }
    }

    useEffect(() =>
    {

        Promise.all([fetchUserLinkUpVerificationStatus(), fetchUserLinkUpVerificationRequestStatus()])
            .then(() => setIsLoading(false))

    }, [])

    if (isLoading)
    {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
                <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {
                (isLinkUpVerified === true && requestStatus === "VERIFIED") ? <LinkUpPostPage />
                    :
                    (isLinkUpVerified === false && requestStatus === "PENDING")
                        ?
                        <VerificationPending />
                        :
                        <LinkUpVerification />
            }
        </SafeAreaView>
    )
}

export default LinkUpPostSettings

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    }

})