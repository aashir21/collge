import { ActivityIndicator, Platform, SafeAreaView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { customFetch } from "../../utility/tokenInterceptor"
import { COLORS, ENDPOINT, FONT, SIZES } from "../../constants/theme"
import ReelsTemplate from "../Reels/ReelsTemplate"
import ConfessionTemplate from "../Posts/ConfessionTemplate"
import ImagePost from "../Posts/ImagePost"
import SpanText from '../General Component/SpanText'
import * as SecureStore from "expo-secure-store"
import BottomSheetCommentsModal from '../Modals/BottomSheetCommentsModal'

const SettingsPostScreen = ({ postId, comment }) =>
{

    const [isLoading, setIsLoading] = useState(false)
    const [postData, setPostData] = useState()
    const [notFound, setNotFound] = useState(false)
    const { width } = useWindowDimensions()

    const [showCommentsModal, setShowCommentsModal] = useState({
        isVisible: false,
        postId: null,
        userId: null
    })

    const openCommentsModal = (postId, userId) => setShowCommentsModal(
        {
            isVisible: true,
            postId: postId,
            userId: userId
        }
    )
    const closeCommentsModal = () => setShowCommentsModal(
        {
            isVisible: false,
            postId: null,
            userId: null
        }
    )

    useEffect(() =>
    {

        Promise.all([handleFetchMentionedPost()])

    }, [])

    const handleFetchMentionedPost = async () =>
    {
        try
        {
            const currentUserId = SecureStore.getItem("__userId");

            setIsLoading(true)

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/post/getPostById?userId=${currentUserId}&postId=${postId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (response.ok)
            {
                const data = await response.json()
                setPostData(data)
            }

            if (response.status === 404)
            {
                setNotFound(true)
            }
        } catch (err)
        {
            console.log(err);

            toast.show("Something went wrong", {
                placement: "top",
                type: "normal",
                duration: 3000,
                animationType: "slide-in",
            })
        }
        finally
        {
            setIsLoading(false)
        }
    }

    if (notFound)
    {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: SIZES.xLarge, fontFamily: FONT.bold, color: COLORS.tertiary, textAlign: "center" }}>Uh Oh! The post is no longer available 😕</Text>
            </View>
        )
    }

    if (isLoading)
    {
        return <View style={{ flex: 1, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" }}><ActivityIndicator size={"large"} color={COLORS.whiteAccent} /></View>
    }

    if (postData?.postType === "REEL")
    {
        return (
            <ReelsTemplate handleShowCommentsModal={openCommentsModal} name={postData.firstName} username={postData.username} userId={postData.userId} avatar={postData.avatar} votes={postData.votes} vidSource={postData.source[0]} role={postData.role} isPremiumUser={postData.isPremiumUser} caption={postData.caption} focused={true} postId={postData.postId}></ReelsTemplate>
        )
    }

    return (
        <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 16 : 16 }]}>

            <View style={{ justifyContent: "flex-start", alignItems: "center", marginVertical: SIZES.xxLarge }}>
                <View style={{ width: width - 32 }}>
                    <Text style={styles.commentDetailContainer}>Your comment on <SpanText subtext={postData?.username} />'s post </Text>
                    <Text numberOfLines={3} style={styles.commentText}>"{comment}"</Text>
                </View>
                {
                    postData?.postType === "POST" ?
                        <ImagePost handleShowCommentsModal={openCommentsModal} universityId={postData.universityId} username={postData.username} name={postData.firstName} caption={postData.caption} source={postData.source} votes={postData.votes} avatar={postData.avatar} isPremiumUser={postData.isPremiumUser} role={postData.role} userId={postData.userId} createdAt={postData.createdAt} postId={postData.postId} sourceScreen={"HOME"} taggedUsers={postData.taggedUsers} shouldPlay={true} location={postData.location} />
                        :
                        postData?.postType == "CONFESSION" ?
                            <ConfessionTemplate handleShowCommentsModal={openCommentsModal} universityId={item.universityId} caption={postData?.caption} votes={postData?.votes} createdAt={postData?.createdAt} postId={postData?.postId} sourceScreen={"HOME"} taggedUsers={postData?.taggedUsers} location={postData?.location} />
                            :
                            null
                }
            </View>

            {
                showCommentsModal.isVisible &&
                <BottomSheetCommentsModal userId={showCommentsModal.userId} postId={showCommentsModal.postId} closeModal={closeCommentsModal} />
            }
        </SafeAreaView>
    )
}

export default SettingsPostScreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    commentDetailContainer: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.xLarge,
        textAlign: "left"
    },

    commentText: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        marginTop: SIZES.medium,
        marginBottom: SIZES.large
    }

})