import React, { useEffect, useState } from 'react';
import
{
    Platform, SafeAreaView, StatusBar, StyleSheet, Text, useWindowDimensions,
    View, Image, TextInput, TouchableOpacity
} from 'react-native';
import { COLORS, ENDPOINT, FONT, SIZES } from "../../../constants/theme";
import { customFetch } from "../../../utility/tokenInterceptor";
import { router } from 'expo-router';
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import { useToast } from "react-native-toast-notifications";
import * as SecureStore from "expo-secure-store"


const EditPost = ({ postId, sourceScreen }) =>
{
    const [post, setPost] = useState({});
    const [caption, setCaption] = useState('');  // Initialize with empty string
    const [isLoading, setIsLoading] = useState(true)
    const [isCaptionModified, setIsCaptionModified] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true)
    const { width } = useWindowDimensions();
    const toast = useToast();


    useEffect(() =>
    {
        handleFetchPost();
    }, []);

    const handleFetchPost = async () =>
    {

        const currentUserId = SecureStore.getItem("__userId")

        const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/post/getPostById?userId=${currentUserId}&postId=${postId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok)
        {
            const data = await response.json();
            setPost(data);
            setCaption(data.caption); // Set initial caption from fetched post
        }
        else
        {
            toast.show("Something went wrong", {
                type: "danger",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
            });
        }
    };

    const handleTextChange = (text) =>
    {
        const trimmedText = text.trim()
        setCaption(text);

        if (trimmedText)
        {
            setIsDisabled(false); // Enable if the trimmed text is not empty
        } else
        {
            setIsDisabled(true); // Disable if the trimmed text is empty
        }

    };

    const handleUpdatePost = async () =>
    {
        const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/post/updatePostById?postId=${postId}`, {
            method: 'PUT', // Or the appropriate method for updating your posts
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postId: postId,
                userId: post.userId,
                caption: caption.trim()
            }),
        });

        if (isLoading)
        {
            toast.show("Updating", {
                type: "normal",
                placement: "top",
                duration: 3000,
                offset: 30,
                animationType: "slide-in",
            });
        }

        if (response.ok)
        {
            toast.show("Post Updated Successfully", {
                type: "success",
                placement: "top",
                duration: 3000,
                offset: 30,
                animationType: "slide-in",
            });
            setIsLoading(false)

            router.back()

            trimmedCaption = caption.trim();

            router.setParams({
                updatedCaption: trimmedCaption,
                postId: postId
            })

        } else
        {
            toast.show("Something went wrong", {
                type: "danger",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
            });
            setIsLoading(false)
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                <StatusBar style="auto" />

                <View style={[styles.header, { width: width - 32, alignSelf: "center" }]}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Text style={styles.btnTitle}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleUpdatePost}
                        style={[styles.postBtn, { opacity: isDisabled ? 0.2 : 1 }]}
                        disabled={isDisabled} // Disable if not modified
                    >
                        <Text style={[styles.btnTitle, { color: COLORS.primary }]}>Update</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.capBtnCon, { width: width - 32, alignSelf: "center" }]}>
                    <View style={[styles.captionContainer, { width: width - 32, alignSelf: "center" }]}>
                        <View style={{ flexDirection: "row", height: "85%" }}>
                            <Image source={{ uri: post.avatar }} style={styles.profilePic} />
                            <View style={styles.captionBoxContainer}>
                                <TextInput
                                    onChangeText={handleTextChange}
                                    value={caption}
                                    textAlignVertical="top"
                                    placeholderTextColor={COLORS.whiteAccent}
                                    style={styles.captionBox}
                                    multiline={true}
                                    placeholder="What's cookin', good lookin'?"
                                    autoFocus
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default EditPost

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
    },
    header: {
        width: "100%",
        paddingVertical: SIZES.small,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    backBtn: {
        backgroundColor: COLORS.textAccent,
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.xxLarge,
        borderRadius: SIZES.medium,
        textAlign: "center"
    },
    postBtn: {
        backgroundColor: COLORS.tertiary,
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.xxLarge,
        borderRadius: SIZES.medium,
        textAlign: "center"
    },
    title: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: SIZES.large
    },
    profilePic: {
        height: 48,
        width: 48,
        borderRadius: 48 / 2,
        objectFit: "cover"

    },
    captionContainer: {
        flexDirection: "column",
        backgroundColor: COLORS.textAccent,
        padding: SIZES.small,
        borderRadius: SIZES.medium,
    },
    captionBoxContainer: {
        width: "90%",
        flex: 1,
        padding: SIZES.xSmall,
    },
    captionBox: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        width: "100%",
        height: "100%",
    },
    btnContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-evenly"
    },
    capBtnCon: {
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.medium,
        flexDirection: "column",
        flex: 0.6,
    },
    actionBtn: {
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.xLarge,
        width: "40%",
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.medium
    },
    disabledBtn: {
        // backgroundColor: "#989898"
        backgroundColor: "gray"
    },
    btnTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.tertiary
    }
})