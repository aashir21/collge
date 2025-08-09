// @Authored by : Muhammad Aashir Siddiqui

import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View, Modal, Pressable, Text, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme';
import * as SecureStore from "expo-secure-store"
import SpanText from "../General Component/SpanText"
import { customFetch } from '../../utility/tokenInterceptor';
import { useToast } from 'react-native-toast-notifications';
import { fetchUserIdFromStorage } from '../../utility/general';

const RemoveFriendModal = ({ isVisible, onClose, firstName, userId, updateFriendStatus }) =>
{
    const windowHeight = Dimensions.get('window').height;
    const translateY = useRef(new Animated.Value(windowHeight)).current;
    const [active, setActive] = useState(false);
    const [storageUserId, setStorageUserId] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const toast = useToast()

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
            duration: 300,
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

    const removeFriendShip = async () =>
    {

        setIsLoading(true)
        const storedUserId = fetchUserIdFromStorage()

        const actorId = parseInt(storedUserId)

        try
        {

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/friend/removeFriend?senderId=${userId}&receiverId=${actorId}`, {
                method: 'DELETE',
            })

            if (response.ok)
            {
                updateFriendStatus(null)
                setIsDeleted(true)
            }

        } catch (err)
        {
            toast.show("Couldnt remove friend", {
                type: "normal",
                placement: "top",
                duration: 3500
            })
        }
        finally
        {
            setIsLoading(false)
        }

    }

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
                    <View>
                        {
                            !isDeleted ?
                                <View>
                                    <View>
                                        <Text style={styles.title}>Its <SpanText subtext={"okay"} /> to let go...</Text>
                                        <Text style={styles.description}>Remove {firstName} as a friend?</Text>
                                    </View>

                                    {
                                        isLoading ? <ActivityIndicator style={{ marginTop: 12 }} size={"small"} color={COLORS.whiteAccent} />
                                            :
                                            <TouchableOpacity onPress={removeFriendShip} style={styles.removeFriendBtn}>
                                                <Text style={styles.removeFriendBtnTitle}>Remove Friend</Text>
                                            </TouchableOpacity>
                                    }
                                </View>
                                :
                                <Text style={styles.removedTitle}>Good <SpanText subtext={"riddance"} /> probably...</Text>
                        }
                    </View>
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
        height: 300,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge + 2,
        color: COLORS.tertiary,
        textAlign: "center"

    },
    description: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        color: COLORS.whiteAccent,
        marginTop: 4,
        textAlign: "center"
    },
    removeFriendBtn: {
        marginTop: SIZES.xxLarge,
        paddingHorizontal: SIZES.medium,
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.small + 4,
        borderRadius: SIZES.medium,
        alignSelf: "center"
    },
    removeFriendBtnTitle: {
        color: COLORS.error,
        fontSize: SIZES.small
    },
    removedTitle: {
        fontSize: SIZES.xLarge + 2,
        color: COLORS.tertiary,
        fontFamily: FONT.bold
    }
});

export default RemoveFriendModal;
