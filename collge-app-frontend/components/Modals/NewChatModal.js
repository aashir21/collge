// @Authored by : Muhammad Aashir Siddiqui

import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View, Modal, Pressable, Text, useWindowDimensions, TouchableOpacity, ActivityIndicator, TextInput, FlatList } from 'react-native';
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme';
import * as SecureStore from "expo-secure-store"
import SpanText from "../General Component/SpanText"
import { customFetch } from '../../utility/tokenInterceptor';
import { useToast } from 'react-native-toast-notifications';
import { fetchUserIdFromStorage } from '../../utility/general';
import NewChatTab from '../Common-Tabs/NewChatTab';

const NewChatModal = ({ isVisible, onClose }) =>
{
    const windowHeight = Dimensions.get('window').height;
    const translateY = useRef(new Animated.Value(windowHeight)).current;
    const [active, setActive] = useState(false);
    const [storageUserId, setStorageUserId] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const toast = useToast()
    const { width } = useWindowDimensions()

    let searchDebounce = null;

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

    const handleSearch = (searchQuery) =>
    {
        clearTimeout(searchDebounce); // Clear the current debounce timer on each keystroke
        setIsLoading(true)
        if (!searchQuery.trim().length)
        {
            setIsLoading(false)
            setSearchResults([]); // Clear results if the query is invalid
            return; // Exit the function early
        }

        const currentUserId = SecureStore.getItem("__userId")

        searchDebounce = setTimeout(async () =>
        {
            if (searchQuery.length > 0)
            {
                try
                {
                    const response = await fetch(`${ENDPOINT.BASE_URL}/api/v2/search/getUsers?query=${searchQuery}&offset=0&pageSize=5&userId=${currentUserId}`);
                    const data = await response.json();

                    setSearchResults(data)


                } catch (error)
                {
                    console.error('Error fetching data:', error);
                    setSearchResults([]);
                }
                finally
                {
                    setIsLoading(false)
                }
            }
            else
            {
                setSearchResults([]);
            }
        }, 750); // Wait 500ms after the last keystroke to make the request
    };

    const handleOverlayPress = () =>
    {
        onClose(); // Call the onClose function when the overlay is pressed
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
                    <View>
                        <Text style={styles.title}>New chat</Text>
                        <TextInput value={searchQuery} onChangeText={(text) =>
                        {
                            setSearchQuery(text);
                            handleSearch(text);
                        }} autoFocus placeholder='Search name' placeholderTextColor={COLORS.tertiary} style={[styles.input, { width: width - 32 }]}></TextInput>

                        <View style={{ height: "100%", width: "100%" }}>
                            {
                                isLoading ? <View><ActivityIndicator size={"small"} color={COLORS.whiteAccent} /></View>
                                    :
                                    <View>
                                        <FlatList
                                            data={searchResults}
                                            scrollEnabled={true}
                                            keyExtractor={(item) => item.userId.toString()}
                                            renderItem={({ item }) => <NewChatTab
                                                userId={item.userId}
                                                avatar={item.avatar}
                                                firstName={item.firstName}
                                                lastName={item.lastName}
                                                username={item.username}
                                                premiumUser={item.premiumUser}
                                                role={item.role}
                                                bgColor={COLORS.lightBlack}
                                                onClose={onClose}
                                            />}
                                        />
                                    </View>
                            }
                        </View>

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
        height: "85%",
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.medium,
        color: COLORS.tertiary,
        textAlign: "center",
        marginVertical: SIZES.small

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
    input: {
        height: 44,
        marginBottom: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: SIZES.small,
        borderColor: COLORS.whiteAccent,
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        marginTop: SIZES.medium,
        fontSize: 12
    },
});

export default NewChatModal;
