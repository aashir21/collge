import { StyleSheet, Text, View, useWindowDimensions, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import LinkUpCard from './LinkUpCard'
import { useSelector } from 'react-redux'
import PostSettingModal from '../Modals/PostSettingModal'
import * as SecureStore from "expo-secure-store"
import { useIsFocused } from '@react-navigation/native'
import { customFetch } from '../../utility/tokenInterceptor'
import { useToast } from 'react-native-toast-notifications'
import LinkUpHeaderComponent from './LinkUpHeaderComponent'
import SpanText from "../General Component/SpanText"
import LinkUpBlazeScreen from '../BlazeComponents/LinkUpBlazeScreen'

const LinkUpCampusPosts = () =>
{

    const PAGE_SIZE = 15;

    const { width } = useWindowDimensions()
    const newLinkUpPostData = useSelector((state) => state.linkup)
    const isFocused = useIsFocused()

    const toast = useToast()

    const [isDeleted, setIsDeleted] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [linkUpPosts, setLinkUpPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);

    const [offset, setOffset] = useState(0)

    const showModal = () => setIsModalVisible(true);
    const hideModal = () => setIsModalVisible(false);

    const deletePost = () => setIsDeleted(true)

    const [isPremiumUser, setIsPremiumUser] = useState(false);

    const messages = [
        "Houston, we have a post! 🚀",
        "Just a sec... 🙌",
        "Hold your horses! 🐎",
        "This is going to be a hit! 🎉"
    ];

    const onRefresh = useCallback(async () =>
    {
        setRefreshing(true);

        setTimeout(async () =>
        {
            try
            {
                setLinkUpPosts([]);
                await Promise.all([fetchLinkUpCampusPosts(0)])
                    .then(() =>
                    {
                        setRefreshing(false);
                        setIsLoading(false)
                    });
                setOffset(0);
            } catch (err)
            {
                toast.show("Something went wrong", {
                    type: "normal",
                    duration: 3500,
                    placement: "top"
                })

                console.error(err)
            }
            finally
            {
                setRefreshing(false)
            }

        }, 1000); // Adjust the delay (in milliseconds) as needed
    }, []);

    const fetchLinkUpCampusPosts = async (offset) =>
    {

        const universityId = await SecureStore.getItem("__universityId");
        const currentUserId = await SecureStore.getItem("__userId");

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/linkup/getAllLinkUpsByCampus?userId=${currentUserId}&universityId=${universityId}&offset=${offset}&pageSize=${PAGE_SIZE}`, {
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

        Promise.all([fetchLinkUpCampusPosts(offset)])

    }, [])



    return (
        <View style={[styles.container, { width: width }]}>

            {
                isLoading ? <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                    :
                    <FlatList
                        data={linkUpPosts}
                        keyExtractor={(item) => item.postId.toString()}
                        style={{ marginVertical: SIZES.large }}
                        renderItem={({ item, index }) =>
                        (
                            <View>
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
                                        showModal={showModal}
                                        postId={item.postId}
                                        collaborativeRequestStatus={item.collaborativeRequestStatus}
                                        isCollaborativePost={item.collaborativePost}
                                    />
                                    {isModalVisible && (
                                        <PostSettingModal userId={item.authorId} postId={newLinkUpPostData.postId} isVisible={isModalVisible} sourceScreen={"HOME"} onClose={hideModal} deletePost={deletePost} />
                                    )}
                                </View>

                            </View>

                        )}
                        bounces={true}
                        ListEmptyComponent={
                            <View style={{ height: "100%", justifyContent: "center", alignItems: "center", marginTop: 168 }}>
                                <Text style={styles.emptyTitle}>Looks like no one is in the mood to <SpanText subtext={"LinkUp"} /> 😴</Text>
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

export default LinkUpCampusPosts

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