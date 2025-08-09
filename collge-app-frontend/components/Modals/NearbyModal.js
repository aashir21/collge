import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, StyleSheet, View, Modal, Pressable, Text, Image, PanResponder, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme';
import ActionButton from '../General Component/ActionButton';
import * as Location from "expo-location"
import LocationPermissionDenied from '../Nearby/LocationPermissionDenied';
import SpanText from '../General Component/SpanText';
import { customFetch } from "../../utility/tokenInterceptor"
import * as SecureStore from "expo-secure-store"
import { router } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';

const NearbyModal = () =>
{
    const windowHeight = Dimensions.get('window').height;
    const translateY = useRef(new Animated.Value(windowHeight)).current;
    const [active, setActive] = useState(false);
    const [permission, setPermission] = useState("")
    const [discoveryStatus, setDiscoveryStatus] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const toast = useToast()

    const SHAKE_THRESHOLD = Platform.OS === "ios" ? 225 : 375;
    let last_x, last_y, last_z;
    let lastUpdate = 0;

    useEffect(() =>
    {
        Accelerometer.setUpdateInterval(100);
        const subscription = Accelerometer.addListener(onAccelerometerChange);

        return () =>
        {
            subscription.remove();
        };
    }, []);

    const onAccelerometerChange = (accelerometerData) =>
    {
        let { x, y, z } = accelerometerData;
        let currentTime = Date.now();

        if (currentTime - lastUpdate > 100)
        {
            let diffTime = currentTime - lastUpdate;
            lastUpdate = currentTime;
            let speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

            if (speed > SHAKE_THRESHOLD && !active)
            {
                showModal();
            }

            last_x = x;
            last_y = y;
            last_z = z;
        }
    };

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
                    hideModal()
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

    const showModal = () =>
    {
        setActive(true);
    };

    const hideModal = () =>
    {
        setActive(false);
    };

    const navigateToNearbyPage = () =>
    {
        hideModal()
        router.push("/(tabs)/home/nearby")
    }

    const getIsUserDiscoverable = async () =>
    {

        try
        {
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
        }

    }

    useEffect(() =>
    {
        Animated.timing(translateY, {
            toValue: active ? 0 : windowHeight,
            duration: 350,
            useNativeDriver: true,
        }).start();
    }, [active]);

    useEffect(() =>
    {
        const getPermissions = async () =>
        {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted')
            {
                setPermission("DENIED")
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});

            try
            {
                const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/nearby`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: await SecureStore.getItem("__userId"),
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude
                    })
                })
            } catch (err)
            {
                console.log(err);
            }

        };
        getPermissions();
    }, []);

    useEffect(() =>
    {
        getIsUserDiscoverable()
    }, [])

    return (
        <Modal transparent visible={active} animationType="slide" onRequestClose={hideModal}>
            <Pressable onPress={hideModal} style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateY }] },
                    ]}
                    {...panResponder.panHandlers}
                >
                    {
                        isLoading === false ?
                            <View style={{ flex: 1 }}>
                                {
                                    (permission !== "DENIED" && discoveryStatus == "true") ?
                                        <View style={{ flex: 1 }}>
                                            <View style={styles.innerContainer}>
                                                <Text style={styles.title}>Find People With <SpanText subtext={"Nearby"} />!</Text>
                                                <Text style={styles.subTitle}>Making friends have never been easier!</Text>
                                            </View>

                                            <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginVertical: SIZES.medium, flex: 0.5 }}>
                                                <Image style={styles.img} source={require("../../assets/images/search.png")}></Image>
                                            </View>

                                            <TouchableOpacity onPress={navigateToNearbyPage} style={styles.actionBtn}>
                                                <Text style={styles.btnTitle}>Find People</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <LocationPermissionDenied permission={permission} discoveryStatus={discoveryStatus} />
                                }
                            </View>
                            :
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
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
        height: 450,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    innerContainer: {

        width: "100%",
        paddingHorizontal: SIZES.medium,
        paddingTop: SIZES.large,
        alignSelf: "flex-start",
        flex: 0.2,
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge,
        color: COLORS.tertiary,
        textAlign: "center"
    },
    subTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        color: COLORS.whiteAccent,
        textAlign: "center",
        marginTop: SIZES.xSmall
    },
    img: {
        height: 148,
        width: 148,
        objectFit: "cover"
    },
    buttonContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-end",
        flex: 0.3
    },
    actionBtn: {
        backgroundColor: COLORS.primary,
        width: "45%",
        paddingVertical: SIZES.medium,
        borderRadius: SIZES.large,
        alignSelf: "center"
    },
    btnTitle: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: 13,
        textAlign: "center"
    }
});

export default NearbyModal;
