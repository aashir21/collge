import { useGlobalSearchParams } from 'expo-router'
import React from 'react'
import VoteList from '../../../../components/LikeDislike/VoteList'

const Dislikes = () =>
{

    const dynamicPostId = useGlobalSearchParams();
    return (
        <VoteList postId={dynamicPostId.id} voteType={"DISLIKED"} emptyStateText={"No haters here 🤘🏻"} />
    )

}

export default Dislikes