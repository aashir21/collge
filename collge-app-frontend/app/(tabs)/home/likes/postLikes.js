import { useGlobalSearchParams } from 'expo-router'
import React from 'react'
import VoteList from '../../../../components/LikeDislike/VoteList'

const Likes = () =>
{

    const dynamicPostId = useGlobalSearchParams();
    return (
        <VoteList postId={dynamicPostId.id} voteType={"LIKED"} emptyStateText={"No fans yet 🤔"} />
    )

}

export default Likes
