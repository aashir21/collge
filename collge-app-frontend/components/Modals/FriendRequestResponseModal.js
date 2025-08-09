// @Authored by : Muhammad Aashir Siddiqui

import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View, Modal, Pressable, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONT, SIZES, ENDPOINT, NOTIFICATION_TYPES } from '../../constants/theme';
import * as SecureStore from "expo-secure-store"
import SpanText from '../General Component/SpanText';
import { AntDesign } from '@expo/vector-icons';
import { customFetch } from '../../utility/tokenInterceptor';
import { sendNotification } from '../../utility/notification';
import { fetchUserIdFromStorage } from '../../utility/general';
import { debounce } from "lodash"
import { useToast } from 'react-native-toast-notifications';

const FriendRequestModal = ({ isVisible, onClose, firstName, universityId, userId, updateFriendStatus }) =>
{
    const windowHeight = Dimensions.get('window').height;
    const translateY = useRef(new Animated.Value(windowHeight)).current;
    const [active, setActive] = useState(false);
    const [storageUserId, setStorageUserId] = useState()
    const [friendRequestResponse, setFriendRequestResponse] = useState()
    const [isLoading, setIsLoading] = useState(false)

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

    const handleRespondToFriendRequest = debounce(async (respondStatus) =>
    {

        setIsLoading(true)
        const storedUserId = fetchUserIdFromStorage()

        const actorId = parseInt(storedUserId);

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/friend/respond?senderId=${userId}&receiverId=${actorId}&accept=${respondStatus}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok)
            {
                const data = await response.text()

                if (respondStatus === true)
                {

                    sendNotification(
                        actorId,
                        [userId.toString()],
                        [universityId],
                        "null",
                        "null",
                        "",
                        NOTIFICATION_TYPES.ACCEPTED_FRIEND_REQUEST
                    )


                }

                setFriendRequestResponse(data)

                handleCancelNotification();

                updateFriendStatus("ACCEPTED")

            }
            else
            {
                handleCancelNotification();
                updateFriendStatus(null)
            }
        } catch (err)
        {
            toast.show("Could not respond to friend request", {

                placement: "top",
                duration: 3000,
                type: "normal"

            })
        }
        finally
        {
            setIsLoading(false)
        }

    }, 350)

    const handleCancelNotification = async () =>
    {
        const storedUserId = fetchUserIdFromStorage()

        const actorId = parseInt(storedUserId)

        try
        {
            await customFetch(`${ENDPOINT.BASE_URL}/api/v1/notification?senderId=${userId}&receiverId=${actorId}&notificationType=${NOTIFICATION_TYPES.FRIEND_REQUEST}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (err)
        {
            toast.show("Could not un-send friend request", {

                placement: "top",
                duration: 3000,
                type: "normal"

            })
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
                            friendRequestResponse === "ACCEPTED" ? <Text style={styles.responseTitle}>You and {firstName} are now <SpanText subtext={"friends"}></SpanText>! 🥳</Text>
                                : friendRequestResponse === "REJECTED" ? <Text style={styles.responseTitle}>Maybe in another universe, you and <SpanText subtext={firstName} /> can be friends 😣</Text>
                                    :
                                    <View>
                                        <View>
                                            <Text style={styles.title}>New <SpanText subtext={"friend"} /> alert!</Text>
                                            <Text style={styles.description}>Add {firstName} as a friend?</Text>
                                        </View>

                                        <View style={[styles.btnContainer]}>
                                            {
                                                isLoading ? <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                                                    :
                                                    <View style={{ flexDirection: "row" }}>
                                                        <TouchableOpacity onPress={() => handleRespondToFriendRequest(true)} style={styles.respondFriendBtn}>
                                                            <Text style={[styles.respondFriendBtnTitle, { color: COLORS.sucess }]}>Accept</Text>
                                                            <AntDesign name="check" size={16} color={COLORS.tertiary} style={{ marginLeft: 4 }} />
                                                        </TouchableOpacity>

                                                        <TouchableOpacity style={styles.respondFriendBtn} onPress={() => handleRespondToFriendRequest(false)}>
                                                            <Text style={styles.respondFriendBtnTitle}>Reject</Text>
                                                            <AntDesign name="close" size={16} color={COLORS.tertiary} style={{ marginLeft: 4 }} />
                                                        </TouchableOpacity>
                                                    </View>
                                            }
                                        </View>
                                    </View>
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
        height: 350,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        justifyContent: "center"
    },
    statsContainer: {
        backgroundColor: COLORS.lightBlack,
        paddingVertical: SIZES.medium,
        paddingHorizontal: SIZES.medium,
        borderRadius: SIZES.large,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: SIZES.medium,
    },
    statsDescTitle: {
        flexDirection: "column",
        width: "80%"
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
    btnContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: SIZES.medium
    },
    respondFriendBtn: {
        paddingHorizontal: SIZES.xxLarge,
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.small + 4,
        borderRadius: SIZES.medium,
        marginRight: SIZES.small,
        flexDirection: "row",
        alignItems: "center"
    },
    respondFriendBtnTitle: {
        color: COLORS.error,
        fontSize: SIZES.small,
    },
    responseTitle: {
        textAlign: "center",
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge + 2,
        color: COLORS.tertiary,
    }
});

export default FriendRequestModal;
