import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as MediaLibrary from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import { AntDesign, MaterialIcons, FontAwesome6, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useToast } from "react-native-toast-notifications";
import { manipulateAsync, FlipType } from 'expo-image-manipulator';
import { router, useNavigation } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setMedia } from "../../state/camera/cameraSlice"

const ImagePreview = ({ photo, discardPhoto, handlePhotoStateLifting }) =>
{

    const [capturedPhoto, setCapturedPhoto] = useState(photo);
    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
    const { width } = useWindowDimensions()
    const toast = useToast();

    const dispatch = useDispatch();

    useEffect(() =>
    {
        (async () =>
        {
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
        })();

        dispatch(

            setMedia(
                {
                    media: capturedPhoto,
                    type: "IMAGE"
                }
            )
        )

    }, [capturedPhoto]);

    let savePhoto = async () =>
    {

        await MediaLibrary.saveToLibraryAsync(capturedPhoto.uri).then(() =>
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

    const flipImage = async () =>
    {
        const manipResult = await manipulateAsync(
            capturedPhoto.localUri || capturedPhoto.uri,
            [{ flip: FlipType.Horizontal }],
        );
        setCapturedPhoto(manipResult);
    };

    const rotateImage = async () =>
    {
        const manipResult = await manipulateAsync(
            capturedPhoto.localUri || capturedPhoto.uri,
            [{ rotate: 90 }],
        );
        setCapturedPhoto(manipResult);
    };

    const handleNavigateToPostPage = async () =>
    {

        router.push("/(tabs)/post/postinfo")

        handlePhotoStateLifting()
    }


    return (
        <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
            <Image style={styles.preview} source={{ uri: capturedPhoto.uri }} />

            <View style={[styles.topButtonContainer, { width: width - 32 }]}>
                <TouchableOpacity onPress={discardPhoto}>
                    <AntDesign name="close" size={30} color={COLORS.tertiary} />
                </TouchableOpacity>

                <View style={styles.editBtnsContainer}>
                    <TouchableOpacity onPress={flipImage} style={{ marginHorizontal: SIZES.medium }}>
                        <MaterialIcons name="flip" size={30} color={COLORS.tertiary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={rotateImage}>
                        <MaterialCommunityIcons name="rotate-right-variant" size={30} color={COLORS.tertiary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.buttonContainer, { width: width - 32 }]}>
                {hasMediaLibraryPermission ?
                    <TouchableOpacity style={styles.saveBtn} onPress={savePhoto}>
                        <Text style={{ color: COLORS.tertiary, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize - 2 }}>Save</Text>
                        <AntDesign name="download" size={16} color={COLORS.tertiary} />
                    </TouchableOpacity>
                    : undefined}
                <TouchableOpacity style={styles.saveBtn} onPress={handleNavigateToPostPage}>
                    <Text style={{ color: COLORS.tertiary, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize - 2 }}>Next</Text>
                    <AntDesign name="arrowright" size={18} color={COLORS.secondary} />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default ImagePreview

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
        alignItems: "flex-end"
    }

})