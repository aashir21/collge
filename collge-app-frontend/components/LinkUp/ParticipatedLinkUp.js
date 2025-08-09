import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, ENDPOINT, SIZES, FONT } from "../../constants/theme"
import { customFetch } from "../../utility/tokenInterceptor"
import * as SecureStore from "expo-secure-store"
import { useToast } from 'react-native-toast-notifications'
import LinkUpCard from './LinkUpCard'
import SpanText from '../General Component/SpanText'

const ParticipatedLinkUp = () =>
{

    const [isLoading, setIsLoading] = useState(true)
    const offset = useRef(0)
    const [linkups, setLinkUps] = useState([])
    const PAGE_SIZE = 7
    const toast = useToast()

    const fetchUserLinkUps = async () =>
    {

        try
        {
            const currentUser = SecureStore.getItem("__userId")

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/linkup/getAllLinkUpsByParticipantId?participantId=${currentUser}&offset=${offset.current}&pageSize=${PAGE_SIZE}`)
            if (response.ok)
            {
                const data = await response.json()
                setLinkUps([...data, ...linkups])
                offset.current += 1
            }
        } catch (e)
        {
            toast.show("Something went wrong...", {
                placement: "top",
                duration: 3500,
                type: "normal"
            })
        }
        finally
        {
            setIsLoading(false)
        }

    }

    useEffect(() =>
    {

        fetchUserLinkUps()

    }, [])

    if (isLoading)
    {

        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
                <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
            </View>
        )

    }

    return (
        <View style={styles.container}>
            {
                linkups.length > 0 ?
                    <FlatList
                        data={linkups}
                        keyExtractor={(item) => item.postId.toString()}
                        style={{ marginVertical: SIZES.large }}
                        renderItem={({ item, index }) =>
                        (
                            <View>
                                <LinkUpCard
                                    userId={item.authorId}
                                    author={item.authorDTO}
                                    time={item.time}
                                    date={item.date}
                                    friendId={item.friendId}
                                    location={item.location}
                                    caption={item.caption}
                                    invitedUser={item.friendDTO}
                                    createdAt={item.createdAt}
                                    isLocationHidden={item.locationHidden}
                                    postId={item.postId}
                                    collaborativeRequestStatus={item.collaborativeRequestStatus}
                                    isCollaborativePost={item.collaborativePost}
                                    status={item.status}
                                />
                            </View>

                        )}
                        bounces={true}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={16}
                    />
                    :
                    <View style={{ justifyContent: "center", alignItems: "center", alignSelf: "center", height: "100%", }}>
                        <Text style={styles.emptyTitle}>Not participated in any <SpanText subtext={"LinkUps"} /> so far </Text>
                    </View>
            }
        </View>
    )
}

export default ParticipatedLinkUp

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    },
    emptyTitle: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge + 2,
        color: COLORS.tertiary,
        alignSelf: "flex-start",
        textAlign: "center",
        paddingHorizontal: SIZES.large
    },

})