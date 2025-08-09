import React from 'react'
import { useSelector } from 'react-redux'
import SubmitVerification from "../../../components/Auth/SubmitVerification";

const submitVerification = () =>
{

    const verificationState = useSelector((state) => state.verification);

    return (
        <SubmitVerification isRetrying={verificationState.isRetrying} verificationType={verificationState.verificationType} selfie={verificationState.selfie} cardFront={verificationState.cardFront} cardRear={verificationState.cardRear} shouldDisplayButton={true} />
    )
}

export default submitVerification
