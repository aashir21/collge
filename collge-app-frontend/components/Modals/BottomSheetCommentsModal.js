import { useEffect, useRef, useState } from "react";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import
{
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    FlatList,
    Platform,
    KeyboardAvoidingView
} from "react-native";
import
{
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { COLORS, ENDPOINT, FONT, NOTIFICATION_TYPES, SIZES } from "../../constants/theme";
import { customFetch } from "../../utility/tokenInterceptor";
import CommentMetion from "../Common-Tabs/CommentMention";
import CommentTab from "../Common-Tabs/CommentTab";
import { Entypo, Feather } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import * as SecureStore from "expo-secure-store"
import { useToast } from "react-native-toast-notifications";
import { sendNotification } from "../../utility/notification";
import EmptyComments from "../General Component/EmptyComments"
import { useMemo } from "react";

export default function BottomSheetCommentsModal({ closeModal, postId, userId })
{
    const [isLoading, setIsLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false);
    const [comments, setComments] = useState([])
    const [input, setInput] = useState("")
    const offset = useRef(0);
    const [openMentionModal, setOpenMentionModal] = useState(false)
    const [isReplying, setIsReplying] = useState({
        replying: false,
        username: "",
        parentCommentId: null
    })
    const [isKeyboardOpened, setIsKeyBoardOpened] = useState(false)
    const [isFetching, setIsFetching] = useState(false);

    const bottomSheetModalRef = useRef(null);
    const textInputRef = useRef(null);
    const [isDisabled, setIsDisabled] = useState(true)
    const atIndex = useRef(-1)
    const [mentionedUsers, setMentionedUsers] = useState([])
    const [newReply, setNewReply] = useState({})
    const toast = useToast()

    const snapPoints = useMemo(() => ['75%', '90%'], []);

    const focusOnTextInput = () =>
    {
        if (textInputRef.current)
        {
            textInputRef.current?.focus(); // Focus on the input to open keyboard
            setIsKeyBoardOpened(!isKeyboardOpened)
        }
    };

    const handleIsReplyingState = (status, username, parentCommentId) =>
    {
        setIsReplying({
            ...isReplying,
            replying: status,
            username: username,
            parentCommentId: parentCommentId
        })

        focusOnTextInput()
        setInput(input + " " + "@" + username + " ")
    }

    const resetReplyState = () =>
    {
        setIsReplying({
            ...isReplying,
            replying: false,
            username: null,
            parentCommentId: null
        })

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

    const postComment = async () =>
    {
        console.log("Entered postComment()");
        Haptics.selectionAsync();

        const commentorUniId = await SecureStore.getItemAsync("__universityId");

        const placeholderComment = {
            avatar: await SecureStore.getItemAsync("__avatar"),
            username: await SecureStore.getItemAsync("__username"),
            comment: input.trim(),
            isPremiumUser: await SecureStore.getItemAsync("__isPremiumUser"),
            role: await SecureStore.getItemAsync("__role"),
            authorId: await SecureStore.getItemAsync("__userId"),
            postId: "-", // Temporary value
            commentId: null, // Placeholder identifier
            opacity: 0.5,
        };

        // Add placeholder comment
        setComments((prevComments) => [placeholderComment, ...prevComments]);

        try
        {
            // Define endpoint
            const endpoint = isReplying?.replying
                ? `${ENDPOINT.BASE_URL}/api/v1/reply/addReplyToComment`
                : `${ENDPOINT.BASE_URL}/api/v1/comment/addCommentToPost`;

            // Define request body
            const requestBody = isReplying?.replying
                ? {
                    commentId: isReplying?.parentCommentId,
                    postId: postId,
                    userId: await SecureStore.getItemAsync("__userId"),
                    reply: input.trim(),
                }
                : {
                    postId: postId,
                    userId: await SecureStore.getItemAsync("__userId"),
                    comment: placeholderComment.comment,
                };

            // API Call
            const response = await customFetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (response.ok)
            {
                const responseComment = await response.json();

                const actualComment = {
                    avatar: await SecureStore.getItemAsync("__avatar"),
                    username: await SecureStore.getItemAsync("__username"),
                    comment: responseComment.comment,
                    isPremiumUser: await SecureStore.getItemAsync("__isPremiumUser"),
                    role: await SecureStore.getItemAsync("__role"),
                    authorId: responseComment.userId,
                    postId: responseComment.postId,
                    commentId: responseComment.commentId,
                    parentCommentId: responseComment?.parentCommentId,
                    opacity: 1, // Fully visible
                };

                // Replace placeholder with actual comment
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment.commentId === null ? actualComment : comment
                    )
                );

                // Handle notifications
                const actorId = actualComment.authorId;
                if (mentionedUsers.length > 0)
                {
                    sendNotification(
                        actorId,
                        mentionedUsers,
                        new Array(commentorUniId),
                        postId,
                        responseComment.commentId,
                        actualComment.comment,
                        NOTIFICATION_TYPES.COMMENT_MENTION
                    );
                    setMentionedUsers([]);
                }
                if (actorId !== userId)
                {
                    const notificationType = isReplying.replying === true
                        ? NOTIFICATION_TYPES.NEW_REPLY
                        : NOTIFICATION_TYPES.NEW_COMMENT;
                    sendNotification(
                        actorId,
                        [userId],
                        [commentorUniId],
                        postId,
                        responseComment.commentId,
                        actualComment.comment,
                        notificationType
                    );
                }
            }

            // Reset input and reply state
            setInput(null);
            resetReplyState();
        } catch (error)
        {
            console.error("Error posting comment:", error);
            setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== null)); // Remove placeholder
            toast.show("Something went wrong", {
                type: "error",
                placement: "top",
                duration: 3000,
                offsetTop: 100,
                animationType: "slide-in",
            });
        }
    };



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

    function handlePresentModal()
    {
        bottomSheetModalRef.current?.present();
        setTimeout(() =>
        {
            setIsOpen(true);
        }, 100);
    }

    const fecthReplies = async (pageNum) =>
    {

        const currentUserId = SecureStore.getItem("__userId");

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v2/reply/getRepliesByPostId/${currentUserId}/${postId}/${pageNum}/7`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok)
            {
                const data = await response.json();

                return data;
            }


        } catch (error)
        {
            toast.show("Something went wrong", {
                type: "error",
                placement: "top",
                duration: 3000,
                animationType: "slide-in",
            })
        }

    }

    const handleFetchComments = async (pageNum) =>
    {

        if (isFetching)
        {
            return;
        }

        setIsFetching(true)
        const currentUserId = SecureStore.getItem("__userId");

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v2/comment/getCommentsByPostId/${currentUserId}/${postId}/${pageNum}/7`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200)
            {
                const replies = await fecthReplies(pageNum)
                const data = await response.json();
                offset.current = offset.current + 1
                setComments([...comments, ...replies, ...data])

            }

        } catch (error)
        {
            toast.show("Something went wrong", {
                placement: "top",
                duration: 3000,
                type: "normal"
            })
        }
        finally
        {
            setIsLoading(false)
            setIsFetching(false)
        }
    }



    // Automatically present the modal when the component mounts
    useEffect(() =>
    {

        Promise.all([
            handleFetchComments(0),
            handlePresentModal()
        ])

    }, []);

    return (
        <BottomSheetModalProvider>
            <View
                style={[
                    styles.container
                ]}
                behavior={Platform.OS === "android" && "height"}
            >
                <StatusBar style="auto" />
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    detached={false}
                    style={{ flex: 1 }}
                    enableDynamicSizing={false}
                    // android_keyboardInputMode="adjustResize"
                    keyboardBehavior={Platform.OS === "android" ? "fillParent" : "extend"}
                    enablePanDownToClose={true}
                    // animationConfigs={animationConfigs}
                    backgroundStyle={{ borderRadius: 28, backgroundColor: COLORS.textAccent }}
                    onDismiss={() =>
                    {
                        setIsOpen(false);
                        closeModal();
                    }}
                    handleStyle={{ backgroundColor: COLORS.textAccent, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
                    handleIndicatorStyle={{ backgroundColor: COLORS.tertiary, marginTop: 8, width: "20%" }}
                >
                    <View style={styles.contentContainer}>

                        {
                            isLoading &&
                            <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: COLORS.textAccent }}>
                                <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                            </View>
                        }

                        {
                            !openMentionModal ?
                                <FlatList
                                    data={comments}
                                    scrollEnabled={true}
                                    keyboardShouldPersistTaps="always"
                                    bounces={true}
                                    ListEmptyComponent={
                                        <View style={{ marginVertical: SIZES.xxLarge + 50 }}>
                                            {
                                                !isLoading && <EmptyComments />
                                            }
                                        </View>
                                    }
                                    keyExtractor={(item) => item.commentId}
                                    renderItem={({ item, index }) =>
                                    (
                                        <CommentTab parentCommentId={item?.parentCommentId} focusOnTextInput={focusOnTextInput} postUserId={userId} handleResetReplyState={null} commentHasReplies={item.repliesCount === 0 ? false : true} repliesCount={item.repliesCount} opacity={item?.opacity || 1} newReply={item.commentId === isReplying?.parentCommentId ? newReply : null} handleIsReplyingState={handleIsReplyingState} commentId={item.commentId} userId={item.authorId} createdAt={item.createdAt} comment={item.comment} username={item.username} avatar={item.avatar} role={item.role} isPremiumUser={item.isPremiumUser} />
                                    )}
                                    onEndReachedThreshold={0.5}
                                    onEndReached={() => handleFetchComments(offset.current)}
                                />
                                :
                                <CommentMetion input={input} atIndex={atIndex.current} onClose={handleMentionModalClose} handleSetMentionedUser={handleMentionedUser} />
                        }

                        {
                            isReplying.replying == true &&
                            <TouchableOpacity onPress={resetReplyState} style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                                <Entypo name="cross" size={16} color={COLORS.secondary} />
                                <Text style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.small }}>Replying to {isReplying.username}'s comment</Text>
                            </TouchableOpacity>
                        }
                        <View style={styles.textInputContainer}>

                            <BottomSheetTextInput
                                style={[styles.input]}
                                disableFullscreenUI={true}
                                textAlignVertical="top"
                                textBreakStrategy="highQuality"
                                scrollEnabled={true}
                                multiline={true}
                                ref={textInputRef}
                                placeholderTextColor={COLORS.whiteAccent}
                                editable={true}
                                onChangeText={newText =>
                                {
                                    handleTextChange(newText)
                                }}
                                placeholder="Comment..."
                                defaultValue={input}
                            />
                            <TouchableOpacity style={[styles.commentBtn,
                            { opacity: isDisabled ? 0.5 : 1 }
                            ]}
                                disabled={isDisabled ? true : false}
                                onPress={postComment}
                            >
                                <Feather name="send" size={22} color={COLORS.tertiary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.textAccent,
        alignItems: "center",
        justifyContent: "center",
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 15,
    },
    input: {
        marginTop: 8,
        borderRadius: 16,
        fontSize: SIZES.fontBodySize,
        paddingHorizontal: 8,
        paddingVertical: 20,
        backgroundColor: COLORS.lightBlack,
        width: "85%",
        color: COLORS.tertiary,
    },
    textInputContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
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
});
