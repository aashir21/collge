import React from 'react'
import UserVerificationOTP from "../../components/Auth/UserVerificationOTP"
import { useLocalSearchParams } from 'expo-router'

const verifyStatus = () =>
{
    const localSearchParams = useLocalSearchParams()
    return (
        <UserVerificationOTP email={localSearchParams?.email} userId={localSearchParams?.userId} />
    )
}

export default verifyStatus