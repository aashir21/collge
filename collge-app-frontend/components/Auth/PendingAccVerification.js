import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, ENDPOINT } from "../../constants/theme"
import GeneralLoading from '../Loading/GeneralLoading'
import { useToast } from 'react-native-toast-notifications'
import PendingVerification from '../Verification/PendingVerification'
import * as SecureStore from "expo-secure-store"
import RejectedVerification from '../Verification/RejectedVerification'

const PendingAccVerification = () =>
{

    const [status, setStatus] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const toast = useToast()

    const getVerificationStatus = async () =>
    {

        const email = SecureStore.getItem("__email")

        try
        {
            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/admin/verify/getVerificationStatusByEmail?email=${email}`, {
                method: "GET"
            })

            if (response.ok)
            {
                const data = await response.text()

                setStatus(data)
            }
        } catch (e)
        {

            toast.show("Something went wrong...", {
                placement: "top",
                duration: 3500,
                type: "normal"
            })

        }
        finally
        {
            setIsLoading(false)
        }

    }

    useEffect(() =>
    {

        getVerificationStatus()

    }, [])

    if (status === "PENDING")
    {
        return <PendingVerification />
    }

    if (status === "REJECTED")
    {
        return <RejectedVerification />
    }

    if (isLoading)
    {
        return <GeneralLoading />
    }

}

export default PendingAccVerification

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    }

})