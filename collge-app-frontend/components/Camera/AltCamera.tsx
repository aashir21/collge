import { CameraView, CameraProps, useCameraPermissions, CameraPictureOptions, Camera } from "expo-camera";
import React, { useState, useEffect, useRef } from "react";
import { Platform, StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import CameraRequest from './CameraRequest';
import ImagePreview from './ImagePreview';
import VideoPreview from './VideoPreview';
import { AntDesign, Ionicons, SimpleLineIcons, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { TapGestureHandler } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics"

export default function AltCamera() {
    // @ts-ignore: just being lazy with types here
    const cameraRef = useRef<CameraView>(undefined);
    const [facing, setFacing] = useState<CameraProps["facing"]>("back");
    const [permission, requestPermission] = useCameraPermissions();
    const [pictureSizes, setPictureSizes] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false)
    const [flashMode, setFlashMode] = useState('off')
    const [hasAudioPermissions, setHasAudioPermissions] = useState(false)

    const [photo, setPhoto] = useState<any>();
    const [video, setVideo] = useState<any>()
    const { width } = useWindowDimensions()

    const isCameraScreenFocused = useIsFocused()

    function toggleCameraFacing() {
        setFacing((current) => (current === "back" ? "front" : "back"));
    }

    const takePhoto = async () => {


        let options: CameraPictureOptions = {
            quality: 0.8,
            base64: false,
            exif: false,
            isImageMirror: true,
            skipProcessing: true,
            imageType: "jpg"
        };

        const capturedPhoto = await cameraRef.current?.takePictureAsync(options);

        if (facing == "front" && Platform.OS === "ios") {
            const manipulatedImage = await manipulateAsync(
                capturedPhoto.uri,
                [{ flip: FlipType.Horizontal }],
                { compress: 1, format: SaveFormat.PNG, base64: true }
            );
            setPhoto(manipulatedImage);

            return;
        }

        setPhoto(capturedPhoto)
    }

    let recordVideo = async () => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
        setIsRecording(true)

        setTimeout(async () => {
            try {
                const recordedVideo = await cameraRef.current.recordAsync();
                setVideo(recordedVideo);
                setIsRecording(false);
            } catch (error) {
                console.error("Error during video recording:", error);
                setIsRecording(false);
            }
        }, 1500);

    };

    let stopRecording = () => {

        setIsRecording(false);
        cameraRef.current.stopRecording();
    };

    const discardPhoto = () => {

        setPhoto(undefined)

    }

    const discardVideo = () => {

        setVideo(undefined)

    }

    const handlePhotoStateLifting = () => {

        setPhoto(null);

    }

    const toggleFlashState = () => {

        setFlashMode(current =>
            current === "off"
                ? "on"
                : "off"
        )

    };

    useEffect(() => {
        (async () => {
            const micStatus = await Camera.requestMicrophonePermissionsAsync();
            if (micStatus.granted) {
                setHasAudioPermissions(true);
            }
        })();
    }, [])

    useEffect(() => {

        async function getSizes() {
            if (permission?.granted && cameraRef.current) {
                const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
                setPictureSizes(sizes);
            }
        }

        getSizes();

    }, [permission, cameraRef]);

    if (!permission) {
        // Camera permissions are still loading.
        return <View style={{ backgroundColor: COLORS.primary, flex: 1 }} />;
    }

    if (!permission.granted || !hasAudioPermissions) {
        // Camera permissions are not granted yet.
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
                <CameraRequest shouldDisplay={true} />
            </View>
        );
    }

    if (photo) {
        return <ImagePreview photo={photo} discardPhoto={discardPhoto} handlePhotoStateLifting={handlePhotoStateLifting} />
    }

    if (video) {
        return (
            <VideoPreview video={video} discardVideo={discardVideo} />
        );
    }

    return (
        <TapGestureHandler onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === 5) { // 5 indicates end of tap
                toggleCameraFacing(); // Double tap flips the camera
            }
        }}
            numberOfTaps={2}>


            <View style={styles.container}>
                <View style={{ flex: 1 }}>

                    {
                        isCameraScreenFocused &&
                        <CameraView
                            style={styles.camera}
                            facing={facing}
                            ref={cameraRef}
                            flash={flashMode}
                            mode={isRecording ? "video" : "picture"}
                        >

                            <View style={[styles.cameraSettingContainer, { width: width - 32, }]}>
                                <TouchableOpacity onPress={() => router.back()} style={{ opacity: isRecording ? 0.5 : 1 }} disabled={isRecording ? true : false}>
                                    <AntDesign name="close" size={32} color={COLORS.tertiary} />
                                </TouchableOpacity>

                                <View>
                                    <TouchableOpacity style={{ opacity: isRecording ? 0.5 : 1 }} disabled={isRecording ? true : false}
                                        onPress={toggleFlashState}
                                    >
                                        {
                                            flashMode === "on" ?
                                                <Ionicons name="flash-sharp" size={32} color={COLORS.tertiary} />
                                                :
                                                <Ionicons name="flash-off-sharp" size={32} color={COLORS.tertiary} />
                                        }
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={toggleCameraFacing}
                                        style={[styles.button, { opacity: isRecording ? 0.5 : 1 }]} disabled={isRecording ? true : false}
                                    >
                                        <FontAwesome6 name="arrows-rotate" size={28} color={COLORS.tertiary} />
                                    </TouchableOpacity>
                                </View>


                            </View>
                            <View style={[styles.buttonContainer, { width: width - 32, alignSelf: "center" }]}>

                                <TouchableOpacity style={{ opacity: isRecording ? 0.5 : 1 }} disabled={isRecording ? true : false} onPress={takePhoto}>
                                    <View style={[styles.shutterBtn, { backgroundColor: COLORS.tertiary }]} />
                                </TouchableOpacity>

                                {
                                    !isRecording ?
                                        <TouchableOpacity
                                            style={styles.recordBtn}
                                            onPress={recordVideo}
                                        >
                                            <SimpleLineIcons name="camrecorder" size={24} color={COLORS.tertiary} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            style={styles.recordBtn}
                                            onPress={stopRecording}
                                        >
                                            <FontAwesome5 name="stop-circle" size={24} color={COLORS.error} />
                                        </TouchableOpacity>
                                }
                            </View>
                        </CameraView>
                    }

                </View>

            </View>
        </TapGestureHandler>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 125,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: SIZES.medium
    },
    recordBtn: {
        alignItems: "center",
        left: 50,
        backgroundColor: COLORS.lightBlack,
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: "center",
        position: "absolute"
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    shutterBtn: {
        height: 80,
        width: 80,
        borderRadius: 40,
    },

    cameraSettingContainer: {

        flex: 0.3,
        position: "absolute",
        alignSelf: "center",
        top: Platform.OS === "android" ? 50 : 75,
        flexDirection: "row",
        justifyContent: "space-between"

    },
});
