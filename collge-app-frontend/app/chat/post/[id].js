import { ActivityIndicator, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { customFetch } from "../../../utility/tokenInterceptor"
import { COLORS, ENDPOINT, FONT, SIZES } from '../../../constants/theme'
import * as SecureStore from "expo-secure-store"
import DynamicReelTemplate from "../../../components/Reels/DynamicReelTemplate"
import ConfessionTemplate from "../../../components/Posts/ConfessionTemplate"
import ImagePost from "../../../components/Posts/ImagePost"
import BottomSheetCommentsModal from '../../../components/Modals/BottomSheetCommentsModal'

const MentionedPost = () =>
{
    const localParams = useLocalSearchParams()

    const [isLoading, setIsLoading] = useState(false)
    const [postData, setPostData] = useState()
    const [notFound, setNotFound] = useState(false)

    const [showCommentsModal, setShowCommentsModal] = useState({
        isVisible: false,
        postId: null,
        userId: null
    })


    useEffect(() =>
    {

        Promise.all([handleFetchMentionedPost()])

    }, [])

    const handleFetchMentionedPost = async () =>
    {
        try
        {

            setIsLoading(true)

            const currentUserId = SecureStore.getItem("__userId")

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/post/getPostById?userId=${currentUserId}&postId=${localParams.postId}`, {
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


    if (isLoading)
    {
        return <ActivityIndicator size={"large"} color={COLORS.whiteAccent} />
    }

    if (notFound)
    {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: SIZES.xLarge, fontFamily: FONT.bold, color: COLORS.tertiary, textAlign: "center" }}>Uh Oh! The post is no longer available 😕</Text>
            </View>
        )
    }

    if (postData?.postType === "REEL")
    {
        return (
            <DynamicReelTemplate likeStatus={postData.likeStatus} handleShowCommentsModal={openCommentsModal} username={postData.username} name={postData.firstName} votes={postData.votes} userId={postData.userId} avatar={postData.avatar} vidSource={postData.source[0]} role={postData.role} isPremiumUser={postData.isPremiumUser} caption={postData.caption} focused={true} postId={postData.postId}></DynamicReelTemplate>
        )
    }

    return (
        <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 16 : 16 }]}>
            {
                localParams.notificationType === "TAGGED" &&
                <Text style={{ color: COLORS.tertiary, fontFamily: FONT.bold, fontSize: SIZES.xLarge, paddingHorizontal: SIZES.medium }}>{localParams?.username} tagged you in this post.</Text>
            }
            <View style={{ justifyContent: "flex-start", alignItems: "center", marginVertical: SIZES.xxLarge }}>
                {
                    postData?.postType === "POST" ?
                        <ImagePost likeStatus={postData.likeStatus} handleShowCommentsModal={openCommentsModal} universityId={postData?.universityId} shouldFocusCommentSection={false} username={postData.username} name={postData.firstName} caption={postData.caption} source={postData.source} votes={postData.votes} avatar={postData.avatar} isPremiumUser={postData.isPremiumUser} role={postData.role} userId={postData.userId} createdAt={postData.createdAt} postId={postData.postId} sourceScreen={"HOME"} taggedUsers={postData.taggedUsers} shouldPlay={true} location={postData.location} />
                        :
                        postData?.postType == "CONFESSION" ?
                            <ConfessionTemplate likeStatus={postData.likeStatus} handleShowCommentsModal={openCommentsModal} universityId={postData?.universityId} shouldFocusCommentSection={false} caption={postData?.caption} votes={postData?.votes} createdAt={postData?.createdAt} postId={postData?.postId} sourceScreen={"HOME"} taggedUsers={postData?.taggedUsers} location={postData?.location} />
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

export default MentionedPost

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    }

})