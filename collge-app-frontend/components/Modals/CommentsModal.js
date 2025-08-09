import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Animated, Keyboard, Modal, Image, StyleSheet, TextInput, TouchableOpacity, View, Text, Easing, ActivityIndicator, useWindowDimensions, FlatList, Platform, Dimensions, PanResponder, Pressable, SafeAreaView, KeyboardAvoidingView, ScrollView } from 'react-native';
import { COLORS, FONT, SIZES, ENDPOINT } from '../../constants/theme';
import { Feather, Octicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import CommentTab from '../Common-Tabs/CommentTab';
import * as SecureStore from "expo-secure-store"
import { useDispatch, useSelector } from 'react-redux';
import { setComment } from "../../state/comment/commentSlice";
import { customFetch } from '../../utility/tokenInterceptor';
import EmptyComments from '../General Component/EmptyComments';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const CommentsModal = ({ isVisible, onClose, postId }) =>
{
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const translateY = useRef(new Animated.Value(0)).current;
    const [storedUsername, setStoredUsername] = useState("")
    const windowHeight = Dimensions.get('window').height;
    const [loading, setLoading] = useState(false)
    const [comments, setComments] = useState([])
    const [input, setInput] = useState("")
    const { width } = useWindowDimensions()

    const textInputRef = useRef(null);
    const offset = useRef(0)
    const modalHeight = useRef(0.5)


    const sheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    const dispatch = useDispatch();
    const commentData = useSelector(state => state.comment);

    const fetchUsernameFromStorage = async () =>
    {

        const storageUsername = await SecureStore.getItem("__username")

        setStoredUsername(storageUsername);

    }


    const handleFetchComments = async (pageNum) =>
    {
        try
        {
            setLoading(true);

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/comment/getCommentsByPostId/${postId}/${pageNum}/15`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200)
            {
                const data = await response.json();
                offset.current += 1;
                setComments([...comments, ...data])

            }

        } catch (error)
        {
            console.error('Failed to fetch data:', error);
        }
        finally
        {
            setLoading(false)
        }
    }

    useEffect(() =>
    {

        fetchUsernameFromStorage();
        handleFetchComments(0)
    }, []);

    const postComment = async () =>
    {
        Haptics.selectionAsync()

        dispatch(
            setComment(
                {
                    avatar: await SecureStore.getItem("__avatar"),
                    isPosting: true,
                    username: storedUsername,
                    commentDescription: input.trim(),
                    isPremiumUser: await SecureStore.getItem("__isPremiumUser"),
                    role: await SecureStore.getItem("__role"),
                    authorId: await SecureStore.getItem("__userId"),
                    commentId: null,
                }
            )
        )

        setInput(null)

        const timeoutId = setTimeout(async () =>
        {
            try
            {

                dispatch(
                    setComment(
                        {
                            avatar: await SecureStore.getItem("__avatar"),
                            isPosting: true,
                            username: storedUsername,
                            commentDescription: input.trim(),
                            isPremiumUser: await SecureStore.getItem("__isPremiumUser"),
                            role: await SecureStore.getItem("__role"),
                            authorId: await SecureStore.getItem("__userId"),
                            commentId: null,
                            posted: true
                        }
                    )
                )



            } catch (error)
            {
                // Handle potential errors during the simulated upload
                console.error('Error simulating upload:', error);

                // Reset posting state and potentially show an error message to the user
                dispatch(setPost({ ...postData, isPosting: false }));
                // ... (consider showing an error notification)
            }
        }, 5000); // Adjust the timeout as needed

        return () => clearTimeout(timeoutId);
    }

    const handleSheetChanges = useCallback((index) =>
    {
        console.log('handleSheetChanges', index);
    }, []);

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
            style={{ backgroundColor: COLORS.lightBlack }}
        >
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
                <Animated.View
                    //  {...panResponder.panHandlers}
                    style={[styles.modalContent, { flex: modalHeight.current, bottom: keyboardHeight === 0 ? 15 : 0 }]}>

                    <BottomSheet snapPoints={snapPoints} style={[styles.comments, { width: width }]}>

                        {
                            loading ? <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                                :
                                comments.length > 0 ?
                                    <BottomSheet
                                        ref={sheetRef}
                                        snapPoints={snapPoints}
                                        onChange={handleSheetChanges}
                                    >
                                        <BottomSheetView style={{ backgroundColor: "red" }}>
                                            <Text>Awesome 🔥</Text>
                                        </BottomSheetView>

                                        <FlatList
                                            data={comments}
                                            scrollEnabled={true}
                                            keyboardShouldPersistTaps="always"
                                            keyboardDismissMode="on-drag"
                                            keyExtractor={(item) => item.postId.toString()}
                                            renderItem={({ item, index }) =>
                                            (
                                                <View>
                                                    {
                                                        commentData?.isPosting ?
                                                            <CommentTab userId={commentData?.userId} opacity={1} comment={commentData?.commentDescription} username={commentData?.username} createdAt={commentData?.createdAt} avatar={commentData?.avatar} role={commentData?.role} isPremiumUser={commentData?.isPremiumUser} />
                                                            :
                                                            null
                                                    }
                                                    <CommentTab userId={item.userId} opacity={1} comment={item.comment} username={item.username} avatar={item.avatar} createdAt={item.createdAt} role={item.role} isPremiumUser={item.isPremiumUser} />
                                                </View>
                                            )}
                                            ListEmptyComponent={<Text style={{ fontFamily: FONT.regular, color: COLORS.tertiary, fontSize: SIZES.medium }}>No results found...</Text>}
                                        />
                                    </BottomSheet>
                                    : comments.length === 0 ? <EmptyComments /> : null
                        }



                    </BottomSheet>

                    <View style={[styles.inputContainer, { width: width, alignSelf: "center" }]}>

                        <TextInput
                            ref={textInputRef}
                            style={styles.textInput}
                            blurOnSubmit={false}
                            placeholder={`Commenting as ${storedUsername}...`}
                            placeholderTextColor={COLORS.whiteAccent}
                            onChangeText={newText => setInput(newText)}
                            defaultValue={input}
                            multiline={true}
                            textAlignVertical="center"
                        />
                        <TouchableOpacity disabled={input.length === 0 ? true : false} style={[styles.commentBtn, { opacity: input.length === 0 ? 0.5 : 1 }]} onPress={postComment}>
                            <Feather name="send" size={22} color={COLORS.tertiary} />
                        </TouchableOpacity>

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
        paddingTop: 30,
        alignItems: "center",
        borderTopLeftRadius: SIZES.large,
        borderTopRightRadius: SIZES.large,
        justifyContent: "flex-end",

    },
    textInput: {
        width: "80%",
        borderRadius: SIZES.large,
        backgroundColor: COLORS.lightBlack,
        paddingHorizontal: SIZES.small,
        paddingVertical: SIZES.large,
        alignSelf: "flex-start",
        justifyContent: "center",
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.fontBodySize - 1,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        paddingVertical: SIZES.medium,
        backgroundColor: "#1f1f1f",
        justifyContent: "center",

    },
    comments: {
        height: "100%",
        justifyContent: "flex-start",
        alignItems: "center",
        alignSelf: "flex-start"
    },
    locationText: {
        fontSize: SIZES.medium,
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        textAlign: "center"
    },
    commentBtn: {
        marginLeft: SIZES.xSmall,
        backgroundColor: COLORS.secondary,
        height: 44,
        width: 44,
        borderRadius: 27,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default CommentsModal;
