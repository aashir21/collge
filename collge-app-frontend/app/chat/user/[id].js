
import React from 'react'
import { useLocalSearchParams } from "expo-router"
import DynamicUserTemplate from "../../../components/Profile/DynamicUserTemplate"



const SearchedUser = () =>
{
    const params = useLocalSearchParams()

    return <DynamicUserTemplate dynamicUserId={params.id} friendScreenUrl={params.nextScreenUrl} />


}

export default SearchedUser

