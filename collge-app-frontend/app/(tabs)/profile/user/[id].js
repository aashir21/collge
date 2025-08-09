
import React from 'react'
import { router, useGlobalSearchParams, useLocalSearchParams } from "expo-router"
import DynamicUserTemplate from "../../../../components/Profile/DynamicUserTemplate"



const SearchedUser = () =>
{
    const params = useLocalSearchParams()

    return <DynamicUserTemplate dynamicUserId={params.id} />


}

export default SearchedUser

