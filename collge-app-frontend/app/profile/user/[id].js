import
{
    StyleSheet, RefreshControl, View, useWindowDimensions, SafeAreaView, FlatList
} from 'react-native'
import { useEffect, useState, useRef } from 'react'
import React from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../../constants/theme'
import { useLocalSearchParams } from "expo-router"
import EmptyState from '../../../components/General Component/EmptyState'
import ProfileSkeleton from "../../../components/Loading/ProfileSkeleton"
import * as SecureStore from 'expo-secure-store';
import Profile from "../../../components/Profile/Profile"
import MiniReelTemplate from '../../../components/Reels/MiniReelTemplate'
import ImagePost from '../../../components/Posts/ImagePost'
import FrndProfileInfo from '../../../components/Profile/FrndProfileInfo'
import { customFetch } from '../../../utility/tokenInterceptor'
import BottomSheetCommentsModal from '../../../components/Modals/BottomSheetCommentsModal'


const SearchedUser = () =>
{

    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true)
    const [storageUserId, setStorageUserId] = useState(null)
    const { width } = useWindowDimensions();
    const [offset, setOffset] = useState(0)
    const [content, setContent] = useState([])
    const numOfPosts = useRef(0)
    const params = useLocalSearchParams();
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
        userId: null,
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

            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/user/getUserDetails?userId=${params.id}`)

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

    const getUserIdFromStorage = async () =>
    {
        const fromStorageUserId = await SecureStore.getItem("__userId");
        setStorageUserId(fromStorageUserId)
    }

    const fetchUserPosts = async (pageNum) =>
    {

        try
        {

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/post/getPostsByUserId/${params.id}?offset=${pageNum}&pageSize=2`, {
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
        Promise.all([
            fetchUserData(),
            getUserIdFromStorage(),
            fetchUserPosts(0)
        ])

    }, [])

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
            {
                loading ? <ProfileSkeleton /> : (params.id == storageUserId) ? <Profile /> : content.length <= 0 ? <View><EmptyState /></View> : (

                    <FlatList

                        data={content}
                        ListHeaderComponent={<FrndProfileInfo isWinkable={userData.winkable} userId={userData.userId} universityId={userData.universityId} avatar={userData.avatar} firstName={userData.firstName} numOfPosts={content.length} title={userData.title} fire={userData.fire} universityName={userData.universityName} username={userData.username} reputation={userData.reputation} role={userData.role} isPremiumUser={userData.isPremiumUser} />}
                        keyExtractor={(item) => item.postId.toString()}
                        renderItem={({ item, index }) => (
                            <View style={{ width: width }}>
                                {item.postType === "CONFESSION" ? (
                                    null
                                ) : item.postType === "POST" ? (
                                    <ImagePost likeStatus={item.likeStatus} handleShowCommentsModal={openCommentsModal} universityId={item.universityId} userId={item.userId} postId={item.postId} createdAt={item.createdAt} source={item.source} votes={item.votes} username={item.username} avatar={item.avatar} caption={item.caption} value={null} isPremiumUser={item.isPremiumUser} role={item.role} />
                                ) : item.postType === "REEL" ? (
                                    <View>
                                        <MiniReelTemplate
                                            handleShowCommentsModal={openCommentsModal}
                                            likeStatus={item.likeStatus}
                                            userId={item.userId}
                                            caption={item.caption}
                                            username={item.username}
                                            vidSource={item.source[0]}
                                            votes={item.votes}
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
                        horizontal={false}
                        bounces={true}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => fetchUserPosts(offset)}
                        initialNumToRender={5}
                    />

                )
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
        backgroundColor: COLORS.primary
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