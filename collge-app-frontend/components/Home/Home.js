import { StyleSheet, RefreshControl, View, useWindowDimensions, ActivityIndicator, Platform, SafeAreaView, StatusBar, Animated } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import * as SecureStore from "expo-secure-store"
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme';
import { router } from "expo-router"
import StoryContainer from './StoryComp/StoryContainer';
import { usePushNotifications } from "../../hooks/usePushNotifications"
import ConfessionTemplate from '../Posts/ConfessionTemplate';
import MiniReelTemplate from "../Reels/MiniReelTemplate"
import ImagePost from '../Posts/ImagePost';
import { customFetch } from "../../utility/tokenInterceptor"
import Header from '../Header/Header';
import SWentWrong from "../General Component/SWentWrong"
import GlobalFeedSkeleton from '../Loading/GlobalFeedSkeleton';
import NearbyModal from "../Modals/NearbyModal"
import TransitionText from "../General Component/TransitionText"
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused, useScrollToTop } from '@react-navigation/native';
import { useSwipe } from "../../hooks/useSwipe"
import { useToast } from 'react-native-toast-notifications';
import BottomSheetCommentsModal from '../Modals/BottomSheetCommentsModal';
import EmptyFeed from './EmptyFeed';
import * as ImagePicker from 'expo-image-picker';
import { resetPost } from '../../state/post/postSlice';
import IntroModal from '../Modals/IntroModal';
import EulaModal from '../Modals/EulaModal';

