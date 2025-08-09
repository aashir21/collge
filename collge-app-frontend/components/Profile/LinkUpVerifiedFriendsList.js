//@Authored by: Muhammad Aashir Siddiqui

import { Platform, SafeAreaView, StyleSheet, Text, useWindowDimensions, View, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import SpanText from "../General Component/SpanText"
import { customFetch } from '../../utility/tokenInterceptor'
import { useToast } from 'react-native-toast-notifications'
import FriendTab from './FriendTab'

const LinkUpVerifiedFriendsList = ({ userId }) =>
{
    const offset = useRef(0);
    const [friends, setFriends] = useState([])
    const PAGE_SIZE = 10;
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const fetchFriendList = async () =>
    {
        setIsLoading(true)
        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/friend/getFriends?userId=${userId}&offset=${offset.current}&pageSize=${PAGE_SIZE}`, {
                method: "GET"
            })

            if (response.ok)
            {

                const data = await response.json()

                setFriends([...friends, ...data])
                offset.current += 1

            }
        } catch (err)
        {
            toast.show("Something went wrong", {
                placement: "top",
                duration: 3000,
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
        fetchFriendList()

    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignSelf: "center", flex: 1 }}>
                <Text style={styles.title}>Invite a friend to a <SpanText subtext={"LinkUp"} /></Text>

                {
                    isLoading ? <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}><ActivityIndicator size={"small"} color={COLORS.whiteAccent} /></View>
                        :
                        <View style={{ flex: 1, paddingVertical: SIZES.medium }}>
                            <FlatList
                                data={friends}
                                scrollEnabled={true}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode="on-drag"
                                bounces={true}
                                keyExtractor={(item) => item.friendId.toString()}
                                renderItem={({ item, index }) =>
                                (
                                    <FriendTab
                                        userId={item.friendId}
                                        firstName={item.firstName}
                                        lastName={item.lastName}
                                        username={item.username}
                                        avatar={item.avatar}
                                        premiumUser={item.premiumUser}
                                        role={item.role}
                                        bgColor={COLORS.textAccent}
                                    />
                                )}
                            />
                        </View>
                }

            </View>
        </SafeAreaView>
    )
}

export default LinkUpVerifiedFriendsList

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "android" ? 48 : 0,
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge + 2,
        color: COLORS.tertiary
    }

})