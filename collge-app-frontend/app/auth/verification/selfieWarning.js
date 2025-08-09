import React from 'react'
import SelfieWarning from '../../../components/Auth/SelfieWarning'
import { useSegments } from 'expo-router'


const selfieWarning = () =>
{
    const segments = useSegments()

    return (
        <SelfieWarning nextScreen={`${segments[0]}/${segments[1]}/selfieVerification`} />
    )
}

export default selfieWarning