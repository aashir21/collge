import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONT } from '../../../constants/theme';
import { useSelector } from 'react-redux';

const MediaBtn = ({ onImagesSelected, mediaLimit, handleLoadingState, title, bgColor, types, handleDisablePostBtnState, widthSize }) =>
{
    const [status, requestPermission] = ImagePicker.useCameraPermissions();
    const [mediaStatus, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();

    const mediaData = useSelector(state => state.camera);

    const generateThumbnail = async (asset) =>
    {
        try
        {
            const { uri } = await VideoThumbnails.getThumbnailAsync(asset.uri, { time: 1000 });
            asset.thumbnailUri = uri; // Add thumbnailUri directly to asset object
            return asset;
        } catch (e)
        {
            console.warn('Error generating thumbnail:', e);
            return asset; // Return the original asset if thumbnail generation fails
        }
    };

    const pickImages = async () =>
    {

        let shouldRenderActivityIndicator = false

        if (!status?.granted || !mediaStatus?.granted)
        {
            const permissionResult = await requestPermission();
            const mediaPermissionResult = await requestMediaPermission();
            if (!permissionResult.granted || !mediaPermissionResult.granted)
            {
                Alert.alert('Permission Denied', 'Please allow Collge to access your gallery and camera from the settings.');
                return;
            }
        }
        else
        {
            shouldRenderActivityIndicator = true
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: types,
                allowsMultipleSelection: true,
                aspect: [4, 3],
                quality: 0.2,
                selectionLimit: mediaLimit,
                allowsEditing: false,
                orderedSelection: true,
                videoMaxDuration: 30,

            });

            if (result.canceled === true)
            {
                handleLoadingState(false)
                if (handleDisablePostBtnState)
                {
                    handleDisablePostBtnState(false)
                }
            }

            if (!result.canceled)
            {
                const newAssetsWithThumbnails = await Promise.all(
                    result.assets.map(async (asset) =>
                        asset.type === 'video' ? await generateThumbnail(asset) : asset // No need to wrap asset in an object
                    )
                );

                onImagesSelected(newAssetsWithThumbnails);
            }
        }

        return shouldRenderActivityIndicator;
    };

    const onPressHandler = async () =>
    {
        handleLoadingState(true)
        if (handleDisablePostBtnState)
        {
            handleDisablePostBtnState(true)
        }
        const shouldRenderActivityIndicator = await pickImages()

        // if (shouldRenderActivityIndicator === true)
        // {
        //     const timeOutId = setTimeout(() =>
        //     {
        //         handleLoadingState(true)
        //     }, 500)


        //     return () => clearTimeout(timeOutId)
        // }
    }

    useEffect(() =>
    {

        const setImagePickerConfig = async () =>
        {

            ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Current = "current"
            ImagePicker.VideoExportPreset.MediumQuality = 2

        }

        setImagePickerConfig()

    }, [])

    return (
        <View style={[styles.actionBtn, { width: widthSize, backgroundColor: bgColor, alignItems: "center", justifyContent: "center" }]}>
            <TouchableOpacity disabled={mediaData.media !== null ? true : false} onPress={onPressHandler} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", opacity: mediaData.media !== null ? 0.2 : 1 }}>
                <MaterialCommunityIcons name="image-multiple-outline" size={18} color={COLORS.secondary} style={{ marginRight: 4 }} />
                <Text style={styles.btnTitle}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    actionBtn: {
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.xLarge,
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        borderRadius: SIZES.medium,
        justifyContent: "flex-start"
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: SIZES.medium,
        marginLeft: SIZES.small,
    },
    btnTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.tertiary
    }
});

export default MediaBtn;
