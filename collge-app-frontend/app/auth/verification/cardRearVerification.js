import React from 'react'
import VerificationCamera from "../../../components/Camera/VerificationCamera"
import { AUTH_PROPS_TYPE } from "../../../constants/theme"
import { useSegments } from 'expo-router'

const cardFrontVerification = () =>
{
    const segments = useSegments()

    return (
        <VerificationCamera title={"Card Rear"} facing={"back"} propToUpdate={AUTH_PROPS_TYPE.CARD_REAR} nextScreenPath={`/${segments[0]}/${segments[1]}/submitVerification`} />
    )
}

export default cardFrontVerification