
import { StyleSheet, useWindowDimensions, TouchableOpacity, View, PanResponder, Animated, Dimensions, FlatList, ActivityIndicator, Keyboard, Text } from 'react-native';
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useState, useRef, useMemo, useEffect } from "react"
import { SIZES, COLORS, FONT, ENDPOINT, NOTIFICATION_TYPES } from "../../../../../constants/theme"
import { Entypo, Feather } from '@expo/vector-icons';
// import { View } from "../../../../components/Themed"
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from "expo-secure-store"
import * as Haptics from 'expo-haptics';
import CommentTab from "../../../../../components/Common-Tabs/CommentTab"
import EmptyComments from "../../../../../components/General Component/EmptyComments"
import { customFetch } from "../../../../../utility/tokenInterceptor"
import { useToast } from "react-native-toast-notifications";
import CommentMention from "../../../../../components/Common-Tabs/CommentMention"
import { sendNotification } from '../../../../../utility/notification';

export default function ModalScreen()
{

    const toast = useToast()
    const localParams = useLocalSearchParams();

    const [storedUsername, setStoredUsername] = useState("")
    const [loading, setLoading] = useState(false)
    const [comments, setComments] = useState([])
    const [input, setInput] = useState("")

    const [openMentionModal, setOpenMentionModal] = useState(false)
    const [mentionedUsers, setMentionedUsers] = useState([])

    const [initialUsers, setInitialUsers] = useState([])
    const [isReplying, setIsReplying] = useState({
        replying: false,
        username: "",
        parentCommentId: null
    })
    const [newReply, setNewReply] = useState({})

    const { width } = useWindowDimensions()
    const windowHeight = Dimensions.get('window').height;

    const sheetRef = useRef(null);
    const textInputRef = useRef(null);
    const translateY = useRef(new Animated.Value(0)).current;
    const offset = useRef(0)
    const atIndex = useRef(-1)

    const snapPoints = useMemo(() => ["100%", "100%"], []);

    const handleResetReplyState = () =>
    {
        setNewReply(null);
    }

    useEffect(() =>
    {

        Promise.all([fetchUsernameFromStorage(), handleGetInitialUsers(),
        handleFetchComments(0)
        ])

    }, [])


    const handleMentionModalClose = () =>
    {
        setOpenMentionModal(false)
    }

    const handleMentionedUser = async (mentionData) =>
    {
        const currentInput = input

        if (!mentionedUsers.includes(mentionData.userId))
        {
            setMentionedUsers([...mentionedUsers, mentionData.userId.toString()])
        }

        const changedInput = currentInput.replace(input.slice(atIndex.current + 1), mentionData.username)

        setInput(changedInput)
    }

    const handleTextChange = (text) =>
    {
        if (text[text?.length - 1] === "@")
        {
            setOpenMentionModal(true)
            atIndex.current = text.length - 1
        }

        if (text.length <= atIndex.current)
        {
            setOpenMentionModal(false)
        }

        if (text[text?.length - 1] === " " && openMentionModal === true)
        {
            setOpenMentionModal(false)
        }

        setInput(text); // Update caption with the new text
    };

    const handleGetInitialUsers = async () =>
    {

        const currentUserId = SecureStore.getItem("__userId");

        try
        {

            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v2/search/getUsers?query=a&offset=0&pageSize=5&userId=${currentUserId}`);
            const data = await response.json();

            setInitialUsers(data)


        } catch (error)
        {
            console.error('Error fetching data:', error);
            setInitialUsers([]);
        }

    }

    const postComment = async () =>
    {

        Haptics.selectionAsync()

        const newComment = {
            avatar: await SecureStore.getItemAsync("__avatar"),
            username: storedUsername,
            comment: input.trim(),
            isPremiumUser: await SecureStore.getItemAsync("__isPremiumUser"),
            role: await SecureStore.getItemAsync("__role"),
            userId: await SecureStore.getItemAsync("__userId"),
            postId: "-",
            commentId: null,
            opacity: 0.5,

        }


        comments.unshift(newComment)
        setComments([...comments])

        try
        {

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/comment/addCommentToPost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postId: localParams.postId,
                    userId: await SecureStore.getItemAsync("__userId"),
                    comment: newComment.comment
                })
            })

            if (response.ok)
            {

                const responseComment = await response.json()

                comments.shift(newComment)
                setComments([...comments])

                const newComment = {
                    avatar: await SecureStore.getItemAsync("__avatar"),
                    username: storedUsername,
                    comment: responseComment.comment,
                    isPremiumUser: await SecureStore.getItemAsync("__isPremiumUser"),
                    role: await SecureStore.getItemAsync("__role"),
                    authorId: await SecureStore.getItemAsync("__userId"),
                    postId: responseComment.postId,
                    commentId: responseComment.commentId,
                    opacity: 1,
                }

                comments.unshift(newComment)
                setComments([...comments])

                // User were mentioned in a comment
                const actorId = parseInt(newComment.authorId);

                if (mentionedUsers.length > 0)
                {
                    sendNotification(actorId, mentionedUsers, new Array(1), localParams.postId, responseComment.commentId, newComment.comment, NOTIFICATION_TYPES.COMMENT_MENTION);
                    setMentionedUsers([])

                }

                sendNotification(actorId, new Array(localParams.postUserId), new Array(1), localParams.postId, responseComment.commentId, newComment.comment, NOTIFICATION_TYPES.NEW_COMMENT);

            }

            setInput(null)

        } catch (error)
        {

            toast.show("Something went wrong", {
                type: "error",
                placement: "top",
                duration: 3000,
                offsetTop: 100,
                animationType: "slide-in",
            });
        }

    }


    const handleFetchComments = async (pageNum) =>
    {
        try
        {
            setLoading(true);

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/comment/getCommentsByPostId/${localParams.postId}/${pageNum}/15`, {
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

    const fetchUsernameFromStorage = async () =>
    {

        const storageUsername = await SecureStore.getItem("__username")

        setStoredUsername(storageUsername);
    }

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
                if (gestureState.dy > windowHeight / 2 || gestureState.vy > 1)
                {
                    if (comments.length === 0 && Keyboard.isVisible()) // else go back
                    {
                        Keyboard.dismiss()
                        router.back()
                    }
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

    const focusOnTextInput = () =>
    {
        textInputRef.current.focus(); // Focus on the input to open keyboard

    };

    const handleIsReplyingState = (status, username, parentCommentId) =>
    {
        setIsReplying({
            ...isReplying,
            replying: status,
            username: username,
            parentCommentId: parentCommentId
        })
    }

    return (
        <View style={styles.container} >

            <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                keyboardBehavior="extend"
                handleIndicatorStyle={{ backgroundColor: COLORS.tertiary, width: "20%", marginTop: SIZES.medium }}
                handleStyle={{ backgroundColor: COLORS.textAccent }}
                index={0}
            >

                <Animated.View
                    {
                    ...comments.length === 0 ? { ...panResponder.panHandlers } : null
                    }
                    style={styles.modalContent}>

                    {
                        (loading) ? <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                            :
                            comments.length > 0 ?

                                <View style={{ height: "100%", alignItems: "center", marginTop: SIZES.medium, backgroundColor: COLORS.textAccent }}>
                                    {
                                        !openMentionModal ?
                                            <FlatList
                                                data={comments}
                                                scrollEnabled={true}
                                                keyboardShouldPersistTaps="always"
                                                keyboardDismissMode="on-drag"
                                                bounces={true}
                                                keyExtractor={(item) => item.commentId}
                                                renderItem={({ item, index }) =>
                                                (
                                                    <Animated.View key={item.commentId}
                                                    // {...panResponder.panHandlers}
                                                    >
                                                        <CommentTab postUserId={localParams.postUserId} handleResetReplyState={handleResetReplyState} commentHasReplies={item.repliesCount === 0 ? false : true} repliesCount={item.repliesCount} newReply={item.commentId === isReplying.parentCommentId ? newReply : null} handleIsReplyingState={handleIsReplyingState} focusOnTextInput={focusOnTextInput} commentId={item.commentId} opacity={item.opacity || 1} userId={item.authorId} createdAt={item.createdAt} comment={item.comment} username={item.username} avatar={item.avatar} role={item.role} isPremiumUser={item.isPremiumUser} />
                                                    </Animated.View>
                                                )}
                                            /> : <CommentMention input={input} atIndex={atIndex.current} initialMentionUsers={initialUsers} onClose={handleMentionModalClose} handleSetMentionedUser={handleMentionedUser} />
                                    }
                                </View>

                                : comments.length === 0 ? <EmptyComments /> : null
                    }

                    <View style={[styles.inputContainer, { width: width, alignSelf: "center" }]}>

                        {
                            isReplying.replying &&
                            <View style={[styles.replyingContainer]}>
                                <Text style={{ fontFamily: FONT.regular, color: COLORS.secondary, fontSize: SIZES.fontBodySize - 2, textAlign: "center" }}>Replying to {isReplying.username}'s comment...</Text>
                                <TouchableOpacity onPress={() =>
                                {
                                    handleIsReplyingState(false, isReplying.username, null)
                                }} style={{ marginLeft: SIZES.large }}>
                                    <Entypo name="cross" size={20} color={COLORS.whiteAccent} />
                                </TouchableOpacity>
                            </View>
                        }

                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <BottomSheetTextInput
                                ref={textInputRef}
                                style={styles.textInput}
                                autoFocus={true}
                                blurOnSubmit={false}
                                scrollEnabled={true}
                                placeholder={`Commenting as ${storedUsername}...`}
                                placeholderTextColor={COLORS.whiteAccent}
                                onChangeText={newText =>
                                {
                                    handleTextChange(newText)
                                }}
                                defaultValue={isReplying.username || input}
                                multiline={true}
                                textAlignVertical="center"
                                keyboardAppearance="dark"
                            />
                            <TouchableOpacity style={[styles.commentBtn,
                            { opacity: (input?.length || isReplying.username.length) === 0 ? 0.5 : 1 }
                            ]}
                                disabled={(input?.length || isReplying.username.length) === 0 ? true : false}
                                onPress={postComment}
                            >
                                <Feather name="send" size={22} color={COLORS.tertiary} />
                            </TouchableOpacity>
                        </View>

                    </View>
                </Animated.View>

            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.textAccent
    },
    inputContainer: {
        flexDirection: "column",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        paddingTop: SIZES.large,
        paddingBottom: SIZES.large + 12,
        backgroundColor: "#1f1f1f",
        justifyContent: "center",

    },
    textInput: {
        width: "80%",
        minHeight: 56,
        maxHeight: 98,
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
    modalContent: {
        backgroundColor: COLORS.textAccent,
        height: "100%",
    },
    replyingContainer: {
        marginBottom: SIZES.medium,
        width: "90%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
});
