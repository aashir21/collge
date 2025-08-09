import { CameraView, useCameraPermissions, CameraPictureOptions, Camera } from "expo-camera";
import React, { useState, useEffect, useRef } from "react";
import { Platform, StyleSheet, TouchableOpacity, useWindowDimensions, View, Text } from "react-native";
import CameraRequest from './CameraRequest';
import AuthVerifySelfiePreview from './AuthVerifySelfiePreview';
import { AntDesign } from "@expo/vector-icons";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

export default function VerificationCamera({ title, facing, propToUpdate, nextScreenPath }) {
    // @ts-ignore: just being lazy with types here
    const cameraRef = useRef<CameraView>(undefined);
    const [permission, requestPermission] = useCameraPermissions();
    const [pictureSizes, setPictureSizes] = useState<string[]>([]);
    const [hasAudioPermissions, setHasAudioPermissions] = useState(false)
    const [hasCameraPermissions, setHaCameraPermissions] = useState(false)

    const [photo, setPhoto] = useState<any>();
    const { width } = useWindowDimensions()

    const isCameraScreenFocused = useIsFocused()

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

    const discardPhoto = () => {

        setPhoto(undefined)

    }

    const handlePhotoStateLifting = () => {

        setPhoto(null);

    }

    useEffect(() => {
        (async () => {
            const micStatus = await Camera.requestMicrophonePermissionsAsync();
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            if (micStatus.granted && cameraStatus.granted) {
                setHasAudioPermissions(true);
                setHaCameraPermissions(true);
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

    if (!permission.granted || !hasAudioPermissions || !hasCameraPermissions) {
        // Camera permissions are not granted yet.
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
                <CameraRequest shouldDisplay={false} />
            </View>
        );
    }

    if (photo) {
        return <AuthVerifySelfiePreview photo={photo} discardPhoto={discardPhoto} handlePhotoStateLifting={handlePhotoStateLifting} propToUpdate={propToUpdate} nextScreenPath={nextScreenPath} />
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>

                {
                    isCameraScreenFocused &&
                    <CameraView
                        style={styles.camera}
                        facing={facing}
                        ref={cameraRef}
                        mode={"picture"}
                    >

                        <View style={[styles.cameraSettingContainer, { width: width - 32, }]}>

                            <Text style={styles.title}>{title}</Text>

                        </View>
                        <View style={[styles.buttonContainer, { width: width - 32, alignSelf: "center" }]}>

                            <TouchableOpacity onPress={takePhoto}>
                                <View style={[styles.shutterBtn, { backgroundColor: COLORS.tertiary }]} />
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                }

            </View>

        </View>
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
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge + 2,
        color: COLORS.tertiary

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
        justifyContent: "flex-end"

    },
});
