import { ScrollView, StyleSheet, Text, View, useWindowDimensions, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import LinkUpCard from './LinkUpCard'
import { useDispatch, useSelector } from 'react-redux'
import TextTransition from '../General Component/TransitionText'
import LinkUpSettingsModal from '../Modals/PostSettingModal'
import * as SecureStore from "expo-secure-store"
import { useIsFocused } from '@react-navigation/native'
import { customFetch } from '../../utility/tokenInterceptor'
import { useToast } from 'react-native-toast-notifications'
import LinkUpHeaderComponent from './LinkUpHeaderComponent'
import SpanText from "../General Component/SpanText"
import { resetLinkUpPost, setLinkUpPost } from '../../state/linkup/linkupSlice'
import { set } from 'lodash'

const LinkUpHome = () =>
{

    const PAGE_SIZE = 15;

    const { width } = useWindowDimensions()
    const newLinkUpPostData = useSelector((state) => state.linkup)
    const dispatch = useDispatch();
    const isFocused = useIsFocused()

    const toast = useToast()

    const [linkUpPosts, setLinkUpPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);

    const [offset, setOffset] = useState(0)

    const messages = [
        "Houston, we have a post! 🚀",
        "Just a sec... 🙌",
        "Hold your horses! 🐎",
        "This is going to be a hit! 🎉"
    ];

    const onRefresh = useCallback(async () =>
    {

        setRefreshing(true);
        setIsLoading(true)
        dispatch(resetLinkUpPost());
        setLinkUpPosts([]);
        setOffset(0);

        setTimeout(async () =>
        {
            try
            {
                await Promise.all([fetchLinkUpPosts(offset)])
            } catch (err)
            {
                toast.show("Something went wrong", {
                    type: "normal",
                    duration: 3500,
                    placement: "top"
                })

            }

        }, 1000); // Adjust the delay (in milliseconds) as needed
    }, []);

    const fetchLinkUpPosts = async (offset) =>
    {

        const universityId = await SecureStore.getItem("__universityId");
        const currentUserId = await SecureStore.getItem("__userId");

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/linkup?userId=${currentUserId}&universityId=${universityId}&offset=${offset}&pageSize=${PAGE_SIZE}`, {
                method: "GET"
            })

            if (response.ok)
            {
                const data = await response.json()
                setLinkUpPosts([...linkUpPosts, ...data])
                setOffset((prevOffset) => prevOffset + 1);

            }

        } catch (e)
        {
            toast.show("Something went wrong", {
                type: "normal",
                duration: 3500,
                placement: "top"
            })
        }
        finally
        {
            setIsLoading(false)
        }

    }


    useEffect(() =>
    {

        fetchLinkUpPosts(offset)

    }, [])

    useEffect(() =>
    {
        if (newLinkUpPostData.isPosting)
        {
            setLinkUpPosts(prevPosts => [...prevPosts, newLinkUpPostData]);
        }
    }, [newLinkUpPostData.isPosting]);


    return (
        <View style={[styles.container, { width: width }]}>

            {
                isLoading ? <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                    :
                    <FlatList
                        data={linkUpPosts}
                        keyExtractor={(item) => item.postId.toString()}
                        ListHeaderComponent={<LinkUpHeaderComponent />}
                        style={{ marginVertical: SIZES.large }}
                        renderItem={({ item, index }) =>
                        (
                            <View>
                                {
                                    newLinkUpPostData.isPosting && index === 0 ? (
                                        <View>
                                            {
                                                newLinkUpPostData.responseStatus === null || newLinkUpPostData.responseStatus === 200 ?
                                                    <View style={{ flex: 1 }}>
                                                        <View style={!newLinkUpPostData.posted ? [styles.postingBanner, { width: width - 32, alignSelf: "center" }] : { display: "none" }}>
                                                            <TextTransition messages={messages} style={{ color: COLORS.tertiary, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize }} />
                                                            <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                                                        </View>
                                                        <View style={!newLinkUpPostData.posted ? styles.newPost : null}>

                                                            <View style={!newLinkUpPostData.posted ? [styles.postCover, { width: width - 32, alignSelf: "center" }] : { display: "none" }}></View>

                                                            <LinkUpCard postId={newLinkUpPostData.postId} userId={newLinkUpPostData.userId} author={newLinkUpPostData.author} collaborativeRequestStatus={newLinkUpPostData.collaborativeRequestStatus} universityName={null} avatar={newLinkUpPostData.avatar} time={newLinkUpPostData.time} date={newLinkUpPostData.date} location={newLinkUpPostData.location} caption={newLinkUpPostData.caption} invitedUser={newLinkUpPostData.invitedUser} createdAt={"Just now"} isLocationHidden={newLinkUpPostData.isLocationHidden} />

                                                        </View>
                                                    </View>
                                                    : <Text style={styles.conflictWarning}>Could not create LinkUp, another active LinkUp post was found. Please delete the previous one before you create a new one.</Text>
                                            }
                                        </View>
                                    ) : null
                                }

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
                                    />
                                </View>

                            </View>

                        )}
                        bounces={true}
                        ListEmptyComponent={
                            <View style={{ height: "100%", justifyContent: "center", alignItems: "center", marginTop: 100 }}>
                                <Text style={styles.emptyTitle}>Crickets... 🦗 No one’s up for a <SpanText subtext={"LinkUp"} /> </Text>
                                <Text style={styles.emptySubTitle}>Check again soon</Text>
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={16}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
            }

        </View>
    )
}

export default LinkUpHome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center"
    },
    linkUpContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: SIZES.medium
    },
    createBtn: {
        borderRadius: SIZES.large,
        backgroundColor: COLORS.textAccent,
        padding: SIZES.small,
        flexDirection: "row",
        alignItems: "center"
    },
    createBtnText: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.small,
        marginHorizontal: SIZES.small
    },
    postingBanner: {
        flexDirection: "row",
        zIndex: 15,
        position: "absolute",
        padding: SIZES.small,
        justifyContent: "space-between",
        backgroundColor: COLORS.lightBlack,
        borderTopLeftRadius: SIZES.large,
        borderTopRightRadius: SIZES.large
    },
    postCover: {
        height: "100%",
        position: "absolute",
        zIndex: 10,
        justifyContent: "center",
    },
    emptyTitle: {
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.tertiary,
        alignSelf: "flex-start",
        textAlign: "center",
        paddingHorizontal: SIZES.large
    },
    conflictWarning: {
        fontFamily: FONT.regular,
        color: COLORS.warning,
        fontSize: SIZES.small,
        textAlign: "left",
        paddingHorizontal: SIZES.small - 2,
        marginVertical: SIZES.small
    },
    emptySubTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        color: COLORS.whiteAccent,
        alignSelf: "center",
        textAlign: "center",
        paddingHorizontal: SIZES.large,
        marginTop: 8
    }
})