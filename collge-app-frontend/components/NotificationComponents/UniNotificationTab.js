import { StyleSheet, Text, useWindowDimensions, View, Image, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONT, NOTIFICATION_TYPES, SIZES } from '../../constants/theme'
import useTimeSince from '../../hooks/useTimeSince'
import { router } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';

const UniNotificationTab = ({ actorId, userId, createdAt, notificationType, actorUsername, receiverUsername, receiverAvatar, actorAvatar, role, isPremiumUser, postId }) =>
{
    const { width } = useWindowDimensions()
    const [placeholder, setPlaceholder] = useState("")

    const timeSince = useTimeSince(createdAt)

    useEffect(() =>
    {
        let placeholder;

        switch (notificationType)
        {
            case NOTIFICATION_TYPES.APP_JOIN:
                placeholder = " just joined Collge!";
                break;
            case NOTIFICATION_TYPES.NEW_LINK_UP:
                placeholder = " created a new Link Up post";
                break;
            case NOTIFICATION_TYPES.ACCEPTED_FRIEND_REQUEST:
                placeholder = ` and ${receiverUsername} are now friends`;
                break;
            case NOTIFICATION_TYPES.UPVOTE:
                placeholder = ` up voted ${receiverUsername}'s post`;
                break;
            case NOTIFICATION_TYPES.DOWNVOTE:
                placeholder = ` down voted ${receiverUsername}'s post.`;
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
                router.push({ pathname: "/home/post/[id]", params: { postId: postId, notificationType: notificationType, commentId: commentId, username: username } })
                break;
            // TODO: Add a case for new link up post which will redirect to link up post
            default:
                router.push({ pathname: "/home/user/[id]", params: { id: actorId } })
        }

    }

    return (
        <Pressable onPress={handleNotificationTabPress} style={[styles.container, { width: width - 32 }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable onPress={() => router.push({ pathname: "/home/user/[id]", params: { id: actorId } })}>
                    <Image style={styles.userProfile} source={{ uri: actorAvatar }}></Image>
                </Pressable>
                <View style={{ paddingHorizontal: 8, width: "70%" }}>
                    <Text numberOfLines={3} textBreakStrategy='tail' style={{ textAlign: "left", fontFamily: FONT.regular, color: COLORS.tertiary, fontSize: SIZES.small }}>
                        <Text style={{ fontFamily: FONT.bold, color: COLORS.tertiary, fontSize: SIZES.small }}>{actorUsername}</Text>
                        <View style={{ flexDirection: "row" }}>
                            {
                                isPremiumUser == "true" && <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image>
                            }
                            {
                                role === "ADMIN" && <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image>
                            }
                        </View>

                        {placeholder}
                        <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.whiteAccent, marginLeft: SIZES.small }}> {timeSince}</Text>
                    </Text>
                    {
                        notificationType === NOTIFICATION_TYPES.FRIEND_REQUEST &&
                        <View style={{ flexDirection: "row", alignSelf: "flex-start", marginTop: 8 }}>
                            <TouchableOpacity style={styles.friendActionAcceptBtn}>
                                <Text style={{ marginRight: 4, fontFamily: FONT.regular, color: COLORS.primary, fontSize: SIZES.xSmall - 2 }}>Accept</Text>
                                <AntDesign name="check" size={12} color={COLORS.sucess} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.friendActionRejectBtn}>
                                <Text style={{ marginRight: 4, fontFamily: FONT.regular, color: COLORS.tertiary, fontSize: SIZES.xSmall }}>Reject</Text>
                                <AntDesign name="close" size={14} color={COLORS.error} />
                            </TouchableOpacity>
                        </View>
                    }

                </View>

            </View>
            {
                (notificationType !== NOTIFICATION_TYPES.APP_JOIN && notificationType !== NOTIFICATION_TYPES.NEW_LINK_UP) &&
                <Pressable onPress={() => router.push({ pathname: "/home/user/[id]", params: { id: userId } })}>
                    <Image style={styles.userProfile} source={{ uri: receiverAvatar }}></Image>
                </Pressable>
            }
        </Pressable>
    )
}

export default UniNotificationTab

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        backgroundColor: COLORS.textAccent,
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.small,
        marginBottom: SIZES.small,
        borderRadius: SIZES.medium
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
        backgroundColor: COLORS.tertiary,
        paddingVertical: SIZES.xSmall,
        paddingHorizontal: SIZES.small,
        borderRadius: SIZES.small,
        marginRight: 8
    },
    friendActionRejectBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.xSmall,
        paddingHorizontal: SIZES.small,
        borderRadius: SIZES.small
    }

})