import { ActivityIndicator, FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, ENDPOINT, FONT, NOTIFICATION_TYPES, SIZES } from '../../constants/theme'
import { useToast } from 'react-native-toast-notifications'
import { customFetch } from "../../utility/tokenInterceptor"
import * as SecureStore from "expo-secure-store"
import EmptyNearbyList from './EmptyNearbyList'
import NearbyTab from './NearbyTab'
import { sendNotification } from '../../utility/notification'

const NearbySearchResults = () =>
{

    const [nearbyUsers, setNearbyUsers] = useState([])
    const toast = useToast()
    const [offset, setOffset] = useState(0)
    const [loading, setLoading] = useState(true)
    const [notifyUsers, setNotifyUsers] = useState(false)
    const PAGE_SIZE = 10

    const getAListOfUserId = (users) =>
    {

        let extractedUserIds = []

        users.forEach((user) =>
        {
            extractedUserIds.push(user.userId)
        })


        return extractedUserIds;

    }

    const fetchNearbyUsers = async () =>
    {

        const currentUserId = SecureStore.getItem("__userId")

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/nearby?userId=${currentUserId}&offset=${offset}&pageSize=${PAGE_SIZE}`, {
                method: "GET"
            })

            if (response.ok)
            {

                const data = await response.json()
                setNearbyUsers([...data, ...nearbyUsers])
                setOffset((prevOffset) => prevOffset + 1)

                if (data.length > 0)
                {
                    let toNotify = getAListOfUserId(data)

                    const actorId = parseInt(currentUserId)
                    sendNotification(actorId, toNotify, [0], null, "null", "", NOTIFICATION_TYPES.NEARBY)
                    toNotify = []
                }

            }
        } catch (err)
        {
            toast.show("Something went wrong...", {
                placement: "top",
                duration: 3000,
                type: "normal"
            })
        }
        finally
        {
            setLoading(false)
        }

    }

    useEffect(() =>
    {

        fetchNearbyUsers()

    }, [])

    if (loading)
    {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
                <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: "column", paddingHorizontal: SIZES.large }}>
                <Text style={styles.title}>Nearby</Text>
                <Text style={styles.subTitle}>People Near You</Text>
            </View>

            {
                nearbyUsers.length > 0
                    ?
                    <FlatList
                        style={{ marginVertical: 8 }}
                        data={nearbyUsers}
                        keyExtractor={(item) => item.nearbyEntryId}
                        renderItem={({ item }) => (
                            <View style={{ flex: 1 }}>
                                <NearbyTab uniName={item.uniName} firstName={item.firstName} lastName={item.lastName} role={item.role} isPremiumUser={item.isPremiumUser} userId={item.userId} username={item.username} avatar={item.avatar} lastTimeAtLocation={item.lastTimeAtLocation} />
                            </View>
                        )}

                        scrollEventThrottle={16}
                        bounces={true}
                    />
                    :
                    <EmptyNearbyList />
            }

        </SafeAreaView>
    )
}

export default NearbySearchResults

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 16 : 0
    },
    title: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.xxLarge + 2,
    },
    subTitle: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.medium,
    }

})