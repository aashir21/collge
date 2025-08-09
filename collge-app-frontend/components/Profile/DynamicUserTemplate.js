//@Authored by: Muhammad Aashir Siddiqui

import
{
    StyleSheet, RefreshControl,
    View, useWindowDimensions, SafeAreaView, FlatList
} from 'react-native'
import { useEffect, useState, useRef, useCallback } from 'react'
import React from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import ProfileSkeleton from "../../components/Loading/ProfileSkeleton"
import * as SecureStore from 'expo-secure-store';
import Profile from "../../components/Profile/Profile"
import MiniReelTemplate from '../../components/Reels/MiniReelTemplate'
import ImagePost from '../../components/Posts/ImagePost'
import FrndProfileInfo from '../../components/Profile/FrndProfileInfo'
import { customFetch } from '../../utility/tokenInterceptor'
import { useLocalSearchParams } from 'expo-router'
import BottomSheetCommentsModal from '../Modals/BottomSheetCommentsModal'
import EmptyFeed from '../Home/EmptyFeed'
import { useToast } from 'react-native-toast-notifications'


const SearchedUser = ({ dynamicUserId, friendScreenUrl }) =>
{

    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true)
    const [storageUserId, setStorageUserId] = useState(null)
    const { width } = useWindowDimensions();
    const [offset, setOffset] = useState(0)
    const [content, setContent] = useState([])

    const localParams = useLocalSearchParams()
    const toast = useToast()

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () =>
    {
        setRefreshing(true);
        setOffset(0)
        setContent([]);

        try
        {
            await Promise.all([fetchUserData(), fetchUserPosts(offset), getUserIdFromStorage()]);
            setOffset(0);

        } catch (err)
        {
            toast.show("Something went wrong...", {
                placement: "top",
                duration: 3500,
                type: "normal"
            })
        } finally
        {
            setRefreshing(false);
        }
    }, []);



    const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
    const onViewableItemsChanged = ({ viewableItems }) =>
    {
        if (viewableItems.length > 0)
        {
            setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
        }
    }
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    const [showCommentsModal, setShowCommentsModal] = useState({
        isVisible: false,
        postId: null,
        userId: null
    })

    const openCommentsModal = (postId, userId) => setShowCommentsModal(
        {
            isVisible: true,
            postId: postId,
            userId: userId
        }
    )
    const closeCommentsModal = () => setShowCommentsModal(
        {
            isVisible: false,
            postId: null,
            userId: null
        }
    )

    const fetchUserData = async () =>
    {

        try
        {
            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/user/getUserLinkUpDataByAuthorId?userId=${localParams.actorId ? localParams.actorId : dynamicUserId}`)

            if (response.ok)
            {
                const data = await response.json();
                setUserData(data);

            }
        }
        catch (err)
        {

            toast.show("Something went wrong", {
                type: "normal",
                duration: 3000,
                placement: "top",
                offset: 30,
                animationType: "slide-in",
            });


        }
        finally
        {
            setLoading(false)
        }


    }

    const getUserIdFromStorage = async () =>
    {
        const fromStorageUserId = await SecureStore.getItem("__userId");
        setStorageUserId(fromStorageUserId)
    }

    const fetchUserPosts = async (pageNum) =>
    {

        try
        {

            const currentUserId = SecureStore.getItem("__userId");

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/post/getPostsByUserId/${localParams.actorId ? localParams.actorId : dynamicUserId}?offset=${pageNum}&pageSize=5&requestorId=${currentUserId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok)
            {
                const data = await response.json();
                setOffset(offset + 1)
                setContent([...content, ...data])

            }

        } catch (error)
        {
            console.log(error);

            toast.show("Something went wrong", {
                type: "normal",
                duration: 3000,
                placement: "top",
                offset: 30,
                animationType: "slide-in",
            });

        }
        finally
        {
            setLoading(false)
        }

    }

    useEffect(() =>
    {
        Promise.all([
            fetchUserData(),
            getUserIdFromStorage(),
            fetchUserPosts(0),
        ])

    }, [])

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
            {
                loading ? <ProfileSkeleton /> : (dynamicUserId == storageUserId) ? <Profile /> : <FlatList

                    data={content}
                    ListHeaderComponent={<FrndProfileInfo campus={userData.campus} yearOfGraduation={userData.yearOfGraduation} bio={userData.bio} friendListUrl={friendScreenUrl} isWinkable={userData.winkable} universityId={userData.universityId} userId={userData.userId} avatar={userData.avatar} firstName={userData.firstName} numOfPosts={userData.postCount} title={userData.title} fire={userData.fire} universityName={userData.uniName} username={userData.username} reputation={userData.reputation} role={userData.role} isPremiumUser={userData.premiumUser} />}
                    keyExtractor={(item) => item.postId.toString()}
                    renderItem={({ item, index }) => (
                        <View style={{ width: width }}>
                            {item.postType === "CONFESSION" ? (
                                null
                            ) : item.postType === "POST" ? (
                                <ImagePost likeStatus={item.likeStatus} handleShowCommentsModal={openCommentsModal} universityId={item?.universityId} postId={item.postId} name={item.firstName} userId={item.userId} createdAt={item.createdAt} source={item.source} votes={item.votes} username={item.username} avatar={item.avatar} caption={item.caption} value={null} isPremiumUser={item.isPremiumUser} role={item.role} />
                            ) : item.postType === "REEL" ? (
                                <View>
                                    <MiniReelTemplate
                                        likeStatus={item.likeStatus}
                                        handleShowCommentsModal={openCommentsModal}
                                        userId={item.userId}
                                        caption={item.caption}
                                        username={item.username}
                                        name={item.firstName}
                                        vidSource={item.source[0]}
                                        votes={item.votes}
                                        avatar={item.avatar}
                                        isPremiumUser={item.isPremiumUser}
                                        role={item.role}
                                        shouldPlay={index === currentViewableItemIndex}
                                        createdAt={item.createdAt}
                                        postId={item.postId}
                                        universityId={item.universityId}
                                    />
                                </View>

                            ) : null}
                        </View>
                    )}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    horizontal={false}
                    bounces={true}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => fetchUserPosts(offset)}
                    initialNumToRender={10}
                    ListEmptyComponent={<View style={{ marginVertical: SIZES.xxLarge + 25 }}>
                        <EmptyFeed title={"This space needs dusting 🧹"} subTitle={"This user has made no posts yet"} />
                    </View>}
                />
            }

            {
                showCommentsModal.isVisible &&
                <BottomSheetCommentsModal userId={showCommentsModal.userId} postId={showCommentsModal.postId} closeModal={closeCommentsModal} />
            }
        </SafeAreaView>
    )
}

export default SearchedUser

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
    },
    nameContainer: {
        flex: 1,
        position: "absolute",
        bottom: 0,
        paddingVertical: SIZES.medium
    },
    name: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.xxLarge,
        textAlign: "left",
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,

    },
    vBadge: {
        height: 18,
        width: 18,
        resizeMode: "cover",
        objectFit: "contain",
        marginLeft: SIZES.xSmall,
    },
    cBadge: {
        height: 18,
        width: 18,
        resizeMode: "cover",
        objectFit: "contain",
        marginLeft: 4,
    },
    username: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        textAlign: "left",
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,

    },
    avatarContainer: {

        // backgroundColor: "red"
    },
    profileOptionsBtnCon: {
        position: "absolute",
        right: 0,
        zIndex: 5,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: SIZES.medium
    },
    profileOptionsBtn: {
        height: 32,
        width: 32,
        borderRadius: 32 / 2,
        justifyContent: "center",
        alignItems: "center",

    },
    profBtnIcon: {
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 4,
    },
    bioContainer: {

        // backgroundColor: "green",
        flexDirection: "row",
        alignItems: "center"

    },
    title: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.secondary,
        paddingHorizontal: 2,
        textAlign: "left",


    },
    uniName: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.tertiary,
        marginTop: 2,
        textAlign: "left",
        paddingHorizontal: 2,
    },
    editBtn: {
        backgroundColor: COLORS.textAccent,
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.medium,
        borderRadius: SIZES.small,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

    },

    infoContainer: {
        flex: 0.15,
        justifyContent: "flex-start",
        alignItems: "center",
        // backgroundColor: "green"
    },
    infoBar: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.large,
        // borderTopRightRadius: SIZES.large,
        // borderBottomLeftRadius: SIZES.large,
    },
    infoLabel: {
        textAlign: "center",
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.tertiary
    },
    infoVal: {
        textAlign: "center",
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.tertiary
    },
    profileBtnContainer: {

        marginTop: SIZES.medium,
        marginBottom: SIZES.large,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
        // backgroundColor: "yellow",
    },
    profileContainer: {

        justifyContent: "center",
        alignItems: "center"
    }
})