
import React from 'react'
import VerificationCamera from "../../../components/Camera/VerificationCamera"
import { AUTH_PROPS_TYPE } from "../../../constants/theme"
import { useSegments } from 'expo-router'

const cardFrontVerification = () =>
{
    const segments = useSegments()

    return (
        <VerificationCamera title={"Card Front"} facing={"back"} propToUpdate={AUTH_PROPS_TYPE.CARD_FRONT} nextScreenPath={`/${segments[0]}/${segments[1]}/cardRearWarning`} />
    )
}

export default cardFrontVerification