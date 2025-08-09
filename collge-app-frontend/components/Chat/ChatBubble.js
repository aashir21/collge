import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Bubble } from 'react-native-gifted-chat'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { FontAwesome5 } from '@expo/vector-icons'

const ChatBubble = ({ props }) =>
{

    const navigateToPost = (postId) =>
    {
        router.push({
            pathname: "/chat/post/[id]",
            params: { postId: postId }
        })
    }

    const customView = (props) =>
    {

        const post = props.currentMessage.post

        return (
            <View {...props} style={styles.customView}>

                {
                    post?.isPostFound ?
                        <View>
                            {
                                post.postType === "POST" ? (

                                    <Pressable onPress={() => navigateToPost(post._id)}>
                                        <ChatPostProfileTextOnlyHeader authorAvatar={post.authorAvatar} authorUsername={post.authorUsername} role={post.role} premiumUser={post.isPremiumUser} />
                                        {
                                            post.isTextOnly ? <ChatPostTextOnlyBody caption={post.postCaption} />
                                                :
                                                <ChatPostBody mediaThumbnailUrl={post.mediaThumbnailUrl} />

                                        }
                                        {
                                            !post.isTextOnly && <ChatPostFooter authorUsername={post.authorUsername} caption={post.postCaption} truncationLimit={24} />
                                        }
                                    </Pressable>
                                ) : post.postType === "REEL" ? (
                                    <Pressable onPress={() => navigateToPost(post._id)}>
                                        <ChatPostProfileHeader isATape={true} authorAvatar={post.authorAvatar} authorUsername={post.authorUsername} role={post.role} premiumUser={post.isPremiumUser} />
                                        <ChatPostBody mediaThumbnailUrl={post.mediaThumbnailUrl} />
                                        <ChatPostFooter authorUsername={post.authorUsername} caption={post.postCaption} truncationLimit={24} />
                                    </Pressable>
                                ) : post.postType === "CONFESSION" ? (
                                    <Pressable onPress={() => navigateToPost(post._id)}>
                                        <ChatPostProfileTextOnlyHeader authorAvatar={"https://i.imgur.com/hmijVtQ.png"} authorUsername={"secret_user"} role={"USER"} premiumUser={false} />
                                        <ChatPostTextOnlyBody caption={post.postCaption} />
                                    </Pressable>
                                ) : null // Default case, renders nothing if no condition matches
                            }
                        </View>
                        :
                        post?.isPostFound == null ?
                            null
                            :
                            <View style={styles.notFoundContainer}>
                                <Text style={{ color: COLORS.tertiary, fontFamily: FONT.regular, fontSize: SIZES.small }}>This post is no longer available. It is possible that it was removed by the author.</Text>
                            </View>
                }

            </View>
        )

    }

    const ChatPostProfileHeader = ({ authorAvatar, authorUsername, role, premiumUser, isATape }) =>
    {

        return (
            <View style={styles.headerContainer}>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image style={styles.authorAvatar} source={{ uri: authorAvatar }} />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.authorUsername}>{authorUsername}</Text>
                        {
                            premiumUser == true ? <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image> : null
                        }
                        {
                            role === "ADMIN" ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
                        }
                    </View>
                </View>
                {
                    isATape && <FontAwesome5 name="tape" size={18} color={COLORS.tertiary} />
                }

            </View>
        )
    }

    const ChatPostProfileTextOnlyHeader = ({ authorAvatar, authorUsername, role, premiumUser }) =>
    {

        return (
            <View style={styles.textOnlyHeaderContainer}>

                <Image style={styles.authorAvatar} source={{ uri: authorAvatar }} />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.authorUsername}>{authorUsername}</Text>
                        {
                            premiumUser == true ? <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image> : null
                        }
                        {
                            role === "ADMIN" ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
                        }
                    </View>

                </View>

            </View>
        )
    }

    const ChatPostFooter = ({ authorUsername, caption, truncationLimit }) =>
    {

        return (
            <View style={styles.footerContainer}>

                <Text style={[styles.authorUsername, { fontFamily: FONT.bold, marginLeft: 0 }]}>{authorUsername}
                    <Text style={[styles.authorUsername, { color: COLORS.whiteAccent }]}> {caption.length > truncationLimit ? caption.substring(0, truncationLimit) + "..." : caption}</Text>
                </Text>

            </View>
        )
    }

    const ChatPostBody = ({ mediaThumbnailUrl }) =>
    {

        return (
            <Image style={styles.media} source={{ uri: mediaThumbnailUrl }} />
        )

    }

    const ChatPostTextOnlyBody = ({ caption }) =>
    {

        return (
            <View style={styles.postCaptionContainer}>
                <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.fontBodySize - 1, color: COLORS.tertiary }}>
                    {caption}
                </Text>
            </View>
        )

    }

    return (

        <Bubble {...props}
            textStyle={{
                left: {
                    color: COLORS.tertiary,
                },
                right: {
                    color: COLORS.tertiary,
                }
            }}
            wrapperStyle={{
                left: {
                    backgroundColor: props?.currentMessage.post.isPostFound === null ? COLORS.lightBlack : "transparent",
                    paddingVertical: 4,
                    paddingHorizontal: 6,
                },
                right: {
                    backgroundColor: props?.currentMessage.post.isPostFound === null ? "#38a14f" : "transparent",
                    paddingVertical: 4,
                    paddingHorizontal: 6,
                }

                //"#38a14f"
            }}
            renderCustomView={() => customView(props)}
        />


    )
}


export default ChatBubble

const styles = StyleSheet.create({

    headerContainer: {
        backgroundColor: COLORS.textAccent,
        paddingHorizontal: SIZES.small,
        paddingVertical: SIZES.medium,
        width: 250,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopLeftRadius: SIZES.medium,
        borderTopRightRadius: SIZES.medium
    },
    authorAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        objectFit: "cover",
        backgroundColor: COLORS.primary
    },
    authorUsername: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.tertiary,
        marginLeft: SIZES.small
    },
    verified: {
        height: 12,
        width: 12,
        marginLeft: 4,
    },
    footerContainer: {
        backgroundColor: COLORS.textAccent,
        paddingHorizontal: SIZES.small,
        paddingVertical: SIZES.medium,
        width: 250,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SIZES.small,
        borderBottomLeftRadius: SIZES.medium,
        borderBottomRightRadius: SIZES.medium
    },
    media: {
        width: 250,
        height: 250,
        backgroundColor: COLORS.primary,
        objectFit: "cover"
    },
    postCaptionContainer: {
        backgroundColor: COLORS.textAccent,
        width: 250,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SIZES.small,
        paddingBottom: SIZES.xLarge,
        marginBottom: SIZES.small,
        borderBottomLeftRadius: SIZES.medium,
        borderBottomRightRadius: SIZES.medium
    },
    textOnlyHeaderContainer: {
        backgroundColor: COLORS.textAccent,
        paddingHorizontal: SIZES.small,
        paddingVertical: SIZES.medium,
        width: 250,
        flexDirection: "row",
        alignItems: "center",
        borderTopLeftRadius: SIZES.medium,
        borderTopRightRadius: SIZES.medium
    },
    notFoundContainer: {
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.medium,
        backgroundColor: COLORS.textAccent,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: SIZES.medium
    }

})