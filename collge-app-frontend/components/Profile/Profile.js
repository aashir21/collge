import
{
    StyleSheet, RefreshControl, View, useWindowDimensions, SafeAreaView, FlatList
} from 'react-native'
import { useEffect, useState, useRef, useCallback } from 'react'
import React from 'react'
import * as SecureStore from 'expo-secure-store';
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import { customFetch } from '../../utility/tokenInterceptor'
import ProfileSkeleton from '../Loading/ProfileSkeleton'
import MiniReelTemplate from '../Reels/MiniReelTemplate'
import ImagePost from '../Posts/ImagePost'
import ConfessionTemplate from '../Posts/ConfessionTemplate'
import ProfileInfo from './ProfileInfo'
import { useScrollToTop } from '@react-navigation/native'
import BottomSheetCommentsModal from '../Modals/BottomSheetCommentsModal';
import EmptyFeed from "../Home/EmptyFeed"

const Profile = () =>
{

    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState([])
    const [isSomethingWrong, setIsSomethingWrong] = useState(false)
    const [offset, setOffset] = useState(0)
    const { width } = useWindowDimensions();
    const [refreshing, setRefreshing] = useState(false);

    const scrollRef = useRef(null)
    useScrollToTop(scrollRef)

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

    const onRefresh = useCallback(async () =>
    {
        setRefreshing(true);
        setOffset(0);
        setContent([]);

        try
        {
            await Promise.all([fetchUserData(), fetchUserPosts(0)]);

        } catch (err)
        {
            console.error(err);
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


    const fetchUserData = async () =>
    {

        try
        {
            const userId = await SecureStore.getItem("__userId");
            setLoading(true)

            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/user/getUserLinkUpDataByAuthorId?userId=${userId}`)

            if (response.ok)
            {
                const data = await response.json();
                setUserData(data);
            }
            else
            {
                console.log("Something went wrong");
            }

        }
        catch (err)
        {

            console.log(err);
        }
        finally
        {
            setLoading(false)
        }


    }

    const fetchUserPosts = async (pageNum) =>
    {

        try
        {
            const userId = await SecureStore.getItem("__userId");

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/post/getPostsByUserId/${userId}?offset=${pageNum}&pageSize=5&requestorId=${userId}`, {
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
            else if (response.status === 500)
            {
                setIsSomethingWrong(true);
            }
        } catch (error)
        {
            console.error('Failed to fetch data:', error);
            setIsSomethingWrong(true);
        }
        finally
        {
            setLoading(false)
        }

    }

    useEffect(() =>
    {
        Promise.all([fetchUserData(), fetchUserPosts(offset)])
    }, [])

    return (
        <SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
            {
                loading ? <ProfileSkeleton /> : (

                    <View style={styles.container}>

                        <FlatList

                            data={content}
                            ref={scrollRef}
                            ListHeaderComponent={<ProfileInfo campus={userData.campus} yearOfGraduation={userData.yearOfGraduation} userId={userData.userId} avatar={userData.avatar} firstName={userData.firstName} numOfPosts={userData.postCount} title={userData.title} bio={userData?.bio} fire={userData.fire} universityName={userData.uniName} username={userData.username} reputation={userData.reputation} role={userData.role} isPremiumUser={userData.premiumUser} />}
                            keyExtractor={(item) => item.postId.toString()}
                            renderItem={({ item, index }) => (
                                <View style={{ width: width }}>
                                    {item.postType === "CONFESSION" ? (
                                        <ConfessionTemplate likeStatus={item.likeStatus} handleShowCommentsModal={openCommentsModal} universityId={item.universityId} sourceScreen={"PROFILE"} caption={item.caption} votes={item.votes} createdAt={item.createdAt} userId={item.userId} postId={item.postId} />
                                    ) : item.postType === "POST" ? (
                                        <ImagePost likeStatus={item.likeStatus} handleShowCommentsModal={openCommentsModal} universityId={item?.universityId} sourceScreen={"PROFILE"} userId={item.userId} postId={item.postId} createdAt={item.createdAt} source={item.source} votes={item.votes} username={item.username} avatar={item.avatar} caption={item.caption} name={item.firstName} isPremiumUser={item.isPremiumUser} role={item.role} />
                                    ) : item.postType === "REEL" ? (
                                        <View>
                                            <MiniReelTemplate
                                                likeStatus={item.likeStatus}
                                                handleShowCommentsModal={openCommentsModal}
                                                userId={item.userId}
                                                postId={item.postId}
                                                caption={item.caption}
                                                username={item.username}
                                                vidSource={item.source[0]}
                                                votes={item.votes}
                                                name={item.firstName}
                                                avatar={item.avatar}
                                                isPremiumUser={item.isPremiumUser}
                                                role={item.role}
                                                shouldPlay={index === currentViewableItemIndex}
                                                createdAt={item.createdAt}
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
                            ListEmptyComponent={
                                <View style={{ marginVertical: SIZES.xxLarge + 25 }}>
                                    <EmptyFeed title={"No posts to show"} subTitle={"Get started by creating a new post"} />
                                </View>
                            }
                        />

                    </View>


                )
            }
            {
                showCommentsModal.isVisible &&
                <BottomSheetCommentsModal userId={showCommentsModal.userId} postId={showCommentsModal.postId} closeModal={closeCommentsModal} />
            }
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        flex: 0.4,
        // backgroundColor: "red"
    },
    bioContainer: {
        flex: 0.15,
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
        flex: 0.1,
        marginVertical: SIZES.medium,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },

})