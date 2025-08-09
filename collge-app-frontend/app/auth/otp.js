import { View, Text } from 'react-native'
import React from 'react'
import OTP from '../../components/Auth/OTP'
import { useLocalSearchParams } from 'expo-router'

const otp = () =>
{
    const localSearchParams = useLocalSearchParams()
    return (
        <OTP email={localSearchParams?.email} />
    )
}

export default otp