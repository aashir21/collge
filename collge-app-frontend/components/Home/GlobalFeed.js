import { StyleSheet, RefreshControl, View, useWindowDimensions, Platform, SafeAreaView, StatusBar, Animated } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import * as SecureStore from "expo-secure-store"
import { COLORS, ENDPOINT, SIZES } from '../../constants/theme';
import { router } from "expo-router"
import ConfessionTemplate from '../Posts/ConfessionTemplate';
import MiniReelTemplate from "../Reels/MiniReelTemplate"
import ImagePost from '../Posts/ImagePost';
import { customFetch } from "../../utility/tokenInterceptor"
import SWentWrong from "../General Component/SWentWrong"
import GlobalFeedSkeleton from "../Loading/GlobalFeedSkeleton"
import NearbyModal from "../Modals/NearbyModal"
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused, useScrollToTop } from '@react-navigation/native';
import AltCommentsModal from '../Modals/AltCommentsModal';
import { toggleHidden } from '../../state/tab/tabSlice';
import GlobalFeedHeader from '../Header/GlobalFeedHeader';
import { useToast } from 'react-native-toast-notifications';
import BottomSheetCommentsModal from '../Modals/BottomSheetCommentsModal';
import EmptyFeed from './EmptyFeed';


const GlobalFeed = () =>
{

    const [isComponentReady, setIsComponentReady] = useState(false);
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [isSomethingWrong, setIsSomethingWrong] = useState(false)
    const [offset, setOffset] = useState(0)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const toast = useToast()

    const isFocused = useIsFocused()
    const [isCalledOnce, setIsCalledOnce] = useState(false)

    const headerHeight = 64;

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

    const [showCommentsModal, setShowCommentsModal] = useState({
        isVisible: false,
        postId: null,
        userId: null
    })

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

    const handleFetchHomeContent = async (pageNum) =>
    {

        const currentUserId = SecureStore.getItem("__userId")
        const isUserVerified = SecureStore.getItem("__isVerified");

        if (isUserVerified == "false")
        {
            return;
        }

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/home/${currentUserId}/${pageNum}/5`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200)
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
            setIsComponentReady(true)
            setIsCalledOnce(true)
        }

    }

    useEffect(() =>
    {

        if (isFocused && !isCalledOnce)
        {
            Promise.all([handleFetchHomeContent(offset)])
        }

    }, [isCalledOnce, isFocused])


    if (!isComponentReady)
    {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.textAccent }}>
                <View
                    style={{ height: headerHeight }}
                >
                    <GlobalFeedHeader />
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
                    <GlobalFeedHeader />
                </View>
                <GlobalFeedSkeleton />
            </SafeAreaView>
        )
    }

    const hideModal = () =>
    {
        setIsModalVisible(false);
    };

    return (
        <SafeAreaView edges={["top", "right", "left"]} style={{ flex: 1, backgroundColor: COLORS.textAccent }}>

            <StatusBar backgroundColor={COLORS.textAccent} />
            <Animated.View
                style={{
                    transform: [{ translateY: headerTranslateY }],
                    zIndex: 1, // Ensure header stays on top
                    opacity: headerOpacity,
                    height: containerHeight
                }}
            >

                <GlobalFeedHeader />

            </Animated.View>

            {loading ? (
                <View style={{ flex: 1 }}>
                    <GlobalFeedHeader />
                    <GlobalFeedSkeleton />
                </View>
            ) : !isSomethingWrong ?
                <View style={[styles.container, { width: width, backgroundColor: COLORS.primary }]}>

                    {
                        content.length > 0 ?
                            <Animated.FlatList
                                style={{ paddingVertical: SIZES.large }}
                                data={content}
                                ref={scrollRef}
                                keyExtractor={(item) => item.postId.toString()}
                                // ListHeaderComponent={<StoryContainer />}
                                onScroll={handleScroll}
                                renderItem={({ item, index }) => (

                                    <View style={{ width: width }}>

                                        {item.postType === "CONFESSION" ? (
                                            <ConfessionTemplate likeStatus={item.likeStatus} universityId={item.universityId} handleShowCommentsModal={openCommentsModal} sourceScreen={"HOME"} caption={item.caption} votes={item.votes} createdAt={item.createdAt} userId={item.userId} postId={item.postId} />
                                        ) : item.postType === "POST" ? (
                                            <ImagePost likeStatus={item.likeStatus} location={item.location} handleShowCommentsModal={openCommentsModal} universityId={item.universityId} shouldPlay={index === currentViewableItemIndex} sourceScreen={"HOME"} userId={item.userId} postId={item.postId} createdAt={item.createdAt} source={item.source} votes={item.votes} username={`${item.username}`} avatar={item.avatar} caption={item.caption} name={item.firstName} isPremiumUser={item.isPremiumUser} role={item.role} />
                                        ) : item.postType === "REEL" ? (
                                            <View>
                                                <MiniReelTemplate
                                                    likeStatus={item.likeStatus}
                                                    handleShowCommentsModal={openCommentsModal}
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
                                onEndReachedThreshold={0.5}
                                onEndReached={() => handleFetchHomeContent(offset)}
                                initialNumToRender={10}
                            />
                            :
                            <EmptyFeed title={"The 🌍 has gone silent!"} subTitle={"Check back again later"} />
                    }

                </View> : <SWentWrong />
            }

            {
                showCommentsModal.isVisible &&
                <BottomSheetCommentsModal userId={showCommentsModal.userId} postId={showCommentsModal.postId} closeModal={closeCommentsModal} />
            }
        </SafeAreaView >
    );

}

export default GlobalFeed

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