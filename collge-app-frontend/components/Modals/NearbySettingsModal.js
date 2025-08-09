// @Authored by : Muhammad Aashir Siddiqui

import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View, Modal, Pressable, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONT, SIZES, ENDPOINT, NOTIFICATION_TYPES, REPORT_REQUEST_TYPES } from '../../constants/theme';
import * as SecureStore from "expo-secure-store"
import SpanText from '../General Component/SpanText';
import { AntDesign } from '@expo/vector-icons';
import { customFetch } from '../../utility/tokenInterceptor';
import { sendNotification } from '../../utility/notification';
import { fetchUserIdFromStorage } from '../../utility/general';
import { debounce } from "lodash"
import { useToast } from 'react-native-toast-notifications';
import ReportTab from "../../components/SettingsTab/ReportTab"
import BlockUser from '../SettingsTab/BlockUser';
import { router } from 'expo-router';

const NearbySettingsModal = ({ isVisible, onClose }) =>
{
    const windowHeight = Dimensions.get('window').height;
    const translateY = useRef(new Animated.Value(windowHeight)).current;
    const [active, setActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [discoveryStatus, setDiscoveryStatus] = useState(false)

    const toast = useToast()

    useEffect(() =>
    {
        if (isVisible)
        {
            setActive(true);
        }
    }, [isVisible]);

    useEffect(() =>
    {
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

    const getIsUserDiscoverable = async () =>
    {

        try
        {
            setIsLoading(true)
            setIsDisabled(true)
            const currentUserId = SecureStore.getItem("__userId");

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/nearby/getIsUserDiscoverable?userId=${currentUserId}`, {
                method: "GET"
            })

            if (response.ok)
            {
                const data = await response.text()
                setDiscoveryStatus(data)
            }

        } catch (err)
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

    const setIsUserDiscoverable = async () =>
    {

        try
        {
            setIsLoading(true)
            setIsDisabled(true)
            const currentUserId = SecureStore.getItem("__userId");

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/nearby/setIsUserDiscoverable?userId=${currentUserId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok)
            {
                const data = await response.text()

                setDiscoveryStatus(data)

                toast.show("Discovery status updated", {
                    placement: "top",
                    duration: 3500,
                    type: "normal"
                })

                onClose()
            }

        } catch (err)
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
        getIsUserDiscoverable()
    }, [])

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
                    {
                        isLoading === true ?

                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                            </View>

                            :

                            <View>
                                <Text style={styles.title}><SpanText subtext={"Nearby"} /> Settings</Text>
                                <Text style={styles.subTitle}>{discoveryStatus == "true" ? "Other users can find you using nearby" : "You're invisible, others cannot find you using Nearby"}</Text>
                                {
                                    discoveryStatus == "true" ?
                                        <TouchableOpacity onPress={setIsUserDiscoverable} disabled={isDisabled} style={[styles.actionBtn, { opacity: isDisabled ? 0.2 : 1 }]}>
                                            <Text style={styles.btnTitle}>Disable Nearby</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={setIsUserDiscoverable} disabled={isDisabled} style={[styles.actionBtn, { opacity: isDisabled ? 0.2 : 1 }]}>
                                            <Text style={styles.btnTitle}>Enable Nearby</Text>
                                        </TouchableOpacity>
                                }
                            </View>
                    }
                </Animated.View>
            </Pressable >
        </Modal >
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Semi-transparent background
        justifyContent: 'flex-end', // Align modal to the bottom
    },
    modalContainer: {
        backgroundColor: COLORS.textAccent,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        height: 275,
        paddingVertical: SIZES.xxLarge,
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
    subTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.whiteAccent,
        textAlign: "center",
        marginTop: SIZES.medium
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
    },
    actionBtn: {
        paddingVertical: SIZES.medium,
        paddingHorizontal: SIZES.xLarge,
        width: "45%",
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.medium,
        alignSelf: "center",
        marginTop: SIZES.large
    },
    btnTitle: {
        fontFamily: FONT.regular,
        color: COLORS.warning,
        fontSize: SIZES.small
    }
});

export default NearbySettingsModal;
