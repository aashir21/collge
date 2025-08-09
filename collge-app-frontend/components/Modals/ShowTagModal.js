import React, { useState, useRef, useEffect } from 'react';
import { Animated, PanResponder, Modal, Image, StyleSheet, Dimensions, TouchableOpacity, View, Text, Easing, FlatList } from 'react-native';
import { COLORS, FONT, SIZES, ENDPOINT } from '../../constants/theme';
import { Toast } from 'react-native-toast-notifications';
import { Octicons } from '@expo/vector-icons';
import SearchResult from '../SearchComponents/SearchResult';
import EmptyState from '../General Component/EmptyState';
import TaggedUserTab from '../TagComps/TaggedUserTab';

const SetTagModal = ({ isVisible, onClose, taggedUsers, handleRemoveTaggedUser, shouldRunFunction }) =>
{
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const translateY = useRef(new Animated.Value(0)).current;
    const windowHeight = Dimensions.get('window').height;

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


    useEffect(() =>
    {
        Animated.timing(translateY, {
            toValue: isVisible ? -keyboardHeight : 0,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }, [isVisible, keyboardHeight]);


    const animatedStyles = {
        transform: [{ translateY }],
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
                <Animated.View {...panResponder.panHandlers} style={[styles.modalContent, animatedStyles, { height: taggedUsers.length >= 2 ? 250 : 175 }]}>
                    <View style={styles.locationContainer}>
                        <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.medium, color: COLORS.tertiary, textAlign: "center", paddingVertical: SIZES.small }}>In This Post</Text>
                        <FlatList
                            data={taggedUsers}
                            scrollEnabled={true}
                            keyExtractor={(item) => item.userId.toString()}
                            renderItem={({ item }) => <TaggedUserTab
                                userId={item.userId}
                                firstName={item.firstName}
                                lastName={item.lastName}
                                username={item.username}
                                avatar={item.avatar}
                                premiumUser={item.premiumUser}
                                role={item.role}
                                bgColor={COLORS.lightBlack}
                                handleRemoveTaggedUser={handleRemoveTaggedUser}
                                shouldRunFunction={shouldRunFunction}
                                onClose={onClose}
                            />
                            }
                            estimatedItemSize={100}
                            keyboardShouldPersistTaps="always"
                        />

                    </View>

                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.30)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.textAccent,
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
    },
    locationContainer: {
        height: "100%",

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

export default SetTagModal;
