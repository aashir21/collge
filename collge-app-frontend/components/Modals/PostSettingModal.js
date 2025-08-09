import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View, Modal, Pressable, ActivityIndicator, Keyboard } from 'react-native';
import { COLORS, ENDPOINT, REPORT_REQUEST_TYPES, REPORT_TYPES, SIZES } from '../../constants/theme';
import ReportTab from '../SettingsTab/ReportTab';
import ProfileTab from '../SettingsTab/ProfileTab';
import EditTab from '../SettingsTab/EditTab'
import DeleteTab from '../SettingsTab/DeleteTab';
import SaveTab from "../SettingsTab/SaveTab"
import * as SecureStore from "expo-secure-store"
import { router } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { customFetch } from '../../utility/tokenInterceptor';
import { navigateToReportPage } from "../../utility/navigation"

const PostSettingModal = ({ userId, isVisible, onClose, postId, sourceScreen, deletePost, editing, postType, shoudlGoBack }) =>
{
    const windowHeight = Dimensions.get('window').height;
    const translateY = useRef(new Animated.Value(windowHeight)).current;
    const [active, setActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [storageUserId, setStorageUserId] = useState()
    const isFocused = useIsFocused()
    const toast = useToast();

    useEffect(() =>
    {
        if (isVisible)
        {
            setActive(true);
        }

    }, [isVisible]);

    const handleFetchUserIdFromStorage = async () =>
    {
        const fetchedId = await SecureStore.getItem("__userId")

        setStorageUserId(fetchedId)
    }

    useEffect(() =>
    {

        handleFetchUserIdFromStorage()

        Animated.timing(translateY, {
            toValue: active ? 0 : windowHeight,
            duration: 150,
            useNativeDriver: true,
        }).start();

    }, [active]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0, // Only allow vertical down
            onPanResponderMove: (_, gestureState) =>
            {
                translateY.setValue(Math.max(0, gestureState.dy)); // Don't allow dragging up
            },
            onPanResponderRelease: (_, gestureState) =>
            {
                if (gestureState.dy > windowHeight / 3 || gestureState.vy > 0.5)
                {
                    onClose();
                } else
                {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const handleOverlayPress = () =>
    {
        onClose(); // Call the onClose function when the overlay is pressed
    };

    const handleOnEditPress = () =>
    {
        if (postId && isFocused)
        {
            if (sourceScreen == "HOME")
            {
                router.push({
                    pathname: "home/post/editPost",
                    params: {
                        id: postId,
                        sourceScreen: "HOME"
                    }
                })
            }
            else
            {
                router.push({
                    pathname: "profile/post/editPost",
                    params: {
                        id: postId,
                        sourceScreen: "PROFILE"
                    }
                })
            }

            onClose()
        }
    }

    const handleDelete = async () =>
    {
        try
        {
            const response = customFetch(`${ENDPOINT.BASE_URL}/api/v1/post/deletePostById?postId=${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            toast.show("Deleting post", {
                type: "normal",
                duration: 3000,
                placement: "top",
                offset: 500,
                animationType: "slide-in",
            });

            if ((await response).status === 204)
            {
                deletePost();
                onClose();
                setIsLoading(false)

                if (shoudlGoBack === true)
                {
                    router.back()
                }

                toast.show("Post Deleted Successfully", {
                    type: "success",
                    duration: 2000,
                    placement: "top",
                    offset: 30,
                    animationType: "slide-in",
                });

            }
            else
            {
                toast.show("Error deleting post, try again later", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    offset: 30,
                    animationType: "slide-in",
                });

                onClose();
                setIsLoading(false)
            }


        } catch (error)
        {
            console.log('Error deleting post:', error);
            // Handle the error appropriately
        }
        finally
        {
            onClose();
            setIsLoading(false)
        }
    };

    return (
        <Modal transparent visible={active} onRequestClose={onClose} >
            <Pressable style={styles.overlay} onPress={handleOverlayPress}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateY }] },
                    ]}
                    {...panResponder.panHandlers}
                >
                    {/* <SaveTab /> */}
                    {
                        storageUserId == userId ? <Pressable onPress={handleOnEditPress}>
                            <EditTab />
                        </Pressable> : null
                    }

                    {
                        storageUserId == userId ? null : <ProfileTab postType={postType} onClose={onClose} userId={userId} />
                    }

                    {
                        storageUserId == userId ? <Pressable onPress={handleDelete}><DeleteTab /></Pressable> : null
                    }

                    {
                        storageUserId == userId ? null : <ReportTab onClose={onClose} type={REPORT_REQUEST_TYPES.POST} postId={postId} userId={userId} />
                    }

                </Animated.View>
            </Pressable >
        </Modal >
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'flex-end', // Align modal to the bottom
    },
    modalContainer: {
        backgroundColor: COLORS.textAccent,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: SIZES.xxLarge
    },
});

export default PostSettingModal;
