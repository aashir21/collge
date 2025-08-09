import { StyleSheet, Text, View, Image, useWindowDimensions, TouchableOpacity, Pressable, FlatList, ActivityIndicator, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT, SIZES } from '../../../constants/theme'
import CaptionBox from "../../../components/General Component/CaptionBox"
import useTimeSince from "../../../hooks/useTimeSince"
import { router, useSegments } from 'expo-router'
import { useToast } from 'react-native-toast-notifications'

const Comment = ({ avatar, username, createdAt, comment, opacity, postId, role, isPremiumUser, userId }) =>
{

    const { width } = useWindowDimensions()
    const timeAgo = useTimeSince(createdAt)
    const segments = useSegments()

    const toast = useToast()

    const handleNaviagteToSettingsPostPage = () =>
    {

        router.push({
            pathname: `/profile/settings/comments/post/[id]`,
            params: {
                postId: postId,
                comment: comment,
            }
        })

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

    return (

        <Pressable onPress={handleNaviagteToSettingsPostPage} style={[styles.container, { width: width - 32, opacity: opacity }]}>

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
                            isPremiumUser == "true" ? <Image style={styles.verified} source={require("../../../assets/images/verified.png")}></Image> : null
                        }
                        {
                            (role === "ADMIN" || role === "MANAGER") ? <Image style={styles.verified} source={require("../../../assets/images/C.png")}></Image> : null
                        }

                    </View>
                    <Text style={styles.time}>{timeAgo}</Text>
                </View>
                <View style={{ width: "100%" }}>

                    <CaptionBox type={"comment"} propStyle={{ fontSize: SIZES.fontBodySize - 2, marginVertical: 4 }} caption={comment} />

                </View>
            </View>


        </Pressable >
    )
}

export default Comment

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
        // marginTop: 4
    }

})