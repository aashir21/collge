// @Authored by : Muhammad Aashir Siddiqui

import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View, Modal, Pressable, Text, TouchableOpacity, ActivityIndicator, FlatList, useWindowDimensions } from 'react-native';
import { COLORS, ENDPOINT, FONT, NOTIFICATION_TYPES, SIZES } from '../../constants/theme';
import SpanText from "../General Component/SpanText"
import { customFetch } from '../../utility/tokenInterceptor';
import { useToast } from 'react-native-toast-notifications';
import * as SecureStore from "expo-secure-store"
import ShareFriendTab from '../Posts/ShareFriendTab';
import { Feather } from '@expo/vector-icons';
import { sendNotification } from "../../utility/notification"

const SharePostModal = ({ isVisible, onClose, postId }) =>
{
    const windowHeight = Dimensions.get('window').height;
    const translateY = useRef(new Animated.Value(windowHeight)).current;
    const [active, setActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [friends, setFriends] = useState(new Set())
    const [selectedFriend, setSelectedFriend] = useState(new Set());
    const [offset, setOffset] = useState(0)
    const toast = useToast()
    const PAGE_SIZE = 8;
    const [isDisabled, setIsDisabled] = useState(true)

    const { width } = useWindowDimensions()

    const hideModal = () =>
    {
        onClose()
        setActive(false)
    }

    const sharePost = async () =>
    {

        const friendsArray = Array.from(selectedFriend)
        const currentUserId = await SecureStore.getItem("__userId");

        for (const friend of friendsArray)
        {
            try
            {
                const newMessage = {
                    senderId: currentUserId,
                    recipientId: friend,
                    content: "",
                    postId: postId
                }

                const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/chat/sharePost`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(newMessage)
                })

                if (response.ok)
                {
                    toast.show("Post shared!", {
                        placement: "top",
                        duration: 3500,
                        type: "normal"
                    })

                    actorId = parseInt(currentUserId)
                    userIdString = friend.toString()

                    sendNotification(actorId, new Array(userIdString), [0], postId, "null", "", NOTIFICATION_TYPES.POST_SHARE);

                    onClose()
                }

            }
            catch (err)
            {

                toast.show("Something went wrong", {
                    placement: "top",
                    duration: 3500,
                    type: "normal"
                })

            }
            finally
            {
                setIsDisabled(false)
            }
        }

    }

    const selectFriendForSharing = (userId) =>
    {

        if (selectedFriend.has(userId))
        {
            setSelectedFriend((prevSelectedFriends) =>
            {
                const newSet = new Set(prevSelectedFriends);
                newSet.delete(userId);
                return newSet;
            });
        }
        else
        {
            setSelectedFriend((prevSelectedFriends) =>
            {
                const newSet = new Set(prevSelectedFriends);
                newSet.add(userId);
                return newSet;
            });

        }
    };

    useEffect(() =>
    {
        if (isVisible)
        {
            setActive(true);
        }
    }, [isVisible]);

    useEffect(() =>
    {

        fetchFriendList(offset)

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
        setActive(false)
        onClose(); // Call the onClose function when the overlay is pressed
    };

    const fetchFriendList = async (pageNum) =>
    {

        const currentUserId = await SecureStore.getItem("__userId")

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/friend/getFriends?userId=${currentUserId}&offset=${pageNum}&pageSize=${PAGE_SIZE}`, {
                method: "GET"
            })

            if (response.ok)
            {

                const data = await response.json()

                setFriends([...friends, ...data])
                setOffset((prevOffset) => prevOffset + 1)

            }
        } catch (err)
        {
            toast.show("Something went wrong", {
                placement: "top",
                duration: 3000,
                type: "normal"
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
                        { transform: [{ translateY }], height: friends.length > 4 ? 475 : 325 },
                    ]}
                    {...panResponder.panHandlers}
                >

                    {
                        isLoading ?

                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                            </View>
                            :
                            <View style={{ alignSelf: "center" }}>

                                {
                                    friends.length > 0 ?
                                        <View>
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                <Text style={styles.title}>Share with <SpanText subtext={"friends"} />...</Text>
                                                <TouchableOpacity onPress={sharePost} style={[styles.shareBtn,
                                                { opacity: (selectedFriend.size === 0) ? 0.5 : 1 }
                                                ]}
                                                    disabled={selectedFriend.size === 0}
                                                >
                                                    <Feather name="send" size={22} color={COLORS.tertiary} />
                                                </TouchableOpacity>
                                            </View>
                                            <FlatList
                                                style={{ flexWrap: "wrap", width: width - 32 }}
                                                data={Array.from(friends)}
                                                scrollEnabled={true}
                                                bounces={true}
                                                keyboardShouldPersistTaps="always"
                                                keyboardDismissMode="on-drag"
                                                keyExtractor={(item) => item.friendId.toString()}
                                                renderItem={({ item }) =>
                                                (
                                                    <ShareFriendTab
                                                        userId={item.friendId}
                                                        firstName={item.firstName}
                                                        lastName={item.lastName}
                                                        avatar={item.avatar}
                                                        premiumUser={item.premiumUser}
                                                        role={item.role}
                                                        selectFriendForSharing={selectFriendForSharing}
                                                        selectedFriend={selectedFriend}
                                                    />
                                                )}
                                                contentContainerStyle={styles.container}
                                                onEndReachedThreshold={0.5}
                                                onEndReached={() => fetchFriendList(offset)}
                                                initialNumToRender={PAGE_SIZE}
                                            />
                                        </View>
                                        :
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.large, color: COLORS.tertiary }}>No one in the friends list</Text>
                                            <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.whiteAccent }}>Add friends to start sharing</Text>
                                        </View>
                                }
                            </View>
                    }

                </Animated.View>

            </Pressable>
        </Modal>
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
        height: 475,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.tertiary,
        textAlign: "center",
        marginVertical: SIZES.large
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
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    shareBtn: {
        marginLeft: SIZES.xSmall,
        backgroundColor: COLORS.secondary,
        height: 44,
        width: 44,
        borderRadius: 27,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default SharePostModal;
