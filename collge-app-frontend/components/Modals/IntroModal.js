// @Authored by : Muhammad Aashir Siddiqui

import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View, Modal, Pressable, Text, useWindowDimensions, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import * as SecureStore from "expo-secure-store"
import { AntDesign, MaterialCommunityIcons, Fontisto, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import SpanText from '../General Component/SpanText';

const IntroModal = ({ isVisible, onClose }) =>
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
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 0, // Allow vertical swipes
            onPanResponderMove: (_, gestureState) =>
            {
                // Update translateY based on the gesture movement
                translateY.setValue(Math.max(0, gestureState.dy)); // Only positive dy for downward drag
            },
            onPanResponderRelease: (_, gestureState) =>
            {
                if (gestureState.dy > windowHeight / 3 || gestureState.vy > 0.5)
                {
                    // Close modal if dragged down sufficiently or released with velocity
                    onClose();
                } else if (gestureState.dy < -windowHeight / 3 || gestureState.vy < -0.5)
                {
                    // Close modal if swiped up sufficiently or released with velocity upwards
                    onClose();
                } else
                {
                    // Return to initial position
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
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateY }] },
                    ]}
                // {...panResponder.panHandlers}
                >

                    <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: SIZES.large }}
                        style={{ flexGrow: 1 }}>
                        <Text style={styles.modalTitle}>Welcome to <SpanText subtext={"Collge"} />!</Text>
                        <Text style={styles.modalSubtitle}>A quick guide to Collge!</Text>
                        <View style={[styles.statsContainer, { width: width - 32 }]}>
                            <Ionicons name="earth-sharp" size={28} color={COLORS.tertiary} style={{ marginRight: 16 }} />
                            <View style={styles.statsDescTitle}>
                                <Text style={styles.title}>Global & University Feed</Text>
                                <Text style={[styles.description]}>Collge consists of two different feeds. University feed is tailored to show posts from your university only! Global feed shows activity from all around Collge, no matter which university! Swipe left or right on home screen to navigate between the two.</Text>
                            </View>
                        </View>

                        <View style={[styles.statsContainer, { width: width - 32 }]}>
                            <MaterialCommunityIcons name="hook" size={28} color={COLORS.secondary} style={{ marginRight: 16 }} />
                            <View style={styles.statsDescTitle}>
                                <Text style={styles.title}>LinkUp</Text>
                                <Text style={[styles.description]}>Spontaneous hangouts have never been easier! Create a LinkUp session or join one! Everytime you LinkUp with someone, you get 30 Fire points. Unlock Blaze after collecting 300 Fire points.</Text>
                            </View>
                        </View>

                        <View style={[styles.statsContainer, { width: width - 32 }]}>
                            <FontAwesome5 name="map-marked-alt" size={28} color={"#ba9be0"} style={{ marginRight: 20, marginLeft: 4 }} />
                            <View style={styles.statsDescTitle}>
                                <Text style={styles.title}>Nearby</Text>
                                <Text style={[styles.description]}>Simply shake your phone on university feed and see the magic happen! Nearby shows you results in a radius of 1 mile of your current location.</Text>
                            </View>
                        </View>

                        <View style={[styles.statsContainer, { width: width - 32 }]}>
                            <Fontisto name="wink" size={28} color={COLORS.brandYellow} style={{ marginRight: 20, marginLeft: 4 }} />
                            <View style={styles.statsDescTitle}>
                                <Text style={styles.title}>Wink</Text>
                                <Text style={[styles.description]}>Too scared to say hi? Say hi with a wink. Don't want someone to wink at you? Turn it on and off from the settings!</Text>
                            </View>
                        </View>

                        <View style={[styles.statsContainer, { width: width - 32 }]}>
                            <AntDesign name="question" size={28} color={"#ed8ad8"} style={{ marginRight: 20, marginLeft: 4 }} />
                            <View style={styles.statsDescTitle}>
                                <Text style={styles.title}>Confessions</Text>
                                <Text style={[styles.description]}>Know a secret? Spill it! Stir some drama!</Text>
                            </View>
                        </View>

                        <View style={[styles.statsContainer, { width: width - 32 }]}>
                            <MaterialCommunityIcons name="cat" size={28} color={COLORS.warning} style={{ marginRight: 20, marginLeft: 4 }} />
                            <View style={styles.statsDescTitle}>
                                <Text style={styles.title}>Jack</Text>
                                <Text style={[styles.description]}>Your campus cat! The official mascot of Collge. Say hi regularly or he'll snitch to your professor.</Text>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => onClose()} style={styles.closeBtn}>
                            <Text style={styles.closeBtnTitle}>Lets Go!</Text>
                        </TouchableOpacity>
                    </ScrollView>

                </Animated.View>
            </View>
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
        flex: 0.8,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
    },
    statsContainer: {
        backgroundColor: COLORS.lightBlack,
        paddingVertical: SIZES.medium,
        paddingHorizontal: SIZES.medium,
        borderRadius: SIZES.large,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: SIZES.small,
    },
    statsDescTitle: {
        flexDirection: "column",
        width: "85%"
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
    },
    modalTitle: {
        textAlign: "center",
        color: COLORS.tertiary,
        fontFamily: FONT.bold,
        fontSize: SIZES.large
    },
    modalSubtitle: {
        textAlign: "center",
        marginBottom: SIZES.large,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        fontSize: SIZES.small
    },
    closeBtn: {
        backgroundColor: COLORS.primary,
        width: "35%",
        alignSelf: "center",
        marginVertical: SIZES.medium,
        paddingVertical: SIZES.medium,
        borderRadius: SIZES.large
    },
    closeBtnTitle: {
        color: COLORS.tertiary,
        fontSize: SIZES.small,
        fontFamily: FONT.regular,
        textAlign: "center"
    }
});

export default IntroModal;
