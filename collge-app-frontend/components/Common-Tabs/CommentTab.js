import { StyleSheet, Text, View, Image, useWindowDimensions, TouchableOpacity, Pressable, FlatList, ActivityIndicator, Keyboard } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { COLORS, FONT, SIZES, ENDPOINT, REPORT_REQUEST_TYPES } from '../../constants/theme'
import CaptionBox from "../../components/General Component/CaptionBox"
import useTimeSince from '../../hooks/useTimeSince'
import { router } from 'expo-router'
import { useSegments } from 'expo-router'
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useToast } from 'react-native-toast-notifications'
import { customFetch } from '../../utility/tokenInterceptor'
import * as SecureStore from "expo-secure-store"
import ReplyTab from "../Common-Tabs/ReplyTab"
import { navigateToReportPage } from "../../utility/navigation"

const CommentTab = ({ avatar, username, createdAt, comment, opacity, role, isPremiumUser, userId, commentId, postUserId, newReply, repliesCount, focusOnTextInput, handleIsReplyingState, parentCommentId }) =>
{

    const [replies, setReplies] = useState([])
    const [storedUserId, setStoredUserId] = useState(null)
    const [isViewBtnVisible, setIsViewBtnVisible] = useState(true)
    const [isCommentOptionModalOpen, setIsCommentOptionModalOpen] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [loading, setLoading] = useState(false)

    const { width } = useWindowDimensions()
    const timeAgo = useTimeSince(createdAt)
    const segments = useSegments()

    const toast = useToast()

    const offset = useRef(0)
    const numberOfReplies = useRef(replies)

    const [isReplying, setIsReplying] = useState({
        replying: false,
        username: "",
        parentCommentId: null
    })

    const textInputRef = useRef(null);

    const emptyRepliesArray = () =>
    {
        setReplies([])
        setIsViewBtnVisible(true)
    }

    const handleNavigateToCommentorProfile = () =>
    {
        router.push({
            pathname: `/${segments[0]}/${segments[1]}/user/[id]`,
            params: {
                id: userId
            }
        })
    }

    const handleDeleteComment = async () =>
    {
        try
        {

            setDeleting(true)
            let response;
            if (parentCommentId)
            {
                response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/reply/deleteReplyById?replyId=${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
            }
            else
            {
                response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/comment/deleteCommentById?commentId=${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
            }

            if (response.status === 204)
            {

                toast.show("Deleted", {
                    type: "normal",
                    placement: "top",
                    duration: 3000,
                    offsetTop: 100,
                    animationType: "slide-in",
                });

                setIsDeleted(true)
            }


        } catch (e)
        {
            console.log(e);

        }
        finally
        {
            setDeleting(false)
        }

    }

    const handleOpenCommentOptionModal = () =>
    {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        setIsCommentOptionModalOpen(!isCommentOptionModalOpen)

    }

    const fetchUsernameFromStorage = async () =>
    {
        const storageUserId = await SecureStore.getItem("__userId")

        setStoredUserId(storageUserId);
    }

    const fecthReplies = async (pageNum) =>
    {

        setLoading(true)

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/reply/getRepliesByCommentId/${commentId}/${pageNum}/8`, {
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
                setIsViewBtnVisible(false)

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

    }, [])

    useEffect(() =>
    {

        if (newReply === null)
        {
            return;
        }
        else
        {
            if (newReply?.isPosting === true)
            {
                if (newReply.posted === false)
                {
                    numberOfReplies.current = numberOfReplies.current + 1
                    replies.push(newReply)
                }
                else
                {
                    replies[replies.length - 1] = newReply
                }
            }
        }

    }, [newReply])

    return (
        <View>
            {
                !isDeleted ? <Pressable
                    onPress={handleOpenCommentOptionModal}
                    style={[styles.container, { width: width - 32, opacity: opacity }]}>

                    <Pressable onPress={handleNavigateToCommentorProfile}>
                        <Image style={styles.profilePic} source={{ uri: avatar }} />
                    </Pressable>

                    <View style={styles.commentPayload}>
                        <View style={styles.createdAt}>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Pressable onPress={handleNavigateToCommentorProfile}>
                                    <Text style={styles.username}>{username}</Text>
                                </Pressable>
                                {
                                    isPremiumUser == "true" ? <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image> : null
                                }
                                {
                                    (role === "ADMIN" || role === "MANAGER") ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
                                }

                            </View>
                            <Text style={styles.time}>{timeAgo}</Text>
                        </View>
                        <View style={{ width: "100%" }}>

                            <CaptionBox type={"comment"} propStyle={{ fontSize: SIZES.fontBodySize - 2, marginBottom: 4 }} caption={comment} />

                            <View style={{ flexDirection: "row", width: "100%" }}>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => handleIsReplyingState(true, username, commentId)}>
                                        <Text style={[styles.replyBtn, { fontSize: SIZES.fontBodySize - 3 }]}>Reply</Text>
                                    </TouchableOpacity>
                                </View>
                                {/* {
                                    repliesCount > 0 && isViewBtnVisible === true &&
                                    <TouchableOpacity style={{ marginLeft: 8, flexDirection: "row", alignItems: "center" }} onPress={() => fecthReplies(0)}>
                                        <Text style={styles.replyBtn}>View {repliesCount} replies</Text>
                                    </TouchableOpacity>
                                } */}
                            </View>

                            {
                                replies.length > 0 &&
                                <FlatList
                                    style={{ marginVertical: 8 }}
                                    data={replies}
                                    scrollEnabled={true}
                                    keyboardShouldPersistTaps="always"
                                    keyboardDismissMode="on-drag"
                                    bounces={true}
                                    keyExtractor={(item) => item.commentId}
                                    renderItem={({ item, index }) =>
                                    (
                                        <View key={item.commentId}>
                                            <ReplyTab focusOnTextInput={focusOnTextInput} postUserId={postUserId} commentHasReplies={false} repliesCount={item.repliesCount} newReply={item.commentId === isReplying.parentCommentId ? newReply : null} handleIsReplyingState={handleIsReplyingState} commentId={item.commentId} opacity={item.opacity || 1} userId={item.authorId} createdAt={item.createdAt} comment={item.comment} username={item.username} avatar={item.avatar} role={item.role} isPremiumUser={item.isPremiumUser} />
                                        </View>
                                    )}
                                />
                            }

                            {
                                isCommentOptionModalOpen && <Pressable >
                                    {
                                        !deleting ?
                                            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>

                                                {
                                                    (userId == storedUserId || postUserId == storedUserId) &&
                                                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginHorizontal: 4 }} onPress={handleDeleteComment}>
                                                        <MaterialIcons name="delete-outline" size={16} color={COLORS.error} />
                                                        <Text style={{ color: COLORS.error, fontFamily: FONT.regular, fontSize: SIZES.xSmall, marginLeft: 2 }}>Delete comment</Text>
                                                    </TouchableOpacity>
                                                }

                                                {
                                                    (userId == storedUserId || postUserId == storedUserId) ? null :

                                                        <TouchableOpacity onPress={() => navigateToReportPage({ reportCommentId: commentId, reportType: REPORT_REQUEST_TYPES.COMMENT, reportUserId: userId })} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginHorizontal: 4 }}>
                                                            <MaterialIcons name="report" size={16} color={COLORS.error} />
                                                            <Text style={{ color: COLORS.error, fontFamily: FONT.regular, fontSize: SIZES.xSmall, marginLeft: 2 }}>Report</Text>
                                                        </TouchableOpacity>
                                                }


                                            </View> :
                                            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginVertical: 4 }}>
                                                <Text style={{ color: COLORS.error, fontFamily: FONT.regular, fontSize: SIZES.xSmall }}>Deleting...</Text>
                                            </View>
                                    }
                                </Pressable>
                            }

                            {
                                repliesCount > 0 && isViewBtnVisible === false &&
                                <TouchableOpacity style={{ marginLeft: 8, flexDirection: "row", alignItems: "center" }} onPress={emptyRepliesArray}>
                                    <Text style={styles.replyBtn}>Hide replies</Text>
                                </TouchableOpacity>
                            }

                        </View>
                    </View>


                </Pressable > : null
            }
        </View>
    )
}

// onPress={(userId == storedUserId || postUserId == storedUserId) ? handleOpenCommentOptionModal : null} 
export default CommentTab

const styles = StyleSheet.create({

    container: {
        backgroundColor: COLORS.lightBlack,
        borderRadius: SIZES.large,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "row",
        paddingHorizontal: SIZES.small,
        paddingVertical: SIZES.medium,
        marginBottom: SIZES.xSmall
    },
    profilePic: {
        height: 44,
        width: 44,
        borderRadius: 22,
    },
    commentPayload: {
        paddingLeft: SIZES.small,
        flex: 1
    },
    username: {
        fontFamily: FONT.regular,
        color: COLORS.secondary,
        fontSize: SIZES.fontBodySize,
    },
    comment: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.fontBodySize - 2,
    },
    createdAt: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    time: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.fontBodySize - 2,
        marginRight: 8
    },
    verified: {
        height: 12,
        width: 12,
        objectFit: "contain",
        marginLeft: 4
    },

    replyBtn: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.fontBodySize - 3,
        paddingTop: 2
    }

})