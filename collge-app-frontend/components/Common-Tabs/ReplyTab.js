import { StyleSheet, Text, View, Image, useWindowDimensions, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONT, SIZES, ENDPOINT, REPORT_REQUEST_TYPES } from '../../constants/theme'
import useTimeSince from '../../hooks/useTimeSince'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics';
import { useSegments } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons';
import { customFetch } from '../../utility/tokenInterceptor'
import CaptionBox from "../../components/General Component/CaptionBox"
import * as SecureStore from "expo-secure-store"
import { useToast } from 'react-native-toast-notifications'
import { navigateToReportPage } from '../../utility/navigation'

const ReplyTab = ({ avatar, username, createdAt, comment, opacity, role, isPremiumUser, userId, commentId, focusOnTextInput, handleIsReplyingState, parentCommentId, postUserId }) =>
{

    const { width } = useWindowDimensions()
    const timeAgo = useTimeSince(createdAt)
    const segments = useSegments()

    const [storedUserId, setStoredUserId] = useState(null)
    const [isCommentOptionModalOpen, setIsCommentOptionModalOpen] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const toast = useToast()

    useEffect(() =>
    {
        fetchUsernameFromStorage()
    })

    const handleDeleteComment = async () =>
    {
        try
        {

            setDeleting(true)

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/reply/deleteReplyById?replyId=${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

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

    const fetchUsernameFromStorage = async () =>
    {
        const storageUserId = await SecureStore.getItem("__userId")

        setStoredUserId(storageUserId);
    }


    const handleNavigateToCommentorProfile = () =>
    {
        router.push({
            pathname: `/${segments[0]}/${segments[1]}/comments/comment/user`,
            params: {
                id: userId
            }
        })
    }

    const handleKeyboardFocusAndReplyingState = (status, username) =>
    {
        handleIsReplyingState(status, "@" + username + " ", parentCommentId)
        focusOnTextInput()
    }

    const handleOpenCommentOptionModal = () =>
    {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        setIsCommentOptionModalOpen(!isCommentOptionModalOpen)

    }


    return (
        <View>
            {
                !isDeleted ?
                    <Pressable onPress={handleOpenCommentOptionModal} style={[styles.container, { opacity: opacity, backgroundColor: COLORS.textAccent }]}>

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
                                <CaptionBox type={"comment"} propStyle={{ fontSize: SIZES.fontBodySize - 2, marginTop: 2 }} caption={comment} />

                                <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "center", width: "100%" }}>
                                    <View style={{ flexDirection: "row" }}>
                                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => handleKeyboardFocusAndReplyingState(true, username, commentId)}>
                                            <Text style={[styles.replyBtn, { fontSize: SIZES.fontBodySize - 3 }]}>Reply</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {
                                    isCommentOptionModalOpen && <Pressable >
                                        {
                                            !deleting ?
                                                <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginVertical: 4 }}>

                                                    {
                                                        (userId == storedUserId || postUserId == storedUserId) &&
                                                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginHorizontal: 4 }} onPress={handleDeleteComment}>
                                                            <MaterialIcons name="delete-outline" size={16} color={COLORS.error} />
                                                            <Text style={{ color: COLORS.error, fontFamily: FONT.regular, fontSize: SIZES.xSmall, marginLeft: 2 }}>Delete comment</Text>
                                                        </TouchableOpacity>
                                                    }

                                                    {
                                                        (userId == storedUserId || postUserId == storedUserId) ? null :

                                                            <TouchableOpacity onPress={() => navigateToReportPage({ reportCommentId: commentId, reportType: REPORT_REQUEST_TYPES.REPLY, reportUserId: userId })} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginHorizontal: 4 }}>
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

                            </View>
                        </View>
                    </Pressable >
                    : null
            }
        </View>
    )
}

export default ReplyTab

const styles = StyleSheet.create({

    container: {
        backgroundColor: COLORS.textAccent,
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
        fontSize: SIZES.small,
    },
    comment: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.small,
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

    },
    verified: {
        height: 10,
        width: 10,
        objectFit: "contain",
        marginLeft: 4
    },

    replyBtn: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.fontBodySize - 2,
        marginTop: 4
    }

})