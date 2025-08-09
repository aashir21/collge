import { StyleSheet, Text, useWindowDimensions, View, findNodeHandle } from 'react-native'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Video, Audio, ResizeMode } from 'expo-av'
import { SIZES, COLORS } from '../../../constants/theme'
import VideoMuteBtn from "../../General Component/VideoMuteBtn"
import { stubTrue } from 'lodash'
import { useSelector } from 'react-redux';

const PostVideoComp = ({ vidSource, aspectRatio, shouldPlay, handleVideoLoadState, isFirstAssetVid, handleAspectRatio, index }) =>
{

    const { width } = useWindowDimensions()
    const [status, setStatus] = useState({});
    const [localAspectRatio, setLocalAspectRatio] = useState(aspectRatio)
    const video = useRef(null);
    const muteStatus = useSelector((state) => state.mute.isMuted)

    const handleVideoLoad = useCallback(async (event) =>
    {
        setStatus({ ...status, durationMillis: event.durationMillis, positionMillis: 0 });
        handleVideoLoadState(false)

    }, []);

    const setAudioMode = useCallback(async () =>
    {
        await Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            interruptionModeAndroid: 1,
            shouldDuckAndroid: false,
            playThroughEarpieceAndroid: false,
            allowsRecordingIOS: false,
            interruptionModeIOS: 1,
            playsInSilentModeIOS: true,
        });
    }, []);

    const handleVideoReadyToDisplay = async (event) =>
    {

        if (isFirstAssetVid && index === 0)
        {

            if (await event.naturalSize.orientation === "portrait")
            {
                handleAspectRatio(4 / 5)
            }
            else if (await event.naturalSize.orientation !== "portrait")
            {
                handleAspectRatio(5 / 4)
            }
        }


    }


    useEffect(() =>
    {
        if (!video.current) return;

        if (shouldPlay)
        {
            video.current.playAsync();
        } else
        {
            video.current.pauseAsync();
            // video.current.setPositionAsync(0);
        }

        setAudioMode();
    }, [shouldPlay]);

    useFocusEffect(
        useCallback(() =>
        {
            const playVideo = async () =>
            {
                if (shouldPlay)
                {
                    await video.current?.playAsync();
                    video.current?.setIsMutedAsync(muteStatus); // Apply mute status when playing
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

    return (
        <View>
            <View

                style={[styles.postImg, { width: width - 72, aspectRatio: aspectRatio, pointerEvents: "box-none" }]}
            >
                {
                    shouldPlay ?
                        <Video
                            ref={video}
                            source={{ uri: vidSource }}
                            resizeMode={ResizeMode.COVER}
                            shouldPlay={false}
                            isLooping
                            onLoad={handleVideoLoad}
                            isMuted={muteStatus} // Set the isMuted prop
                            onPlaybackStatusUpdate={setStatus}
                            onReadyForDisplay={handleVideoReadyToDisplay}
                            style={{ flex: 1, borderRadius: SIZES.large }}
                        />
                        :
                        <View style={{ flex: 1, backgroundColor: COLORS.primary, borderRadius: SIZES.large }} />
                }
                <View style={styles.muteBtnContainer}>
                    <VideoMuteBtn />
                </View>
            </View>
        </View>
    );
}

export default PostVideoComp

const styles = StyleSheet.create({

    postImg: {
        // height: 350,
        objectFit: "cover",
        borderRadius: SIZES.large,
        backgroundColor: COLORS.primary,
        position: "relatiave",
        zIndex: 1,

    },

    muteBtnContainer: {
        position: "absolute",
        bottom: 15,
        right: 0
    }
})