const Home = () =>
{

    const [isComponentReady, setIsComponentReady] = useState(false);
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState([])
    const [showCommentsModal, setShowCommentsModal] = useState({
        isVisible: false,
        postId: null,
        userId: null
    })
    const [refreshing, setRefreshing] = useState(false);
    const [isSomethingWrong, setIsSomethingWrong] = useState(false)
    const [offset, setOffset] = useState(0)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const postData = useSelector(state => state.post)
    const [storageUserId, setStorageUserId] = useState();
    const [status, requestPermission] = ImagePicker.useCameraPermissions();
    const [isIntroModalShown, setIsIntroModalShown] = useState(false)
    const [isEULAModalOpen, setIsEULAModalOpen] = useState(false)

    const toast = useToast()
    const dispatch = useDispatch()

    const { expoPushToken, notification, notificationPermission } = usePushNotifications();

    const headerHeight = 64;
    const isScreenFocused = useIsFocused()

    const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
    const onViewableItemsChanged = useCallback(({ viewableItems }) =>
    {
        if (viewableItems.length > 0)
        {
            setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
        }
    }, []);
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    const fetchUserIdFromStorage = async () =>
    {
        const storedUserId = await SecureStore.getItemAsync("__userId");
        setStorageUserId(storedUserId); // Still update the state if you need it elsewhere
        return storedUserId;
    };

    const sendNotificationPushToken = async (userId, tokenValue, permissionStatus) =>
    {

        const isUserVerified = SecureStore.getItem("__isVerified");

        if (isUserVerified === "false")
        {
            return;
        }

        await customFetch(`${ENDPOINT.BASE_URL}/api/v1/notificationToken/storeToken`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, tokenValue, permissionStatus }),
        });
    }

    const swipeToChatPage = () =>
    {
        router.push("/chat")
    }

    const { onTouchStart, onTouchEnd } = useSwipe({
        onSwipeLeft: swipeToChatPage,
        onSwipeRight: null,
        minSwipeDistance: 75,  // Increase or decrease as needed
        minSwipeVelocity: 0.6, // Adjust for sensitivity
        lockDirection: true,   // Only allow one direction per swipe
    });


    useEffect(() =>
    {

        fetchUserIdFromStorage()
        requestCameraPermissions()

        if (storageUserId && expoPushToken)
        {
            sendNotificationPushToken(storageUserId, expoPushToken.data, notificationPermission)
        }

    }, [storageUserId, expoPushToken])


    const scrollRef = useRef(null)
    useScrollToTop(scrollRef)

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
        setLoading(true)
        setOffset(0);
        dispatch(resetPost())

        try
        {
            await Promise.all([handleFetchHomeContent(offset)]);
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


    const scrollY = useRef(new Animated.Value(0)).current;

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: false,
        }
    );

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -headerHeight],
        extrapolate: "clamp", // Prevent over-hiding
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, headerHeight / 2, headerHeight],
        outputRange: [1, 0.5, 0], // Adjust these values for desired fade effect
        extrapolate: 'clamp',
    });

    const containerHeight = scrollY.interpolate({
        inputRange: [0, Platform.OS === "android" ? headerHeight + 200 : headerHeight],
        outputRange: [headerHeight, 0], // Start at full height, end at 0
        extrapolate: Platform.OS === "android" ? "extend" : "clamp",
    });

    const requestCameraPermissions = async () =>
    {
        await requestPermission();
    }

    const isUserVerified = async () =>
    {

        try
        {
            const id = await SecureStore.getItem("__userId")

            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/user/getUserById/${id}`)

            const data = await response.json()

            if (response.status === 302)
            {
                if (data.isVerified === true)
                {
                    await SecureStore.setItem("__isVerified", String(data.isVerified));
                    await SecureStore.setItem("__isPremiumUser", String(data.isPremiumUser));
                    await SecureStore.setItem("__universityId", String(data.universityId))

                    if (data.isBanned)
                    {
                        router.replace("/auth/banned")
                    }

                }
                else
                {
                    await SecureStore.setItem("__isVerified", "false");
                    const userEmail = await SecureStore.getItem("__email");
                    const userId = await SecureStore.getItem("__userId");
                    const registrationType = await SecureStore.getItem("__registrationType");

                    if (data?.registrationType === "PHOTO_ID" || registrationType === "PHOTO_ID")
                    {
                        router.replace({
                            pathname: "/auth/pendingVerification",
                            params: { email: userEmail, userId: userId }
                        })
                    }
                    else
                    {
                        router.replace({
                            pathname: "/auth/verifyStatus",
                            params: { email: userEmail, userId: userId }
                        })
                    }
                }
            }

        } catch (error)
        {
            toast.show("Something went wrong...", {
                type: "normal",
                placement: "top",
                duration: 3500
            })
        } finally
        {
            setIsComponentReady(true)
        }


    }


    const handleFetchHomeContent = async (pageNum) =>
    {

        try
        {

            const universityId = await SecureStore.getItem("__universityId")
            const currentUserId = SecureStore.getItem("__userId")
            const isUserVerified = SecureStore.getItem("__isVerified");

            if (isUserVerified == "false")
            {
                return;
            }

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/home/postByUniversity?userId=${currentUserId}&universityId=${universityId}&offset=${pageNum}&pageSize=5`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200)
            {
                const data = await response.json();
                setOffset((prevOffset) => prevOffset + 1)
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

    const hideModal = () =>
    {
        setIsModalVisible(false);
    };

    const checkForIntroModal = () =>
    {
        const isTourModalShown = SecureStore.getItem("__isIntroModalShown");

        if (isTourModalShown === null)
        {
            setIsIntroModalShown(true)
        }
    }

    const checkForEULAModal = () =>
    {

        const isEULAModalOpen = SecureStore.getItem("__isEULAModalOpen");

        if (isEULAModalOpen === null)
        {
            setIsEULAModalOpen(true)
        }

    }

    const disableIntroModal = () =>
    {
        SecureStore.setItem("__isIntroModalShown", "true")
        setIsIntroModalShown(false)
    }

    const disableEULAModal = () =>
    {
        SecureStore.setItem("__isEULAModalOpen", "true")
        setIsEULAModalOpen(false)
    }

    const messages = [
        "Houston, we have a post! 🚀",
        "Just a sec... 🙌",
        "Hold your horses! 🐎",
        "This is going to be a hit! 🎉"
    ];

    useEffect(() =>
    {

        checkForIntroModal()
        checkForEULAModal()

    }, [isIntroModalShown, isEULAModalOpen])

    useEffect(() =>
    {

        Promise.all([handleFetchHomeContent(offset),
        isUserVerified()])

    }, [])

    useEffect(() =>
    {

        if (postData.isPosting)
        {
            setContent([...content, postData])
        }

    }, [postData.isPosting])


    if (!isComponentReady)
    {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.textAccent }}>
                <View
                    style={{ height: headerHeight }}
                >
                    <Header />
                </View>
                <GlobalFeedSkeleton />
            </SafeAreaView>
        )
    }

    if (refreshing)
    {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.textAccent }}>
                <View
                    style={{ height: headerHeight }}
                >
                    <Header />
                </View>
                <GlobalFeedSkeleton />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView edges={["right", "left"]} style={{ flex: 1, backgroundColor: COLORS.textAccent }}>

            <StatusBar backgroundColor={COLORS.textAccent} />
            <Animated.View
                style={{
                    transform: [{ translateY: headerTranslateY }],
                    zIndex: 1, // Ensure header stays on top
                    opacity: headerOpacity,
                    height: containerHeight
                }}
            >

                <Header />

            </Animated.View>

            {loading ? (
                <View style={{ flex: 1 }}>
                    <Header />
                    <GlobalFeedSkeleton />
                </View>
            ) : !isSomethingWrong ?
                <View
                    // onTouchStart={onTouchStart}
                    // onTouchEnd={onTouchEnd}
                    style={[styles.container, { width: width, backgroundColor: COLORS.primary }]}>

                    {
                        content.length > 0 ?
                            <Animated.FlatList
                                data={content}
                                ref={scrollRef}
                                style={{ paddingVertical: SIZES.large }}
                                keyExtractor={(item) => item.postId.toString()}
                                // ListHeaderComponent={<StoryContainer />}
                                onScroll={handleScroll}
                                renderItem={({ item, index }) => (

                                    <View style={{ width: width }}>

                                        {postData.isPosting && index === 0 ? (
                                            <View>
                                                <View style={!postData.posted ? [styles.postingBanner, { width: width - 32, alignSelf: "center" }] : { display: "none" }}>
                                                    <TransitionText messages={messages} style={{ color: COLORS.tertiary, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize }} />
                                                    <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                                                </View>
                                                <View style={!postData.posted ? styles.newPost : null}>

                                                    <View style={!postData.posted ? [styles.postCover, { width: width - 32, alignSelf: "center" }] : { display: "none" }}>

                                                    </View>
                                                    {
                                                        postData.type === "POST" ? <ImagePost likeStatus={null} postId={postData?.postId} handleShowCommentsModal={openCommentsModal} universityId={postData?.universityId} taggedUsers={postData.taggedUsers} shouldPlay={index === currentViewableItemIndex} avatar={postData.avatar} votes={0} location={postData.location} userId={postData.userId} name={postData.authorName} source={postData.source} role={postData.role} isPremiumUser={postData.isPremiumUser} caption={postData.caption} sourceScreen={"HOME"} username={postData.username} />
                                                            : postData.type === "CONFESSION" ? <ConfessionTemplate likeStatus={null} postId={postData?.postId} handleShowCommentsModal={openCommentsModal} universityId={postData.universityId} taggedUsers={postData.taggedUsers} votes={0} location={postData.location} caption={postData.caption} userId={postData.userId} sourceScreen={"HOME"} />
                                                                : postData.type === "REEL" ? <MiniReelTemplate likeStatus={null} postId={postData?.postId} handleShowCommentsModal={openCommentsModal} universityId={postData?.universityId} taggedUsers={postData.taggedUsers} shouldPlay={index === currentViewableItemIndex} avatar={postData.avatar} votes={0} location={postData.location} userId={postData.userId} name={postData.authorName} source={postData.source} role={postData.role} isPremiumUser={postData.isPremiumUser} caption={postData.caption} sourceScreen={"HOME"} username={postData.username} /> : null
                                                    }
                                                </View>
                                            </View>
                                        ) : null}

                                        {item.postType === "CONFESSION" ? (
                                            <ConfessionTemplate likeStatus={item.likeStatus} universityId={item.universityId} handleShowCommentsModal={openCommentsModal} sourceScreen={"HOME"} caption={item.caption} votes={item.votes} createdAt={item.createdAt} userId={item.userId} postId={item.postId} />
                                        ) : item.postType === "POST" ? (
                                            <ImagePost likeStatus={item.likeStatus} universityId={item.universityId} handleShowCommentsModal={openCommentsModal} shouldPlay={index === currentViewableItemIndex} sourceScreen={"HOME"} userId={item.userId} postId={item.postId} createdAt={item.createdAt} source={item.source} votes={item.votes} username={`${item.username}`} avatar={item.avatar} caption={item.caption} name={item.firstName} isPremiumUser={item.isPremiumUser} role={item.role} />
                                        ) : item.postType === "REEL" ? (
                                            <View>
                                                <MiniReelTemplate
                                                    likeStatus={item.likeStatus}
                                                    userId={item.userId}
                                                    caption={item.caption}
                                                    username={`${item.username}`}
                                                    vidSource={item.source[0]}
                                                    votes={item.votes}
                                                    name={item.firstName}
                                                    avatar={item.avatar}
                                                    isPremiumUser={item.isPremiumUser}
                                                    role={item.role}
                                                    shouldPlay={index === currentViewableItemIndex}
                                                    postId={item.postId.toString()}
                                                    createdAt={item.createdAt}
                                                    universityId={item.universityId}
                                                    handleShowCommentsModal={openCommentsModal}
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
                                bounces={true}
                                removeClippedSubviews={true}
                                onEndReachedThreshold={0.5}
                                onEndReached={() => handleFetchHomeContent(offset)}
                                initialNumToRender={5}
                            />
                            :
                            <EmptyFeed title={"No news from your university 🏫"} subTitle={"Swipe right to check global feed"} />
                    }

                </View> : <SWentWrong />
            }

            <NearbyModal isVisible={isModalVisible && isScreenFocused} onClose={hideModal} />

            {
                showCommentsModal.isVisible &&
                <BottomSheetCommentsModal userId={showCommentsModal.userId} postId={showCommentsModal.postId} closeModal={closeCommentsModal} />
            }

            {/* {
                isIntroModalShown && <IntroModal isVisible={isIntroModalShown} onClose={disableIntroModal} />
            } */}

            {
                isEULAModalOpen && <EulaModal isVisible={isEULAModalOpen} onClose={disableEULAModal} />
            }
        </SafeAreaView >
    );

}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: COLORS.primary,
    },
    header: {
        position: "absolute",
        left: 0,
        right: 0,
    },
    newPost: {
        opacity: 0.5,
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
    undoCover: {
        height: "100%",
        position: "absolute",
        zIndex: -1,
    }
})