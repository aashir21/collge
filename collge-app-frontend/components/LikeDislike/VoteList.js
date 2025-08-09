import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, FONT, SIZES, ENDPOINT } from '../../constants/theme'
import { useToast } from 'react-native-toast-notifications'
import SearchSkeleton from '../Loading/SearchSkeleton'
import { customFetch } from '../../utility/tokenInterceptor'
import VoteResult from '../SearchComponents/VoteResult'
import * as SecureStore from "expo-secure-store"

const VoteList = ({ postId, voteType, emptyStateText }) =>
{

    const [votes, setVotes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEmpty, setisEmpty] = useState(false)

    const toast = useToast()

    const handleFetchAllVotes = async () =>
    {

        const currentUserId = SecureStore.getItem("__userId")

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v2/post/getAllVotesByVoteType?userId=${currentUserId}&postId=${postId}&type=${voteType}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok)
            {

                const data = await response.json()
                if (data.length <= 0)
                {
                    setisEmpty(true)
                }
                setVotes(data)
                setIsLoading(false)

            }
        } catch (e)
        {
            toast.show("Something went wrong...", {
                type: "normal",
                duration: 3500,
                placement: "top",
                swipeEnabled: true
            })
        }
        finally
        {
            setIsLoading(false)
        }
    }

    useEffect(() =>
    {
        handleFetchAllVotes()
    }, [])

    if (isLoading)
    {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.primary, alignItems: "center", paddingTop: SIZES.medium }}>
                <SearchSkeleton />
            </View>
        )
    }

    if (isEmpty)
    {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: COLORS.tertiary, fontFamily: FONT.bold, fontSize: SIZES.xxLarge }}>{emptyStateText}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={votes}
                keyExtractor={(item) => item.voteId.toString()}
                renderItem={({ item }) => (
                    <View style={{ flex: 1 }}>
                        <VoteResult firstName={item.firstName} lastName={item.lastName} role={item.role} isPremiumUser={item.isPremiumUser} userId={item.userId} username={item.username} avatar={item.avatar} />
                    </View>
                )}

                scrollEventThrottle={16}
                bounces={true}
            />

        </View>
    )
}

export default VoteList

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.medium,
        alignItems: "center"
    }

})