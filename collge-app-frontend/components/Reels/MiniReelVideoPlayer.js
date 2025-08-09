// MiniReelVideoPlayer.js
import { StyleSheet, View } from 'react-native';
import { Video, ResizeMode, Audio } from 'expo-av';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants/theme';

const MiniReelVideoPlayer = ({
    shouldPlay,
    muteStatus,
    vidSource,
    style
}) =>
{
    const videoRef = useRef(null);

    useEffect(() =>
    {
        setAudioMode();
    }, []);

    const isFocused = useIsFocused()

    // Play/pause logic whenever `shouldPlay` or `muteStatus` changes
    useEffect(() =>
    {
        if (!videoRef.current) return;
        if (shouldPlay)
        {
            videoRef.current.playAsync();
            videoRef.current.setIsMutedAsync(muteStatus);
        } else
        {
            videoRef.current.pauseAsync();
            // Optional: reset position if you like
            // videoRef.current.setPositionAsync(0);
        }
    }, [shouldPlay, muteStatus, isFocused]);

    useEffect(() =>
    {



    }, [])

    // Cleanup any references or listeners if needed
    useEffect(() =>
    {
        return () =>
        {
            // This runs on unmount
            videoRef.current?.stopAsync?.();
            videoRef.current?.unloadAsync()
            videoRef.current = null;
        };
    }, []);

    const setAudioMode = useCallback(async () =>
    {
        await Audio.setAudioModeAsync({
            staysActiveInBackground: false,
            interruptionModeAndroid: 1,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
            allowsRecordingIOS: false,
            interruptionModeIOS: 1,
            playsInSilentModeIOS: true,
        });
    }, []);

    return (
        <View>
            {
                shouldPlay ?
                    <Video
                        ref={videoRef}
                        style={style}
                        source={{ uri: vidSource }}
                        shouldPlay={shouldPlay}
                        isLooping
                        isMuted={muteStatus}
                        volume={1}
                        resizeMode={ResizeMode.COVER}
                        // onPlaybackStatusUpdate={(status) => setStatus(status)}
                        useNativeControls={false}
                    />
                    :
                    <View style={styles.video} />
            }
        </View>
    );
};

export default MiniReelVideoPlayer;

const styles = StyleSheet.create({
    video: {
        height: 450,
        alignSelf: "center",
        zIndex: 2,
        borderTopLeftRadius: SIZES.large,
        borderTopRightRadius: SIZES.large,
    }
})