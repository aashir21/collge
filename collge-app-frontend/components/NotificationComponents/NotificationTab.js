// @Authored by : Muhammad Aashir Siddiqui

import { StyleSheet, Text, useWindowDimensions, View, Image, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONT, NOTIFICATION_TYPES, SIZES, ENDPOINT } from '../../constants/theme'
import useTimeSince from '../../hooks/useTimeSince'
import { router } from 'expo-router'
import { debounce } from "lodash"
import AntDesign from '@expo/vector-icons/AntDesign';
import { customFetch } from '../../utility/tokenInterceptor'
import { useToast } from 'react-native-toast-notifications'
import { sendNotification } from '../../utility/notification'


const NotificationTab = ({ universityId, actorId, userId, createdAt, message, notificationType, username, avatar, role, isPremiumUser, postId, commentId }) =>
{
    const { width } = useWindowDimensions()
    const [placeholder, setPlaceholder] = useState("")
    const [friendRequestResponse, setFriendRequestResponse] = useState()
    const [linkupRequestResponse, setLinkupRequestResponse] = useState()

    const toast = useToast()

    const timeSince = useTimeSince(createdAt)

    useEffect(() =>
    {
        let placeholder;

        switch (notificationType)
        {
            case NOTIFICATION_TYPES.COMMENT_MENTION: // Needed function
                placeholder = " mentioned you in a comment: ";
                break;
            case NOTIFICATION_TYPES.NEW_COMMENT: // Needed function
                placeholder = " commented on your post: ";
                break;
            case NOTIFICATION_TYPES.NEW_REPLY: // Needed function
                placeholder = " replied to your comment: ";
                break;
            case NOTIFICATION_TYPES.TAGGED: // Needed function
                placeholder = " tagged you in a post.";
                break;
            case NOTIFICATION_TYPES.PROFILE_VISIT:
                placeholder = " visited your profile.";
                break;
            case NOTIFICATION_TYPES.WINK:
                placeholder = " winked at you.";
                break;
            case NOTIFICATION_TYPES.FRIEND_REQUEST: // Needed function
                placeholder = " sent you a friend request.";
                break;
            case NOTIFICATION_TYPES.ACCEPTED_FRIEND_REQUEST:
                placeholder = " accepted your friend request.";
                break;
            case NOTIFICATION_TYPES.LINKUP_INTEREST:
                placeholder = " wants to Link Up with you.";
                break;
            case NOTIFICATION_TYPES.LINKUP_ACCEPTED:
                placeholder = " accepted your Link Up request.";
                break;
            case NOTIFICATION_TYPES.UPVOTE:
                placeholder = " up voted your post.";
                break;
            case NOTIFICATION_TYPES.DOWNVOTE:
                placeholder = " down voted your post.";
                break;
            case NOTIFICATION_TYPES.COMMENT_MENTION:
                placeholder = " mentioned you in a comment: ";
                break;
            case NOTIFICATION_TYPES.LINKUP_COLLAB_REQUEST:
                placeholder = " wants to collaborate on a LinkUp with you!";
                break;
            case NOTIFICATION_TYPES.LINKUP_COLLAB_REQ_ACCEPTED:
                placeholder = " accepted your LinkUp collaboration request.";
                break;
            case NOTIFICATION_TYPES.LINKUP_COLLAB_REQ_REJECTED:
                placeholder = " rejected your LinkUp collaboration request.";
                break;
            case NOTIFICATION_TYPES.NEARBY:
                placeholder = " found you using Nearby.";
                break;
            default:
                placeholder = ""; // Or set a default placeholder
        }
        setPlaceholder(placeholder);

    }, [notificationType]);

    const handleNotificationTabPress = async () =>
    {

        switch (notificationType)
        {
            case NOTIFICATION_TYPES.DOWNVOTE:
            case NOTIFICATION_TYPES.UPVOTE:
            case NOTIFICATION_TYPES.TAGGED:
                router.push({ pathname: "/home/post/[id]", params: { postId: postId, notificationType: notificationType, commentId: commentId, username: username } })
                break;

            case NOTIFICATION_TYPES.NEW_COMMENT:
            case NOTIFICATION_TYPES.NEW_REPLY:
            case NOTIFICATION_TYPES.REPLY_MENTION:
            case NOTIFICATION_TYPES.COMMENT_MENTION:
                router.push({
                    pathname: `/home/post/[id]`,
                    params: {
                        postId: postId,
                        notificationType: notificationType,
                        commentId: commentId,
                        username: username,
                    },
                });
                break;
            default:
                router.push({ pathname: "/home/user/[id]", params: { id: actorId } })
        }

    }

    const handleRespondToFriendRequest = debounce(async (respondStatus) =>
    {

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/friend/respond?senderId=${actorId}&receiverId=${userId}&accept=${respondStatus}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok)
            {
                const data = await response.text()

                if (respondStatus === true)
                {
                    sendNotification(
                        userId,
                        [actorId.toString()],
                        [universityId],
                        "null",
                        "null",
                        "",
                        NOTIFICATION_TYPES.ACCEPTED_FRIEND_REQUEST
                    )
                }

                setFriendRequestResponse(data)

                handleCancelNotification(NOTIFICATION_TYPES.FRIEND_REQUEST);

            }

            if (response.status === 404)
            {
                handleCancelNotification(NOTIFICATION_TYPES.FRIEND_REQUEST);
            }

        } catch (err)
        {
            toast.show("Could not respond to friend request", {

                placement: "top",
                duration: 3000,
                type: "normal"

            })
        }

    }, 350)

    const handleRespondToLinkupCollabRequest = debounce(async (respondStatus) =>
    {

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/linkup/respondToCollabRequest?authorId=${actorId}&friendId=${userId}&isAccepted=${respondStatus}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok)
            {
                const data = await response.text()

                if (respondStatus === true)
                {
                    sendNotification(
                        userId,
                        [actorId.toString()],
                        [universityId],
                        "null",
                        "null",
                        "",
                        NOTIFICATION_TYPES.LINKUP_COLLAB_REQ_ACCEPTED
                    )
                }
                else
                {
                    sendNotification(
                        userId,
                        [actorId.toString()],
                        [universityId],
                        "null",
                        "null",
                        "",
                        NOTIFICATION_TYPES.LINKUP_COLLAB_REQ_REJECTED
                    )
                }

                setLinkupRequestResponse(data)
                handleCancelNotification(NOTIFICATION_TYPES.LINKUP_COLLAB_REQUEST);

            }

            if (response.status === 404)
            {
                handleCancelNotification(NOTIFICATION_TYPES.LINKUP_COLLAB_REQUEST);
            }

        } catch (err)
        {
            toast.show("Could not respond to friend request", {

                placement: "top",
                duration: 3000,
                type: "normal"

            })
        }

    }, 350)

    const handleCancelNotification = async (friendRequestTypeToRemove) =>
    {

        try
        {
            await customFetch(`${ENDPOINT.BASE_URL}/api/v1/notification?senderId=${actorId}&receiverId=${userId}&notificationType=${friendRequestTypeToRemove}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (err)
        {
            toast.show("Could not un-send friend request", {

                placement: "top",
                duration: 3000,
                type: "normal"

            })
        }

    }

    return (
        <Pressable onPress={handleNotificationTabPress} style={[styles.container, { width: width - 32 }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable onPress={() => router.push({ pathname: "/home/user/[id]", params: { id: actorId } })}>
                    <Image style={styles.userProfile} source={{ uri: avatar }}></Image>
                </Pressable>
                <View style={{ paddingHorizontal: 8, width: "85%" }}>
                    <Text textBreakStrategy='tail' style={{ textAlign: "left", fontFamily: FONT.regular, color: COLORS.tertiary, fontSize: SIZES.small }}>
                        <Text style={{ fontFamily: FONT.bold, color: COLORS.tertiary, fontSize: SIZES.small }}>{username}</Text>
                        <View style={{ flexDirection: "row" }}>
                            {
                                isPremiumUser == "true" && <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image>
                            }
                            {
                                role === "ADMIN" && <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image>
                            }
                        </View>

                        {placeholder}
                        {message?.length > 64 ? message.substring(0, 60) : message}
                        <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.whiteAccent }}> {timeSince}</Text>
                    </Text>
                    <View>
                        {
                            friendRequestResponse === "ACCEPTED" ? <Text style={{ color: COLORS.sucess, fontSize: SIZES.xSmall, marginTop: 4 }}>Request Accepted</Text> :
                                friendRequestResponse === "REJECTED" ? <Text style={{ color: COLORS.error, fontSize: SIZES.xSmall, marginTop: 4 }}>Request Removed</Text> :
                                    <View>
                                        {
                                            notificationType === NOTIFICATION_TYPES.FRIEND_REQUEST &&
                                            <View style={{ flexDirection: "row", alignSelf: "flex-start", marginTop: 8 }}>
                                                <TouchableOpacity onPress={() => handleRespondToFriendRequest(true)} style={styles.friendActionAcceptBtn}>
                                                    <Text style={{ marginRight: 4, fontFamily: FONT.regular, color: COLORS.tertiary, fontSize: SIZES.xSmall }}>Accept</Text>
                                                    <AntDesign name="check" size={12} color={COLORS.sucess} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleRespondToFriendRequest(false)} style={styles.friendActionRejectBtn}>
                                                    <Text style={{ marginRight: 4, fontFamily: FONT.regular, color: COLORS.tertiary, fontSize: SIZES.xSmall }}>Reject</Text>
                                                    <AntDesign name="close" size={12} color={COLORS.error} />
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </View>
                        }
                    </View>

                    <View>
                        {
                            linkupRequestResponse === "ACCEPTED" ? <Text style={{ color: COLORS.sucess, fontSize: SIZES.xSmall, marginTop: 4 }}>Request Accepted</Text> :
                                linkupRequestResponse === "REJECTED" ? <Text style={{ color: COLORS.error, fontSize: SIZES.xSmall, marginTop: 4 }}>Request Removed</Text> :
                                    <View>
                                        {
                                            notificationType === NOTIFICATION_TYPES.LINKUP_COLLAB_REQUEST &&
                                            <View style={{ flexDirection: "row", alignSelf: "flex-start", marginTop: 8 }}>
                                                <TouchableOpacity onPress={() => handleRespondToLinkupCollabRequest(true)} style={styles.friendActionAcceptBtn}>
                                                    <Text style={{ marginRight: 4, fontFamily: FONT.regular, color: COLORS.tertiary, fontSize: SIZES.xSmall }}>Accept</Text>
                                                    <AntDesign name="check" size={12} color={COLORS.sucess} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleRespondToLinkupCollabRequest(false)} style={styles.friendActionRejectBtn}>
                                                    <Text style={{ marginRight: 4, fontFamily: FONT.regular, color: COLORS.tertiary, fontSize: SIZES.xSmall }}>Reject</Text>
                                                    <AntDesign name="close" size={12} color={COLORS.error} />
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </View>
                        }
                    </View>

                    <View>
                        {
                            notificationType === NOTIFICATION_TYPES.LINKUP_INTEREST &&
                            <View style={{ flexDirection: "row", alignSelf: "flex-start", marginTop: 8 }}>
                                <TouchableOpacity onPress={() => router.push("/(tabs)/home/requests/linkupRequests")} style={styles.linkUpViewRequestBtn}>
                                    <Text style={{ fontFamily: FONT.regular, color: COLORS.tertiary, fontSize: SIZES.xSmall }}>View</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>

                </View>
            </View>
        </Pressable>
    )
}

export default NotificationTab

const styles = StyleSheet.create({

    container: {

        backgroundColor: COLORS.textAccent,
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.small,
        marginBottom: SIZES.small,
        borderRadius: SIZES.medium,
        alignSelf: "center"
    },
    userProfile: {
        height: 48,
        width: 48,
        borderRadius: 24,
        objectFit: "cover"
    },
    verified: {
        height: 10,
        width: 10,
        objectFit: "contain",
        marginLeft: SIZES.xSmall - 8
    },
    friendActionAcceptBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.xSmall,
        paddingHorizontal: SIZES.small,
        borderRadius: SIZES.small,
        marginRight: 4
    },
    friendActionRejectBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.xSmall,
        paddingHorizontal: SIZES.small,
        borderRadius: SIZES.small
    },
    linkUpViewRequestBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.xSmall,
        paddingHorizontal: SIZES.large,
        borderRadius: SIZES.small,
        marginRight: 4
    }

})