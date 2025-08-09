import React, { useState, useRef, useEffect } from 'react';
import { Animated, Keyboard, Modal, Image, StyleSheet, TextInput, TouchableOpacity, View, Text, Easing, ActivityIndicator, useWindowDimensions, FlatList } from 'react-native';
import { COLORS, FONT, SIZES, ENDPOINT } from '../../constants/theme';
import { Toast } from 'react-native-toast-notifications';
import { Octicons } from '@expo/vector-icons';
import SearchResult from '../SearchComponents/SearchResult';
import EmptyState from '../General Component/EmptyState';
import * as SecureStore from "expo-secure-store"

const MentionModal = ({ isVisible, onClose }) =>
{
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const translateY = useRef(new Animated.Value(0)).current;
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState([]);
    const [input, setInput] = useState("")
    const textInputRef = useRef(null);
    const { width } = useWindowDimensions()
    let searchDebounce = null;

    useEffect(() =>
    {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) =>
        {
            setKeyboardHeight(event.endCoordinates.height);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
        {
            setKeyboardHeight(0);
        });

        return () =>
        {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() =>
    {
        Animated.timing(translateY, {
            toValue: isVisible ? -335 : 0,
            duration: 150,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }, [isVisible]);


    const animatedStyles = {
        transform: [{ translateY }],
    };

    const handleSearch = (searchQuery) =>
    {
        clearTimeout(searchDebounce); // Clear the current debounce timer on each keystroke
        setIsLoading(true)
        if (!searchQuery.trim().length)
        {
            setResults([]); // Clear results if the query is invalid
            return; // Exit the function early
        }

        const currentUserId = SecureStore.getItem("__userId");

        searchDebounce = setTimeout(async () =>
        {
            if (searchQuery.length > 0)
            {
                try
                {
                    const response = await fetch(`${ENDPOINT.BASE_URL}/api/v2/search/getUsers?query=${searchQuery}&offset=0&pageSize=5&userId=${currentUserId}`);
                    const data = await response.json();

                    setResults(data)


                } catch (error)
                {
                    console.error('Error fetching data:', error);
                    setResults([]);
                }
                finally
                {
                    setIsLoading(false)
                }
            }
            else
            {
                setResults([]);
            }
        }, 750); // Wait 500ms after the last keystroke to make the request
    };


    return (
        <Modal
            visible={isVisible}
            animationType="none"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
                <Animated.View style={[styles.modalContent, animatedStyles]}>
                    <View style={styles.locationContainer}>

                        {
                            isLoading ? <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                                :
                                results.length > 0 ?
                                    <View style={{ flex: 1, marginVertical: SIZES.medium }}>
                                        {
                                            results.length > 0 ? <FlatList
                                                data={results}
                                                scrollEnabled={true}
                                                keyExtractor={(item) => item.userId.toString()}
                                                renderItem={({ item }) => <SearchResult
                                                    userId={item.userId}
                                                    firstName={item.firstName}
                                                    lastName={item.lastName}
                                                    username={item.username}
                                                    avatar={item.avatar}
                                                    premiumUser={item.premiumUser}
                                                    role={item.role}
                                                    bgColor={COLORS.lightBlack}
                                                />
                                                }
                                                estimatedItemSize={100}
                                                keyboardShouldPersistTaps="always"
                                            /> : <EmptyState />
                                        }
                                    </View>
                                    : <View>
                                        <Image style={styles.modalImg} source={require("../../assets/images/long-hair-woman.png")} />
                                        <Text style={[styles.locationText, { marginVertical: SIZES.xSmall }]}>Search to tag a friend.</Text>
                                    </View>
                        }

                    </View>

                    <View style={[styles.inputContainer, { width: width - 32, alignSelf: "center" }]}>
                        <TextInput
                            ref={textInputRef}
                            style={styles.textInput}
                            blurOnSubmit={false}
                            autoFocus={true}
                            placeholder="Search User"
                            onChangeText={(newText) => { setInput(newText); handleSearch(newText) }}
                            defaultValue={input}
                            placeholderTextColor={COLORS.whiteAccent}
                        />
                        {/* <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                            <Octicons name="search" size={22} color={COLORS.tertiary} />
                        </TouchableOpacity> */}
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.textAccent,
        height: 350,
        alignItems: "center",
        borderTopLeftRadius: SIZES.large,
        borderTopRightRadius: SIZES.large,
        justifyContent: "flex-end"
    },
    modalImg: {
        height: 124,
        width: 124,
        alignSelf: "center"
    },
    textInput: {
        width: "100%",
        height: 56,
        borderRadius: SIZES.large,
        backgroundColor: COLORS.lightBlack,
        paddingHorizontal: SIZES.small,
        alignSelf: "flex-start",
        fontFamily: FONT.regular,
        color: COLORS.tertiary
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10
    },
    locationContainer: {
        height: "80%",
        justifyContent: "center",
        alignItems: "center"
    },
    locationText: {
        fontSize: SIZES.medium,
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        textAlign: "center"
    },
    searchBtn: {
        marginLeft: SIZES.xSmall,
        backgroundColor: COLORS.secondary,
        height: 44,
        width: 44,
        borderRadius: 27,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default MentionModal;
