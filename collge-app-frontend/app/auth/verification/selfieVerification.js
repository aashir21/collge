import React from 'react'
import VerificationCamera from "../../../components/Camera/VerificationCamera"
import { AUTH_PROPS_TYPE } from "../../../constants/theme"
import { useSegments } from 'expo-router'

const SelfieVerification = () =>
{
    const segments = useSegments()

    return (
        <VerificationCamera title={"Selfie"} facing={"front"} propToUpdate={AUTH_PROPS_TYPE.SELFIE} nextScreenPath={`/${segments[0]}/${segments[1]}/cardFrontWarning`} />
    )
}

export default SelfieVerification
