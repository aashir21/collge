import { Pressable, StyleSheet, Text, useWindowDimensions, View, Image } from 'react-native'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { COLORS, FONT, SIZES, STYLES } from '../../constants/theme';
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import ButtonContainer from '../Posts/ButtonContainer';
import { router, useSegments } from 'expo-router';
import VideoMuteBtn from '../General Component/VideoMuteBtn';
import { useSelector } from 'react-redux';
import { Audio, Video, ResizeMode } from 'expo-av';
import useTimeSince from '../../hooks/useTimeSince';
import Animated from 'react-native-reanimated';
import CommentsModal from '../Modals/CommentsModal';
import MiniReelVideoPlayer from './MiniReelVideoPlayer';


const MiniReelTemplate = ({ universityId, username, avatar, vidSource, role, name, isPremiumUser, caption, votes, shouldPlay, userId, postId, createdAt, handleShowCommentsModal, likeStatus }) => 
{

    const { width } = useWindowDimensions();
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
    const muteStatus = useSelector((state) => state.mute.isMuted)
    const timeAgo = useTimeSince(createdAt)
    const showCommentsModal = () => setIsCommentsModalVisible(true)
    const hideCommentsModal = () => setIsCommentsModalVisible(false);

    const isFocused = useIsFocused()

    const segments = useSegments();

    const handleOnPress = useCallback(() =>
    {
        router.push({
            pathname: `/home/user/[id]`,
            params: { id: userId }
        });
    }, [userId]);

    const handleToggleFullscreen = async () =>
    {
        const status = await video.current?.getStatusAsync(); // Get current status
        const currentPositionMillis = status?.positionMillis ?? 0

        router.push({
            pathname: `/${segments[1]}/reels/[id]`,
            params: { id: postId, vidSource: vidSource, name: name, username: username, avatar: avatar, role: role, isPremiumUser: isPremiumUser, votes: votes, caption: caption, currentPositionMillis: currentPositionMillis, userId: userId, universityId: universityId, likeStatus: likeStatus }
        })

    }

    useFocusEffect(
        useCallback(() =>
        {
            const playVideo = async () =>
            {
                if (shouldPlay && isFocused)
                {
                    await video.current?.playAsync();
                    video.current?.setIsMutedAsync(muteStatus); // Apply mute status when playing
                }
                else
                {
                    await video.current?.pauseAsync();
                }
            };
            const pauseVideo = async () =>
            {
                await video.current?.pauseAsync();
            };

            playVideo();
            return () =>
            {
                pauseVideo()
            };
        }, [shouldPlay, muteStatus])
    );

    const handleVideoLoad = useCallback((event) =>
    {
        setStatus({ ...status, durationMillis: event.durationMillis, positionMillis: 0 });
    }, []);


    return (
        <View style={[styles.container, { width: width - 32 }]}>

            <View>
                <View>

                    <Animated.View>
                        <Pressable
                            onPress={handleToggleFullscreen}
                        >
                            <MiniReelVideoPlayer
                                shouldPlay={shouldPlay && isFocused}
                                muteStatus={muteStatus}
                                vidSource={vidSource}
                                videoRef={video}
                                style={[styles.video, { width: width - 32 }]}
                            />
                        </Pressable>
                    </Animated.View>

                    <View style={[styles.btnCapContainer, { width: width - 32 }]}>
                        <View style={{ width: "90%", marginTop: SIZES.xSmall }}>
                            <Pressable style={[styles.userBioContainer]}>
                                <Pressable onPress={handleOnPress}>
                                    <Image source={{ uri: avatar }} style={styles.profilePic}></Image>
                                </Pressable>
                                <Pressable onPress={handleOnPress}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={styles.firstName}>{name}</Text>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            {
                                                isPremiumUser === 'true' ? <Image style={[styles.verified, { marginLeft: 6 }]} source={require("../../assets/images/verified.png")}></Image> : null
                                            }
                                            {
                                                role !== "USER" ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
                                            }
                                            <Text style={[STYLES.timeStamp, STYLES.textShadow]}>{timeAgo}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.username}>{username}</Text>
                                </Pressable>

                            </Pressable>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: width - (32 + SIZES.large) }}>
                                <View>
                                    <Text style={styles.caption}>{caption.length > 32 ? caption.substring(0, 32) : caption}</Text>
                                </View>

                                <Pressable>
                                    <VideoMuteBtn />
                                </Pressable>
                            </View>

                        </View>


                    </View>
                </View>


                <View style={{ padding: SIZES.large, alignSelf: "center" }}>
                    <ButtonContainer likeStatus={likeStatus} handleShowCommentsModal={handleShowCommentsModal} universityId={universityId} votes={votes} userId={userId} postId={postId} showModal={showCommentsModal} />
                </View>
            </View>

            {isCommentsModalVisible && (
                <CommentsModal isVisible={isCommentsModalVisible} onClose={hideCommentsModal} userId={userId} postId={postId} />
            )}

        </View >
    )
}

export default React.memo(MiniReelTemplate);

const styles = StyleSheet.create({

    container: {
        flex: 0,
        alignSelf: "center",
        borderRadius: SIZES.large,
        marginBottom: SIZES.medium,
        backgroundColor: COLORS.textAccent
    },
    video: {

        height: 450,
        alignSelf: "center",
        zIndex: 2,
        borderTopLeftRadius: SIZES.large,
        borderTopRightRadius: SIZES.large
    },

    btnCapContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingHorizontal: SIZES.large,
        marginVertical: SIZES.xSmall,
        position: "absolute",
        bottom: 0,
        zIndex: 10
    },
    profilePic: {
        height: 48,
        width: 48,
        borderRadius: 48 / 2,
        objectFit: "cover"
    },

    userBioContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        width: "90%",

    }
    ,
    firstName: {
        marginLeft: SIZES.xSmall,
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        textAlign: "left",
        textShadowColor: 'rgba(0, 0, 0, 0.45)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,
    },
    username: {
        marginLeft: SIZES.xSmall,
        fontFamily: FONT.regular,
        color: COLORS.secondary,
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
    verified: {
        height: 12,
        width: 12,
        objectFit: "contain",
        marginLeft: SIZES.xSmall - 6
    }

})