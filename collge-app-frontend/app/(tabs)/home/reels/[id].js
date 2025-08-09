
import React from 'react'
import { useLocalSearchParams } from "expo-router"

import DynamicReelTemplate from '../../../../components/Reels/DynamicReelTemplate'



const ClickedReel = () =>
{

    const params = useLocalSearchParams()

    return (
        <DynamicReelTemplate dynamicPostId={params.id} vidSource={params.vidSource}
            username={params.username}
            userId={params.userId}
            universityId={params.universityId}
            avatar={params.avatar}
            role={params.role}
            isPremiumUser={params.isPremiumUser}
            votes={params.votes}
            caption={params.caption}
            name={params.name}
            currentPositionMillis={params.currentPositionMillis}
            likeStatus={params.likeStatus}
        />
    )
}

export default ClickedReel

