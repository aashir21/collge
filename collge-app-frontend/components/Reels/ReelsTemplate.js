import { Pressable, StyleSheet, Text, useWindowDimensions, View, Image, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Platform } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Video, ResizeMode, Audio } from 'expo-av'
import { COLORS, ENDPOINT, FONT, NOTIFICATION_TYPES, SIZES } from '../../constants/theme';
import VideoProgessBar from '../Posts/VideoProgessBar';
import { router, useLocalSearchParams, useSegments } from 'expo-router';
import { AntDesign, MaterialCommunityIcons, Feather, Octicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux';
import { toggleMute } from '../../state/mute/muteSlice';
import PostSettingModal from '../Modals/PostSettingModal';
import CommentsModal from '../Modals/CommentsModal';
import AltCommentsModal from '../Modals/AltCommentsModal';
import useShortenedNumber from '../../hooks/useShortenedNumber';
import { customFetch } from '../../utility/tokenInterceptor';
import { sendNotification } from '../../utility/notification';
import * as SecureStore from "expo-secure-store"
import { debounce } from 'lodash';
import { useToast } from 'react-native-toast-notifications';
import ScrollableCaptionBox from '../General Component/ScrollableCaptionBox';
import SharePostModal from '../Modals/SharePostModal';

const ReelsTemplate = ({ username, userId, avatar, votes, vidSource, role, isPremiumUser, caption, focused, postId, name, universityId, handleShowCommentsModal, likeStatus }) =>
{

    const { width } = useWindowDimensions();
    const video = useRef(null);
    const [status, setStatus] = useState({});

    const [showMuteStatus, setShowMuteStatus] = useState(null)
    const [showUnMuteStatus, setShowUnMuteStatus] = useState(null)
    const [isLongPress, setIsLongPress] = useState(false);
    const muteStatus = useSelector((state) => state.mute.isMuted)
    const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const dispatch = useDispatch();

    const [likeState, setLikeState] = useState(likeStatus)
    const [expanded, setExpanded] = useState(false)
    const [hasUserVoted, setHasUserVoted] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isRequestProcessing, setIsRequestProcessing] = useState(false)
    const toast = useToast()

    const showModal = () => setIsModalVisible(true);
    const hideModal = () => setIsModalVisible(false);

    const openShareModal = () => setShowShareModal(true)
    const closeShareModal = () => setShowShareModal(false)

    const updatedPostData = useLocalSearchParams();
    const hideCommentsModal = () => setIsCommentsModalVisible(false);

    const deletePost = () => setIsDeleted(true)

    const shortVotes = useShortenedNumber(votes)
    const [voteCount, setVoteCount] = useState(votes)
    const segments = useSegments()

    const handleVideoLoad = (event) =>
    {
        setStatus({ ...status, durationMillis: event.durationMillis, positionMillis: 0 });

    };

    const voteEndpoint = async (updatedType) =>
    {
        const currentUserId = await SecureStore.getItem("__userId");
        const response = await customFetch(
            `${ENDPOINT.BASE_URL}/api/v1/post/vote?userId=${currentUserId}&postId=${postId}&type=${updatedType}`,
            { method: 'PUT' }
        );
        return response;
    };

    // Timeout to detect long press
    const longPressTimer = useRef();

    const handlePressIn = () =>
    {
        setIsLongPress(false); // Reset long press flag
        longPressTimer.current = setTimeout(() =>
        {
            setIsLongPress(true);
            video.current?.pauseAsync();  // Execute pause only if it's a long press
        }, 200); // 500 ms threshold for long press
    };

    const handlePressOut = () =>
    {
        clearTimeout(longPressTimer.current); // Clear the timer

        // If it was a long press, resume the video
        if (isLongPress)
        {
            video.current?.playAsync();
        }

        // Reset the long press flag after handling
        setIsLongPress(false);
    };

    const handleExpansionOfCaption = () =>
    {
        setExpanded(!expanded)
    }


    const handleVideoTap = () =>
    {
        if (!isLongPress)
        {  // Perform action only if it's not a long press

            if (!muteStatus)
            {
                setShowMuteStatus(true); // Show the image when the button is pressed
                dispatch(toggleMute())
                // Set a timeout to hide the image after 1000 milliseconds (1 second)
                setTimeout(() =>
                {
                    setShowMuteStatus(false);

                }, 1000);
            } else
            {
                setShowUnMuteStatus(true); // Show the image when the button is pressed
                dispatch(toggleMute())
                // Set a timeout to hide the image after 1000 milliseconds (1 second)
                setTimeout(() =>
                {
                    setShowUnMuteStatus(false);
                }, 1000);
            }

        }
        setIsLongPress(false); // Reset long press flag after action
    };

    const handleProgressBarPress = (evt) =>
    {
        const touchX = evt.nativeEvent.locationX; // Get the x-coordinate of the touch
        const newSeekPosition = (touchX / progressBarWidth) * status.durationMillis;
        video?.current.setPositionAsync(newSeekPosition).catch(err => console.error('Failed to seek:', err));
    };

    const handleNavigate = async () =>
    {
        router.push({
            pathname: `${segments[0]}/${segments[1]}/user/[id]`,
            params: { id: userId }
        })
    }

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
                    postId,
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
    }, [isRequestProcessing, likeState, voteCount, postId, userId, universityId]);

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
                    postId,
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
    }, [isRequestProcessing, likeState, voteCount, postId, userId, universityId]);

    useEffect(() =>
    {
        if (!video.current) return;

        if (focused)
        {
            video.current.playAsync()
        } else
        {
            video.current.pauseAsync()
            video.current.setPositionAsync(0)
        }

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
        setAudioMode()

    }, [focused])

    useFocusEffect(
        React.useCallback(() =>
        {
            const playVideo = async () =>
            {
                if (focused)
                {
                    await video.current?.playAsync();
                    video.current?.setIsMutedAsync(muteStatus); // Apply mute status when playing
                }
            };

            const pauseVideo = async () =>
            {
                video.current?.pauseAsync();
            };

            playVideo();

            return () =>
            {
                pauseVideo()
            };
        }, [focused, muteStatus])
    );

    const handleViewLikes = () =>
    {
        router.push({
            pathname: `/${segments[0]}/${segments[1]}/likes`,
            params: { id: postId }
        });
    };

    if (isDeleted)
    {
        return null;
    }

    return (
        <Pressable
            onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleVideoTap}
            style={[styles.container]}
        >
            {
                focused ?
                    <Video
                        ref={video}
                        style={styles.video}
                        source={{ uri: vidSource }}
                        isLooping
                        onLoad={handleVideoLoad}
                        isMuted={muteStatus}
                        volume={1}
                        onPlaybackStatusUpdate={(status) => setStatus(status)}
                        useNativeControls={false}
                        resizeMode={ResizeMode.COVER}

                    />
                    :
                    null
            }

            <View style={[styles.btnCapContainer, { width: width - 32 }]}>
                <ScrollView style={{ width: "90%" }}>
                    <Pressable onPress={handleNavigate} style={styles.userBioContainer}>
                        <Image source={{ uri: avatar }} style={styles.profilePic}></Image>
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
                    </Pressable>
                    <ScrollableCaptionBox updateExpandState={handleExpansionOfCaption} caption={caption} updatedCaption={updatedPostData.updatedCaption} postId={postId} updatedPostId={updatedPostData.postId} />
                </ScrollView>

                <View style={styles.btnContainer}>

                    <Pressable onPress={handleViewLikes}>
                        <Text style={styles.votes}>{voteCount}</Text>
                    </Pressable>

                    <TouchableOpacity onPress={handleLikePress} style={styles.reelBtns}>
                        <AntDesign name="arrowup" size={30} color={likeState === 'LIKED' ? COLORS.secondary : COLORS.tertiary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDislikePress} style={styles.reelBtns}>
                        <AntDesign name="arrowdown" size={30} color={likeState === 'DISLIKED' ? COLORS.error : COLORS.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleShowCommentsModal(postId, userId)} style={styles.reelBtns}>
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

            {
                focused &&
                <TouchableWithoutFeedback onPress={handleProgressBarPress}>
                    <VideoProgessBar duration={status.durationMillis} position={status.positionMillis}></VideoProgessBar>
                </TouchableWithoutFeedback>
            }

            {isModalVisible && (
                <PostSettingModal isVisible={isModalVisible} deletePost={deletePost} postId={postId} onClose={hideModal} userId={userId}></PostSettingModal>
            )}

            {isCommentsModalVisible && (
                <AltCommentsModal isVisible={isCommentsModalVisible} onClose={hideCommentsModal} userId={userId} postId={postId} />
            )}

            {
                showShareModal &&
                <SharePostModal isVisible={showShareModal} userId={userId} onClose={closeShareModal} postId={postId} />
            }
        </Pressable >
    )
}

export default ReelsTemplate

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    },
    video: {
        flex: 0.997,
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
        alignItems: "center"
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
    }
})