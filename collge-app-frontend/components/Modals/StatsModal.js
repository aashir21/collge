// @Authored by : Muhammad Aashir Siddiqui

import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View, Modal, Pressable, Text, useWindowDimensions } from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import * as SecureStore from "expo-secure-store"
import { AntDesign, MaterialCommunityIcons, Fontisto } from '@expo/vector-icons';

const StatsModal = ({ isVisible, onClose }) =>
{
    const windowHeight = Dimensions.get('window').height;
    const { width } = useWindowDimensions()
    const translateY = useRef(new Animated.Value(windowHeight)).current;
    const [active, setActive] = useState(false);
    const [storageUserId, setStorageUserId] = useState()

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

    return (
        <Modal transparent visible={active} animationType='slide' onRequestClose={onClose} >
            <Pressable style={styles.overlay} onPress={handleOverlayPress}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateY }] },
                    ]}
                    {...panResponder.panHandlers}
                >

                    <View style={[styles.statsContainer, { width: width - 32 }]}>
                        <MaterialCommunityIcons name="image-multiple-outline" size={32} color={COLORS.tertiary} style={{ marginRight: 16 }} />
                        <View style={styles.statsDescTitle}>
                            <Text style={styles.title}>Posts</Text>
                            <Text style={[styles.description]}>The number of awesome posts made by you!</Text>
                        </View>
                    </View>

                    <View style={[styles.statsContainer, { width: width - 32 }]}>
                        <AntDesign name="arrowup" size={32} color={COLORS.secondary} style={{ marginRight: 16 }} />
                        <View style={styles.statsDescTitle}>
                            <Text style={styles.title}>Reputation</Text>
                            <Text style={[styles.description]}>Your reputation depends on the number upvotes and downvotes you get on your post!</Text>
                        </View>
                    </View>

                    <View style={[styles.statsContainer, { width: width - 32 }]}>
                        <Fontisto name="fire" size={32} color={"#db7748"} style={{ marginRight: 20, marginLeft: 4 }} />
                        <View style={styles.statsDescTitle}>
                            <Text style={styles.title}>Fire</Text>
                            <Text style={[styles.description]}>Want to rack up those Fire points? Link Up with students and ignite the competition!</Text>
                        </View>
                    </View>

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
        height: 375,
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
        fontSize: SIZES.fontBodySize,
        color: COLORS.tertiary
    },
    description: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize - 2,
        color: COLORS.whiteAccent
    }
});

export default StatsModal;
