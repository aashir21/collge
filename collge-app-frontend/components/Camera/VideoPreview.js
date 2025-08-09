import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import * as MediaLibrary from 'expo-media-library';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video } from 'expo-av';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import { AntDesign, MaterialIcons, FontAwesome6, Feather, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from 'react-redux';
import { setMedia } from '../../state/camera/cameraSlice';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const VideoPreview = ({ video, discardVideo }) =>
{

    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
    const { width } = useWindowDimensions()
    const toast = useToast();
    const [muteStatus, setMuteStatus] = useState(false)
    const [paused, setPaused] = useState(false);
    const videoRef = useRef(null);

    const dispatch = useDispatch()

    useEffect(() =>
    {
        (async () =>
        {
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
        })();

        handleDispatchData()

    }, []);

    useFocusEffect(
        React.useCallback(() =>
        {
            setPaused(true); // Play when screen focused

            return () =>
            {
                setPaused(false); // Pause when screen unfocused
                videoRef?.current?.unloadAsync()

            };
        }, [])
    );

    const muteVideo = () =>
    {
        setMuteStatus(!muteStatus)
        video = { ...video, isMuted: !muteStatus }
        videoRef.current.props.isMuted = videoRef.current.props.isMuted === "true" ? "false" : "true";
    }

    const handleDispatchData = async () =>
    {

        const thumbnailUri = await VideoThumbnails.getThumbnailAsync(video.uri, { time: 1500 })

        dispatch(
            setMedia(
                {
                    media: video,
                    mediaType: "VIDEO",
                    thumbnail: thumbnailUri.uri
                }
            )
        )
    }

    let saveVideo = () =>
    {
        MediaLibrary.saveToLibraryAsync(video.uri).then(() =>
        {
            toast.show("Saved", {
                type: "normal",
                placement: "top",
                duration: 3000,
                offsetTop: 100,
                animationType: "slide-in",
            });
            // setCapturedPhoto(undefined);
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
            <Video
                ref={videoRef}
                style={styles.video}
                source={{ uri: video.uri }}
                useNativeControls={false}
                resizeMode='contain'
                isLooping
                shouldPlay={paused}
                isMuted={muteStatus}
            />

            <View style={[styles.topButtonContainer, { width: width - 32 }]}>
                <TouchableOpacity onPress={discardVideo}>
                    <AntDesign name="close" size={30} color={COLORS.tertiary} />
                </TouchableOpacity>

                <View style={styles.editBtnsContainer}>
                    <TouchableOpacity onPress={muteVideo}>
                        {
                            muteStatus ? <Octicons name="mute" size={30} color={COLORS.tertiary} />
                                :
                                <Octicons name="unmute" size={30} color={COLORS.tertiary} />
                        }
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.buttonContainer, { width: width - 32 }]}>
                {hasMediaLibraryPermission ?
                    <TouchableOpacity style={styles.saveBtn} onPress={saveVideo}>
                        <Text style={{ color: COLORS.tertiary, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize }}>Save</Text>
                        <AntDesign name="download" size={16} color={COLORS.tertiary} />
                    </TouchableOpacity>
                    : undefined}
                <TouchableOpacity style={styles.saveBtn} onPress={() => router.push("/(tabs)/post/postinfo")}>
                    <Text style={{ color: COLORS.tertiary, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize }}>Next</Text>
                    <AntDesign name="arrowright" size={18} color={COLORS.secondary} />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default VideoPreview

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary
    },
    preview: {
        alignSelf: 'stretch',
        flex: 1
    },
    buttonContainer: {

        paddingVertical: SIZES.small,
        flexDirection: "row",
        justifyContent: "space-between",

    },
    saveBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: COLORS.textAccent,
        paddingHorizontal: SIZES.small,
        paddingVertical: SIZES.medium,
        width: "25%",
        borderRadius: SIZES.large
    },
    topButtonContainer: {
        position: "absolute",
        paddingTop: SIZES.small,
        zIndex: 10,
        top: Platform.OS === "ios" ? 75 : 40,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    editBtnsContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
    }
    ,
    video: {
        flex: 1,
        alignSelf: "stretch"
    }
})