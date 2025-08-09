
import { StyleSheet, useWindowDimensions, TouchableOpacity, View, PanResponder, Animated, Dimensions, FlatList, ActivityIndicator, Keyboard, Text } from 'react-native';
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useState, useRef, useMemo, useEffect } from "react"
import { SIZES, COLORS, FONT, ENDPOINT } from "../../../../../constants/theme"
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
import ReplyTab from '../../../../../components/Common-Tabs/ReplyTab';

export default function ReplyScreen()
{

    const toast = useToast()
    const localParams = useLocalSearchParams();

    const [storedUsername, setStoredUsername] = useState("")
    const [loading, setLoading] = useState(false)
    const [replies, setReplies] = useState([])
    const [input, setInput] = useState(localParams.isReplying === "true" ? localParams.initialText : "")

    const [openMentionModal, setOpenMentionModal] = useState(false)
    const [initialUsers, setInitialUsers] = useState([])
    const [isReplying, setIsReplying] = useState({
        replying: false,
        username: "",
        parentCommentId: null
    })
    const [newReply, setNewReply] = useState({})
    const [isDisabled, setIsDisabled] = useState(true)

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
        handleFetchReplies(0)
        ])

    }, [])


    const handleMentionModalClose = () =>
    {
        setOpenMentionModal(false)
    }

    const handleMentionedUser = async (text) =>
    {

        const changedInput = input.replace(input.slice(atIndex.current + 1), text.username)
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

        const trimmedText = text.trim()
        setInput(text); // Update caption with the new text
        if (trimmedText)
        {
            setIsDisabled(false); // Enable if the trimmed text is not empty
        } else
        {
            setIsDisabled(true); // Disable if the trimmed text is empty
        }
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

    const postReply = async () =>
    {

        Haptics.selectionAsync()

        const newComment = {
            avatar: await SecureStore.getItem("__avatar"),
            username: storedUsername,
            comment: input.trim(),
            isPremiumUser: await SecureStore.getItem("__isPremiumUser"),
            role: await SecureStore.getItem("__role"),
            userId: await SecureStore.getItem("__userId"),
            postId: "-",
            commentId: null,
            opacity: 0.5,

        }


        replies.unshift(newComment)
        setReplies([...replies])

        try
        {

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/reply/addReplyToComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    commentId: localParams.commentId,
                    userId: await SecureStore.getItem("__userId"),
                    reply: input
                })
            })

            if (response.ok)
            {

                const responseReply = await response.json()

                replies.shift(newComment)
                setReplies([...replies])

                const newComment = {
                    avatar: await SecureStore.getItem("__avatar"),
                    username: storedUsername,
                    comment: input.trim(),
                    isPremiumUser: await SecureStore.getItem("__isPremiumUser"),
                    role: await SecureStore.getItem("__role"),
                    authorId: responseReply.userId,
                    postId: responseReply.postId,
                    commentId: responseReply.commentId,
                    opacity: 1,
                }

                replies.unshift(newComment)
                setReplies([...replies])

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

    const handleFetchReplies = async (pageNum) =>
    {

        try
        {
            setLoading(true);

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/reply/getRepliesByCommentId/${localParams.commentId}/${pageNum}/8`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok)
            {
                const data = await response.json();
                offset.current += 1;
                setReplies([...replies, ...data])
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
                    if (replies.length === 0 && Keyboard.isVisible()) // else go back
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
                    ...replies.length === 0 ? { ...panResponder.panHandlers } : null
                    }
                    style={styles.modalContent}>

                    <Text style={styles.repliesTitle}>Replies</Text>

                    {
                        (loading) ? <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                            :
                            replies.length > 0 ?

                                <View style={{ height: "100%", alignItems: "center", marginTop: SIZES.medium, backgroundColor: COLORS.textAccent }}>
                                    {
                                        !openMentionModal ?
                                            <FlatList
                                                data={replies}
                                                scrollEnabled={true}
                                                keyboardShouldPersistTaps="always"
                                                keyboardDismissMode="on-drag"
                                                bounces={true}
                                                keyExtractor={(item) => item.commentId}
                                                renderItem={({ item, index }) =>
                                                (
                                                    <Animated.View key={item.commentId}>
                                                        <ReplyTab handleResetReplyState={handleResetReplyState} postUserId={localParams.postUserId} commentHasReplies={false} repliesCount={item.repliesCount} newReply={item.commentId === isReplying.parentCommentId ? newReply : null} handleIsReplyingState={handleIsReplyingState} focusOnTextInput={focusOnTextInput} commentId={item.commentId} opacity={item.opacity || 1} userId={item.authorId} createdAt={item.createdAt} comment={item.comment} username={item.username} avatar={item.avatar} role={item.role} isPremiumUser={item.isPremiumUser} />
                                                    </Animated.View>
                                                )}
                                            /> : <CommentMention input={input} atIndex={atIndex.current} initialMentionUsers={initialUsers} onClose={handleMentionModalClose} handleSetMentionedUser={handleMentionedUser} />
                                    }
                                </View>

                                : replies.length === 0 ? <EmptyComments /> : null
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
                                autoFocus={false}
                                blurOnSubmit={false}
                                placeholder={`Replying as ${storedUsername}...`}
                                placeholderTextColor={COLORS.whiteAccent}
                                onChangeText={newText =>
                                {
                                    handleTextChange(newText)
                                }}
                                defaultValue={input}
                                scrollEnabled={true}
                                multiline={true}
                                textAlignVertical="center"
                                keyboardAppearance="dark"
                            />
                            <TouchableOpacity style={[styles.commentBtn,
                            { opacity: isDisabled ? 0.5 : 1 }
                            ]}
                                disabled={isDisabled}
                                onPress={postReply}
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

    repliesTitle: {
        textAlign: "center",
        fontSize: SIZES.large,
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        marginVertical: SIZES.small
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
