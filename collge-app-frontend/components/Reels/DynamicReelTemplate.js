import { Pressable, StyleSheet, useWindowDimensions, View, Image, TouchableOpacity, TouchableWithoutFeedback, Text } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Video, ResizeMode, Audio } from 'expo-av'
import { COLORS, ENDPOINT, FONT, NOTIFICATION_TYPES, SIZES } from '../../constants/theme';
import VideoProgessBar from '../Posts/VideoProgessBar';
import { router, useLocalSearchParams, useSegments } from 'expo-router';
import { AntDesign, MaterialCommunityIcons, Feather, Octicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useToast } from 'react-native-toast-notifications';
import useShortenedNumber from '../../hooks/useShortenedNumber';
import { customFetch } from '../../utility/tokenInterceptor';
import { sendNotification } from '../../utility/notification';
import * as SecureStore from "expo-secure-store"
import { debounce } from 'lodash';
import BottomSheetCommentsModal from '../Modals/BottomSheetCommentsModal';
import PostSettingModal from '../Modals/PostSettingModal';
import SharePostModal from '../Modals/SharePostModal';

const DynamicReelTemplate = ({ dynamicPostId, vidSource, name, username, avatar, role, isPremiumUser, votes, caption, userId, universityId, handleShowCommentsModal, likeStatus }) =>
{
    const video = useRef(null)
    const { width, height } = useWindowDimensions();
    const [status, setStatus] = useState({});
    const [dynamicPostData, setdynamicPostData] = useState(null)
    const [showMuteStatus, setShowMuteStatus] = useState(null)
    const [focused, setFocused] = useState(true);
    const [showUnMuteStatus, setShowUnMuteStatus] = useState(null)
    const [isLongPress, setIsLongPress] = useState(false);
    const [muteStatus, setMuteStatus] = useState(true)
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isRequestProcessing, setIsRequestProcessing] = useState(false)

    const [likeState, setLikeState] = useState(likeStatus)
    const [expanded, setExpanded] = useState(false)
    const [hasUserVoted, setHasUserVoted] = useState(false);
    const toast = useToast()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false)

    const closeCommentsModal = () => setIsCommentsModalOpen(false)
    const openCommentsModal = () => setIsCommentsModalOpen(true)

    const openShareModal = () => setShowShareModal(true)
    const closeShareModal = () => setShowShareModal(false)

    const handleVideoLoad = async (event) =>
    {

        setStatus({ ...status, ...event, durationMillis: event.durationMillis });
    };

    const showModal = () => setIsModalVisible(true);
    const hideModal = () => setIsModalVisible(false);
    const deletePost = () => setIsDeleted(true)

    const segments = useSegments()

    const longPressTimer = useRef();
    const updatedPostData = useLocalSearchParams();

    const [voteCount, setVoteCount] = useState(votes)

    const handleExpansionOfCaption = () =>
    {
        setExpanded(!expanded)
    }

    const voteEndpoint = async (updatedType) =>
    {
        const currentUserId = await SecureStore.getItem("__userId");
        const response = await customFetch(
            `${ENDPOINT.BASE_URL}/api/v1/post/vote?userId=${currentUserId}&postId=${dynamicPostId}&type=${updatedType}`,
            { method: 'PUT' }
        );
        return response;
    };

    const handleLikePress = useCallback(async () =>
    {
        if (isRequestProcessing) return;

        try
        {
            setIsRequestProcessing(true);

            const updatedType = likeState === 'LIKED' ? 'UNLIKED' : 'LIKED';

            // Optimistic update
            let oldLikeState = likeState;
            let oldVoteCount = voteCount;

            // Update UI optimistically
            setLikeState(updatedType);
            setVoteCount(
                updatedType === 'LIKED'
                    ? voteCount + 1
                    : voteCount - 1
            );

            const response = await voteEndpoint(updatedType);
            if (!response.ok)
            {
                // Revert to old state if request fails
                setLikeState(oldLikeState);
                setVoteCount(oldVoteCount);

                toast.show("Something went wrong, couldn't upvote the post", {
                    type: "normal",
                    placement: "top",
                    duration: 3500,
                    swipeEnabled: true,
                });
                return;
            }

            const voteCountFromDb = await response.text();
            const newCount = parseInt(voteCountFromDb, 10);
            setVoteCount(newCount);

            if (updatedType === "LIKED")
            {
                const actorId = parseInt(await SecureStore.getItem("__userId"));
                const userIdString = userId.toString();

                sendNotification(
                    actorId,
                    [userIdString],
                    [universityId],
                    dynamicPostId,
                    "null",
                    "",
                    NOTIFICATION_TYPES.UPVOTE
                );

            }

        } catch (error)
        {
            toast.show("Something went wrong", {
                type: "normal",
                placement: "top",
                duration: 3000,
                animationType: "slide-in",
            });
            console.error(error);
        } finally
        {
            setIsRequestProcessing(false);
        }
    }, [isRequestProcessing, likeState, voteCount, dynamicPostId, userId, universityId]);

    const handleDislikePress = useCallback(async () =>
    {
        if (isRequestProcessing) return;

        try
        {
            setIsRequestProcessing(true);

            const updatedType = likeState === 'DISLIKED' ? 'UNDISLIKED' : 'DISLIKED';

            // Optimistic update
            let oldLikeState = likeState;
            let oldVoteCount = voteCount;

            setLikeState(updatedType);
            setVoteCount(
                updatedType === 'DISLIKED'
                    ? voteCount - 1
                    : voteCount + 1
            );

            const response = await voteEndpoint(updatedType);
            if (!response.ok)
            {
                // Revert to old state if request fails
                setLikeState(oldLikeState);
                setVoteCount(oldVoteCount);

                toast.show("Something went wrong, couldn't downvote the post", {
                    type: "normal",
                    placement: "top",
                    duration: 3500,
                    swipeEnabled: true,
                });
                return;
            }

            const voteCountFromDb = await response.text();
            const newCount = parseInt(voteCountFromDb, 10);
            setVoteCount(newCount);

            if (updatedType === "DISLIKED")
            {
                const actorId = parseInt(await SecureStore.getItem("__userId"));
                const userIdString = userId.toString();
                sendNotification(
                    actorId,
                    [userIdString],
                    [universityId],
                    dynamicPostId,
                    "null",
                    "",
                    NOTIFICATION_TYPES.DOWNVOTE
                );
            }

        } catch (error)
        {
            toast.show("Something went wrong", {
                type: "normal",
                placement: "top",
                duration: 3000,
                animationType: "slide-in",
            });
            console.error(error);
        } finally
        {
            setIsRequestProcessing(false);
        }
    }, [isRequestProcessing, likeState, voteCount, dynamicPostId, userId, universityId]);

    const handlePressIn = () =>
    {
        setIsLongPress(false); // Reset long press flag
        longPressTimer.current = setTimeout(() =>
        {
            setIsLongPress(true);
            if (video.current)
            {
                video.current.pauseAsync();
            } // Execute pause only if it's a long press
        }, 175); // 500 ms threshold for long press
    };

    const handlePressOut = () =>
    {
        clearTimeout(longPressTimer.current); // Clear the timer

        // If it was a long press, resume the video
        if (isLongPress)
        {
            video.current.playAsync();
        }

        // Reset the long press flag after handling
        setIsLongPress(false);
    };


    const handleVideoTap = () =>
    {
        if (!isLongPress)
        {  // Perform action only if it's not a long press

            if (!muteStatus)
            {
                setShowMuteStatus(true); // Show the image when the button is pressed
                setMuteStatus(true)

                // Set a timeout to hide the image after 1000 milliseconds (1 second)
                setTimeout(() =>
                {
                    setShowMuteStatus(false);

                }, 1000);
            } else
            {
                setShowUnMuteStatus(true); // Show the image when the button is pressed
                setMuteStatus(false)
                // Set a timeout to hide the image after 1000 milliseconds (1 second)
                setTimeout(() =>
                {
                    setShowUnMuteStatus(false);
                }, 1000);
            }

        }
        setIsLongPress(false); // Reset long press flag after action
    };

    useFocusEffect(
        React.useCallback(() =>
        {
            // Function to execute when the screen is focused
            const playVideo = async () =>
            {
                if (focused)
                {
                    await video.current?.playAsync();
                }
            };

            // Function to execute when the screen goes out of focus
            const pauseVideo = () =>
            {
                video.current?.pauseAsync();
            };

            playVideo();

            return () =>
            {
                video.current?.stopAsync()
                video.current?.unloadAsync()
            }; // This function is called when the component goes out of focus
        }, [focused])
    );

    const setAudioMode = async () =>
    {
        await Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            interruptionModeAndroid: 1,
            shouldDuckAndroid: false,
            playThroughEarpieceAndroid: false,
            allowsRecordingIOS: false,
            interruptionModeIOS: 1,
            playsInSilentModeIOS: true,

        })

    }

    useEffect(() =>
    {
        setAudioMode()

    }, [])


    const navigateToLikesPage = () =>
    {
        router.push({
            pathname: `/${segments[0]}/${segments[1]}/likes`,
            params: { id: dynamicPostId }
        });
    }

    const handleNavigate = () =>
    {
        router.push({
            pathname: `/${segments[0]}/${segments[1]}/reels/[id]`,
            params: { id: userId }
        })
    }

    const gesture = Gesture.Pan()
        .onUpdate((value) =>
        {
            translateX.value = value.translationX * 0.8;
            translateY.value = value.translationY * 0.8;

            const distance = Math.sqrt(
                value.translationX * value.translationX +
                value.translationY * value.translationY
            );
            const scaleValue = Math.min(Math.max(distance / 100, 1), 0.8);
            scale.value = withTiming(scaleValue, { duration: 100 });
        })
        .onEnd(() =>
        {
            // Check for either downward or rightward swipe
            if (translateY.value > 50 || translateX.value > 50)
            {
                opacity.value = 0;
                runOnJS(router.back)();
            } else
            {
                translateX.value = withTiming(0, { duration: 300 });
                translateY.value = withTiming(0, { duration: 300 });
                scale.value = withTiming(1, { duration: 300 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
        backgroundColor: interpolateColor(
            opacity.value,
            [0, 1],
            ['transparent', 'white'],
        ),
        overflow: 'hidden',
    }));

    return (
        <Animated.View
            style={[styles.container, animatedStyle]}
        >
            {
                router.canGoBack() ? null :
                    <TouchableOpacity style={styles.routerResetBtn} onPress={() => router.replace("/(tabs)/home/feeds")}>
                        <AntDesign name="close" size={32} color={COLORS.secondary}></AntDesign>
                    </TouchableOpacity>
            }

            <Pressable
                style={styles.container}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleVideoTap}
            >
                <Video
                    ref={video}
                    style={styles.video}
                    source={{ uri: vidSource }}

                    isLooping={true}
                    onLoad={handleVideoLoad}
                    isMuted={muteStatus}
                    volume={1}
                    onPlaybackStatusUpdate={(status) => setStatus(status)}
                    useNativeControls={false}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={focused}
                />

                <View style={[styles.btnCapContainer, { width: width - 32 }]}>
                    <View style={{ width: "90%" }}>
                        <View style={styles.userBioContainer}>
                            <Pressable onPress={handleNavigate}>
                                <Image source={{ uri: avatar }} style={styles.profilePic}></Image>
                            </Pressable>
                            <View style={{ flexDirection: "column" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={styles.username}>{name}</Text>
                                    {
                                        isPremiumUser === 'true' ? <Image style={[styles.verified, { marginLeft: 6 }]} source={require("../../assets/images/verified.png")}></Image> : null
                                    }
                                    {
                                        role !== "USER" ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
                                    }
                                </View>
                                <Text style={[styles.username, { color: COLORS.secondary }]}>{username}</Text>
                            </View>

                        </View>
                        <View style={{ width: "95%" }}>
                            <Text style={styles.caption}>{caption}</Text>

                        </View>
                    </View>
                    <View style={styles.btnContainer}>
                        <Pressable onPress={navigateToLikesPage}>
                            <Text style={styles.votes}>{voteCount}</Text>
                        </Pressable>
                        <TouchableOpacity onPress={handleLikePress} style={styles.reelBtns}>
                            <AntDesign name="arrowup" size={30} color={likeState === 'LIKED' ? COLORS.secondary : COLORS.tertiary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDislikePress} style={styles.reelBtns}>
                            <AntDesign name="arrowdown" size={30} color={likeState === 'DISLIKED' ? COLORS.error : COLORS.tertiary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={openCommentsModal} style={styles.reelBtns}>
                            <Feather name="message-circle" size={28} color={COLORS.tertiary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={openShareModal} style={styles.reelBtns}>
                            <Feather name="share" size={28} color={COLORS.tertiary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={showModal} style={[styles.reelBtns]}>
                            <MaterialCommunityIcons name="dots-horizontal" size={28} color={COLORS.tertiary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {
                    showMuteStatus && <View style={styles.muteStatusContainer}>
                        <View style={styles.muteStatusWrapper}>
                            <Octicons name="mute" size={56} color={COLORS.tertiary} />
                        </View>
                    </View>
                }


                {
                    showUnMuteStatus && <View style={styles.muteStatusContainer}>
                        <View style={styles.muteStatusWrapper}>
                            <Octicons name="unmute" size={56} color={COLORS.tertiary} />
                        </View>
                    </View>
                }

                {isModalVisible && (
                    <PostSettingModal isVisible={isModalVisible} deletePost={deletePost} postId={dynamicPostId} shoudlGoBack={true} onClose={hideModal} userId={userId}></PostSettingModal>
                )}

                <TouchableWithoutFeedback
                >
                    <VideoProgessBar duration={status.durationMillis} position={status.positionMillis}></VideoProgessBar>
                </TouchableWithoutFeedback>
            </Pressable>

            {
                isCommentsModalOpen &&
                <BottomSheetCommentsModal userId={userId} postId={dynamicPostId} closeModal={closeCommentsModal} />
            }

            {
                showShareModal &&
                <SharePostModal isVisible={showShareModal} userId={userId} onClose={closeShareModal} postId={dynamicPostId} />
            }
        </Animated.View>
    )
}

export default DynamicReelTemplate

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    },
    video: {
        flex: 1,
        aspectRatio: 9 / 16,
        alignSelf: "center",
        position: "relative",
        zIndex: 2,
    },
    progressBarContainer: {
        height: 2,
        width: '100%',
        backgroundColor: COLORS.whiteAccent
    },
    progressBar: {
        height: 2,
        backgroundColor: COLORS.secondary,
    },
    btnCapContainer: {
        position: "absolute",
        zIndex: 5,
        bottom: 0,
        height: "35%",
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        alignSelf: "center",
        marginVertical: SIZES.xSmall
    },
    profilePic: {
        height: 48,
        width: 48,
        borderRadius: 48 / 2,
        objectFit: "cover"
    },
    btnContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "10%",
        height: "100%",

    },
    userBioContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "90%",

    }
    ,
    username: {
        marginLeft: SIZES.xSmall,
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        textAlign: "left",
        textShadowColor: 'rgba(0, 0, 0, 0.45)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,
    },
    caption: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.fontBodySize - 1,
        marginVertical: SIZES.medium,
        textAlign: "left",
        textShadowColor: 'rgba(0, 0, 0, 0.45)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,
    },
    votes: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.xLarge + 4,
        textAlign: "left",
        textShadowColor: 'rgba(0, 0, 0, 0.35)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 10,
    },
    reelBtns: {
        marginVertical: SIZES.xSmall,
        textShadowColor: 'rgba(0, 0, 0, 0.45)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,
    },
    muteStatusContainer: {
        position: "absolute",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    muteStatusWrapper: {
        padding: SIZES.medium,
        height: 128,
        width: 128,
        borderRadius: 128 / 2,
        justifyContent: "center",
        alignItems: "center"
    },
    verified: {
        height: 12,
        width: 12,
        objectFit: "contain",
        marginLeft: SIZES.xSmall - 6
    },
    routerResetBtn: {

        padding: SIZES.small,
        position: "absolute",
        zIndex: 10,
        top: 50
    },
})