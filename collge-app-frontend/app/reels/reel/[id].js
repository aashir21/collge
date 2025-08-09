import { Pressable, StyleSheet, Text, useWindowDimensions, View, Animated, Easing, Image, Touchable, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Video, ResizeMode, Audio } from 'expo-av'
import { COLORS, FONT, SIZES } from "../../../constants/theme";
import VideoProgessBar from "../../../components/Posts/VideoProgessBar"
import { router } from 'expo-router';
import { AntDesign, MaterialCommunityIcons, Feather, Octicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux';
import { setIsMuted } from '../../../state/mute/muteSlice';


const ReelsTemplate = ({ username, userId, avatar, votes, vidSource, role, isPremiumUser, caption, focused }) =>
{

    const { width } = useWindowDimensions();
    const video = useRef(null);
    const [status, setStatus] = useState({});

    const [showMuteStatus, setShowMuteStatus] = useState(null)
    const [showUnMuteStatus, setShowUnMuteStatus] = useState(null)
    const [isLongPress, setIsLongPress] = useState(false);
    const muteStatus = useSelector((state) => state.mute.isMuted)
    const dispatch = useDispatch()


    const handleVideoLoad = (event) =>
    {
        setStatus({ ...status, durationMillis: event.durationMillis, positionMillis: 0 });

    };


    // Timeout to detect long press
    const longPressTimer = useRef();

    const handlePressIn = () =>
    {
        setIsLongPress(false); // Reset long press flag
        longPressTimer.current = setTimeout(() =>
        {
            setIsLongPress(true);
            video.current.pauseAsync();  // Execute pause only if it's a long press
        }, 200); // 500 ms threshold for long press
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

            dispatch(setIsMuted())

            if (!muteStatus)
            {
                setShowMuteStatus(true); // Show the image when the button is pressed

                // Set a timeout to hide the image after 1000 milliseconds (1 second)
                setTimeout(() =>
                {
                    setShowMuteStatus(false);
                }, 1000);
            } else
            {
                setShowUnMuteStatus(true); // Show the image when the button is pressed

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
            const pauseVideo = async () =>
            {
                await video.current?.pauseAsync();
                await video?.current?.unloadAsync()
            };

            playVideo();

            return () => pauseVideo(); // This function is called when the component goes out of focus
        }, [focused])
    );

    const handleProgressBarPress = (evt) =>
    {
        const touchX = evt.nativeEvent.locationX; // Get the x-coordinate of the touch
        const newSeekPosition = (touchX / progressBarWidth) * status.durationMillis;
        video.current.setPositionAsync(newSeekPosition).catch(err => console.error('Failed to seek:', err));
    };

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

    const handleNavigate = async () =>
    {
        router.push({
            pathname: `/profile/user/[id]`,
            params: { id: userId }
        })
    }

    return (
        <Pressable
            onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleVideoTap} style={styles.container}

        >
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

            <View style={[styles.btnCapContainer, { width: width - 32 }]}>
                <View style={{ width: "90%" }}>
                    <Pressable onPress={handleNavigate} style={styles.userBioContainer}>
                        <Image source={{ uri: avatar }} style={styles.profilePic}></Image>
                        <Text style={styles.username}>{username}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {
                                isPremiumUser === 'true' ? <Image style={[styles.verified, { marginLeft: 6 }]} source={require("../../../assets/images/verified.png")}></Image> : null
                            }
                            {
                                role !== "USER" ? <Image style={styles.verified} source={require("../../../assets/images/C.png")}></Image> : null
                            }
                        </View>
                    </Pressable>
                    <View style={{ width: "95%" }}>
                        <Text style={styles.caption}>{caption}</Text>
                    </View>
                </View>
                <View style={styles.btnContainer}>
                    <Text style={styles.votes}>{votes}</Text>
                    <TouchableOpacity style={styles.reelBtns}>
                        <AntDesign name="arrowup" size={28} color={COLORS.tertiary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reelBtns}>
                        <AntDesign name="arrowdown" size={28} color={COLORS.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.reelBtns}>
                        <Feather name="message-circle" size={28} color={COLORS.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.reelBtns}>
                        <Feather name="share" size={28} color={COLORS.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.reelBtns]}>
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

            <TouchableWithoutFeedback onPress={handleProgressBarPress}>
                <VideoProgessBar duration={status.durationMillis} position={status.positionMillis}></VideoProgessBar>
            </TouchableWithoutFeedback>

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
        fontSize: SIZES.xLarge,
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