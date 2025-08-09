import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Platform, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AVATAR, COLORS, ENDPOINT, FONT, REGEX, SIZES } from "../../constants/theme"
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'expo-image';
import * as SecureStore from "expo-secure-store"
import MediaBtn from "../Posts/PostActionComps/MediaBtn"
import { router } from "expo-router"
import { customFetch } from "../../utility/tokenInterceptor"
import { useToast } from 'react-native-toast-notifications';

const ChangeAvatar = () =>
{

    const [isDisabled, setIsDisabled] = useState(true)
    const [selectedImages, setSelectedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [currentAvatar, setCurrentAvatar] = useState("")
    const [isAvatarRemoved, setIsAvatarRemoved] = useState(false)
    const toast = useToast();

    const handleImagesSelected = (images) =>
    {
        if (images.length > 0)
        {
            setSelectedImages((prevImages) => [...prevImages, ...images]);
            setCurrentAvatar(images[0].uri); // Update avatar directly when images are selected
            setIsDisabled(false); // Enable the update button
            setIsAvatarRemoved(false)
        }
    };

    const handleLoadingState = (state) =>
    {
        return;
    };

    const removeAvatarAndSetToDefault = () =>
    {

        if (currentAvatar === AVATAR.DEFAULT)
        {
            return;
        }

        setCurrentAvatar(AVATAR.DEFAULT)
        setIsDisabled(false)
        setIsAvatarRemoved(true)
        setSelectedImages([])
    }

    const updateAvatar = async () =>
    {

        setIsLoading(true)
        setIsDisabled(true)
        const formData = new FormData();

        if (selectedImages.length > 0 && !isAvatarRemoved)
        {
            const newAvatarUri = selectedImages[0].uri

            formData.append('files', {
                uri: newAvatarUri,
                type: 'image/jpeg',
                name: `avatar_${Date.now()}.jpg`
            })
        }

        const userData = {
            userId: await SecureStore.getItem("__userId")
        }


        formData.append('userData', JSON.stringify(userData))

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/profile/updateAvatar`, {
                method: "PUT",
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.ok)
            {
                const data = await response.text()

                SecureStore.setItemAsync("__avatar", data);

                toast.show("Avatar updated...", {
                    placement: "top",
                    duration: 3500,
                    type: "normal"
                })

                router.back()
            }
        }
        catch (err)
        {
            toast.show("Something went wrong...", {
                placement: "top",
                duration: 3500,
                type: "normal"
            })
        }
        finally
        {
            setIsLoading(false)
            setIsDisabled(false)
        }

    }


    useEffect(() =>
    {
        const fetchAvatar = async () =>
        {
            const userAvatar = await SecureStore.getItemAsync("__avatar");
            if (userAvatar)
            {
                setCurrentAvatar(userAvatar)
            }
        };

        fetchAvatar();
    }, []);

    return (
        <SafeAreaView style={[styles.container]}>
            <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: SIZES.xSmall, marginTop: SIZES.medium }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign style={{ marginRight: 8 }} name="left" size={24} color={COLORS.tertiary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>Change Avatar</Text>
                    {/* <Text style={styles.subTitle}>A new identity perhaps?</Text> */}
                </View>
            </View>

            <View style={{ flex: 0.8, justifyContent: "center", alignItems: "center" }}>
                <View>
                    <Image style={styles.currentAvatar} source={currentAvatar} />
                    <TouchableOpacity onPress={removeAvatarAndSetToDefault} style={[styles.removeBtn]}>
                        <AntDesign name="minus" size={24} color={COLORS.error} />
                    </TouchableOpacity>
                    <View>
                        {
                            isLoading &&
                            <ActivityIndicator style={{ alignSelf: "center", marginTop: SIZES.medium }} size={"small"} color={COLORS.whiteAccent} />
                        }
                    </View>
                </View>
                <View style={{ marginVertical: SIZES.medium, flexDirection: "row", alignItems: "center" }}>
                    <MediaBtn types={["images"]} title={"Choose"} bgColor={COLORS.textAccent} mediaLimit={1} onImagesSelected={handleImagesSelected} handleLoadingState={handleLoadingState} />
                    <TouchableOpacity onPress={updateAvatar} disabled={isDisabled} style={[styles.submitBtn, { opacity: isDisabled ? 0.5 : 1 }]}>
                        <Text style={styles.btnTitle}>Update</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    )
}

export default ChangeAvatar

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge + 2,
        color: COLORS.tertiary,
    },
    subTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.whiteAccent,
    },
    currentAvatar: {
        height: 224,
        width: 224,
        borderRadius: 224 / 2,
        objectFit: "contain",
        backgroundColor: COLORS.tertiary,
        alignSelf: "center"
    },
    submitBtn: {
        backgroundColor: COLORS.tertiary,
        width: "25%",
        marginHorizontal: SIZES.xSmall,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.large,
        borderRadius: SIZES.large,
        marginVertical: SIZES.large
    },
    btnTitle: {
        color: COLORS.primary,
        fontFamily: FONT.regular,
        fontSize: SIZES.small
    },

    removeBtn: {
        backgroundColor: COLORS.tertiary,
        marginHorizontal: SIZES.xSmall,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: SIZES.large,
        position: "absolute",
        top: 15,
        right: 20
    },

})