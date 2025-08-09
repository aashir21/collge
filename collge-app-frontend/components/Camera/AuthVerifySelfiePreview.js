import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as MediaLibrary from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import { AntDesign, MaterialIcons, FontAwesome6, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useToast } from "react-native-toast-notifications";
import { manipulateAsync, FlipType } from 'expo-image-manipulator';
import { router, useNavigation } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setVerificationData } from "../../state/verification/verificationSlice"

const AuthVerifySelfiePreview = ({ photo, discardPhoto, handlePhotoStateLifting, nextScreenPath, propToUpdate }) =>
{

    const [capturedPhoto, setCapturedPhoto] = useState(photo);
    const { width } = useWindowDimensions()

    const dispatch = useDispatch();

    useEffect(() =>
    {

        dispatch(
            setVerificationData(
                {
                    [propToUpdate]: capturedPhoto.uri
                }
            )
        )

    }, [capturedPhoto]);

    const flipImage = async () =>
    {
        const manipResult = await manipulateAsync(
            capturedPhoto.localUri || capturedPhoto.uri,
            [{ flip: FlipType.Horizontal }],
        );
        setCapturedPhoto(manipResult);
    };

    const handleNavigateToPostPage = async () =>
    {

        router.replace(nextScreenPath)
        handlePhotoStateLifting()
    }


    return (
        <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
            <Image style={styles.preview} source={{ uri: capturedPhoto.uri }} />

            <View style={[styles.topButtonContainer, { width: width - 32 }]}>
                <TouchableOpacity onPress={discardPhoto}>
                    <AntDesign name="reload1" size={30} color={COLORS.tertiary} />
                </TouchableOpacity>

                <View style={styles.editBtnsContainer}>
                    <TouchableOpacity onPress={flipImage} style={{ marginHorizontal: SIZES.medium }}>
                        <MaterialIcons name="flip" size={30} color={COLORS.tertiary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.buttonContainer, { width: width - 32 }]}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleNavigateToPostPage}>
                    <Text style={{ color: COLORS.tertiary, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize - 2 }}>Next</Text>
                    <AntDesign name="arrowright" size={18} color={COLORS.secondary} />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default AuthVerifySelfiePreview

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
        justifyContent: "flex-end",

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