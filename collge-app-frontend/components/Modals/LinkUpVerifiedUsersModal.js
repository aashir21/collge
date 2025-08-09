import React, { useState, useRef, useEffect } from 'react';
import { Animated, Keyboard, Modal, Image, StyleSheet, TextInput, TouchableOpacity, View, Text, Easing, ActivityIndicator, useWindowDimensions, FlatList, Platform } from 'react-native';
import { COLORS, FONT, SIZES, ENDPOINT } from '../../constants/theme';
import InviteLinkUpTab from '../Common-Tabs/InviteLinkUpTab';
import EmptyState from '../General Component/EmptyState';
import { fetchUserIdFromStorage } from '../../utility/general';
import { customFetch } from '../../utility/tokenInterceptor';

const LinkUpVerifiedUsersModal = ({ isVisible, onClose, inviteUserToLinkUp }) =>
{
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const translateY = useRef(new Animated.Value(0)).current;
    const [isLoading, setIsLoading] = useState(true)
    const [results, setResults] = useState([]);

    const PAGE_SIZE = 15;
    const offset = useRef(0)

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
        {
            Platform.OS === "ios" ?
                Animated.timing(translateY, {
                    toValue: isVisible ? -keyboardHeight : 0,
                    duration: 150,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }).start()
                : Animated.timing(translateY, {
                    toValue: 0,
                    duration: 150,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }).start();

        }
    }, [isVisible, keyboardHeight]);


    const animatedStyles = {
        transform: [{ translateY }],
    };

    const fetchLinkUpVerifiedFriends = async (pageNumber) =>
    {

        const userId = await fetchUserIdFromStorage()

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/friend/getLinkUpVerifiedFriends?userId=${userId}&offset=${pageNumber}&pageSize=${PAGE_SIZE}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            setResults([...results, ...data])
            offset.current += 1

        } catch (error) 
        {
            console.error('Error fetching data:', error);
        }
        finally
        {
            setIsLoading(false)
        }
    };

    useEffect(() =>
    {
        fetchLinkUpVerifiedFriends(offset.current)
    }, [])

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity onPress={onClose} style={styles.modalOverlay} activeOpacity={1}>
                <Animated.View style={[styles.modalContent, animatedStyles]}>
                    <View style={styles.locationContainer}>

                        {
                            isLoading ? <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                                :
                                results.length > 0 ?
                                    <View style={{ flex: 1, marginVertical: SIZES.medium }}>
                                        <View style={{ marginTop: SIZES.small, alignItems: "center" }}>
                                            <Text style={styles.subTitle}>Friends you can invite to your LinkUp</Text>
                                            <Text style={styles.subTitle}>Only LinkUp verified friends can be invited to a LinkUp</Text>
                                        </View>
                                        {
                                            results.length > 0 ? <FlatList
                                                data={results}
                                                scrollEnabled={true}
                                                keyExtractor={(item) => item.friendId.toString()}
                                                renderItem={({ item }) => <InviteLinkUpTab
                                                    userId={item.friendId}
                                                    firstName={item.firstName}
                                                    lastName={item.lastName}
                                                    username={item.username}
                                                    avatar={item.avatar}
                                                    premiumUser={item.premiumUser}
                                                    role={item.role}
                                                    bgColor={COLORS.lightBlack}
                                                    inviteUserToLinkUp={inviteUserToLinkUp}
                                                />
                                                }
                                                estimatedItemSize={100}
                                                keyboardShouldPersistTaps="always"
                                                onEndReachedThreshold={0.5}
                                                onEndReached={() => fetchLinkUpVerifiedFriends(offset.current)}
                                                initialNumToRender={PAGE_SIZE}
                                            /> : <EmptyState />
                                        }
                                    </View>
                                    : <View>
                                        <Text style={[styles.locationText]}>None of your friends are LinkUp verified 😢</Text>
                                    </View>
                        }

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
        height: "100%",
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
    },
    subTitle: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.small,
    }
});

export default LinkUpVerifiedUsersModal;
