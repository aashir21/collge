import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import
{
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
    BottomSheetTextInput
} from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import * as SecureStore from "expo-secure-store"
import { SIZES, COLORS, FONT, ENDPOINT } from '../../constants/theme';
import { customFetch } from "../../utility/tokenInterceptor"
import CommentTab from "../Common-Tabs/CommentTab"
import EmptyComments from "../General Component/EmptyComments"
import { setComment } from "../../state/comment/commentSlice";
import * as Haptics from 'expo-haptics';

const AltCommentsModal = ({ handleShowCommentsModal, postId }) =>
{
    // ref
    const bottomSheetModalRef = useRef(null);

    // variables
    const snapPoints = useMemo(() => ['85%', "85%"], []);
    const [storedUsername, setStoredUsername] = useState("")

    const [loading, setLoading] = useState(false)
    const [comments, setComments] = useState([])
    const [input, setInput] = useState("")
    const { width } = useWindowDimensions()

    const textInputRef = useRef(null);
    const offset = useRef(0)

    const dispatch = useDispatch();

    const commentData = useSelector(state => state.comment);
    const tabData = useSelector(state => state.tab)

    const fetchUsernameFromStorage = async () =>
    {
        const storageUsername = await SecureStore.getItem("__username")
        setStoredUsername(storageUsername);
    }

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
                dispatch(setComment({ ...commentData, isPosting: false }));
                // ... (consider showing an error notification)
            }
        }, 5000); // Adjust the timeout as needed

        return () => clearTimeout(timeoutId);
    }

    const handleFetchComments = async (pageNum) =>
    {
        try
        {
            setLoading(true);

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/comment/getCommentsByPostId/${tabData.postId}/${pageNum}/15`, {
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

        fetchUsernameFromStorage()
        handleFetchComments(0)
        bottomSheetModalRef.current?.present();

    }, [])


    // renders
    return (
        <BottomSheetModalProvider>

            <Pressable style={styles.container} onPress={handleShowCommentsModal()
            }>

                <BottomSheetModal
                    handleStyle={{ backgroundColor: COLORS.textAccent, borderTopLeftRadius: SIZES.large, borderTopRightRadius: SIZES.large, marginBottom: SIZES.large, marginTop: SIZES.small }}
                    handleIndicatorStyle={{ backgroundColor: COLORS.tertiary, width: "20%" }}
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    enableOverDrag={true}
                    enableDynamicSizing={true}
                    backgroundStyle={{ backgroundColor: COLORS.textAccent, borderTopLeftRadius: SIZES.large, borderTopRightRadius: SIZES.large }}
                >
                    <BottomSheetView style={styles.contentContainer}>

                        {
                            loading ? <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                                :
                                comments.length > 0 ?

                                    <FlatList
                                        data={comments}
                                        scrollEnabled={true}
                                        keyboardShouldPersistTaps="always"
                                        keyboardDismissMode="on-drag"
                                        bounces={true}
                                        keyExtractor={(item) => item.postId.toString()}
                                        renderItem={({ item, index }) =>
                                        (
                                            <View>
                                                {
                                                    commentData.isPosting && tabData.postId === item.postId ?
                                                        <CommentTab opacity={commentData.posted === true ? 1 : 0.4} comment={commentData.commentDescription} username={commentData.username} createdAt={commentData.createdAt} avatar={commentData.avatar} role={commentData.role} isPremiumUser={commentData.isPremiumUser} />
                                                        :
                                                        null
                                                }
                                                <CommentTab opacity={1} createdAt={item.createdAt} comment={item.comment} username={item.username} avatar={item.avatar} role={item.role} isPremiumUser={item.isPremiumUser} />
                                            </View>
                                        )}
                                    />
                                    : comments.length === 0 ? <EmptyComments /> : null
                        }

                        <View style={[styles.inputContainer, { width: width, alignSelf: "center" }]}>
                            <BottomSheetTextInput
                                ref={textInputRef}
                                style={styles.textInput}
                                autoFocus={true}
                                blurOnSubmit={false}
                                placeholder={`Commenting as ${storedUsername}...`}
                                placeholderTextColor={COLORS.whiteAccent}
                                onChangeText={newText => setInput(newText)}
                                defaultValue={input}
                                multiline={true}
                                textAlignVertical="center"
                                keyboardAppearance="dark"
                            />

                            <TouchableOpacity onPress={postComment} style={[styles.commentBtn]}>
                                <Feather name="send" size={22} color={COLORS.tertiary} />
                            </TouchableOpacity>
                        </View>

                    </BottomSheetView>
                </BottomSheetModal>
            </Pressable>
        </BottomSheetModalProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "flex-end",
        backgroundColor: COLORS.textAccent
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
    commentBtn: {
        marginLeft: SIZES.xSmall,
        backgroundColor: COLORS.secondary,
        height: 44,
        width: 44,
        borderRadius: 27,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        paddingTop: SIZES.large,
        paddingBottom: SIZES.large + 12,
        backgroundColor: "#1f1f1f",
        justifyContent: "center",

    },
});

export default AltCommentsModal;