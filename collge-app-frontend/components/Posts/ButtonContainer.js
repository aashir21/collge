import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions, Pressable } from 'react-native'
import { COLORS, ENDPOINT, NOTIFICATION_TYPES, SIZES } from '../../constants/theme'
import { AntDesign, Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { customFetch } from "../../utility/tokenInterceptor"
import * as SecureStore from "expo-secure-store"
import useShortenedNumber from '../../hooks/useShortenedNumber';
import { router, useSegments } from 'expo-router';
import { sendNotification } from '../../utility/notification';
import { useToast } from 'react-native-toast-notifications';
import { debounce } from 'lodash';
import BottomSheetCommentsModal from '../Modals/BottomSheetCommentsModal';
import SharePostModal from '../Modals/SharePostModal';

const ButtonContainer = ({ votes, postId, userId, shouldFocusCommentSection, universityId, showModal, handleShowCommentsModal, likeStatus }) =>
{

    const [showShareModal, setShowShareModal] = useState(false);
    const segments = useSegments()
    const [likeState, setLikeState] = useState(likeStatus)
    const [isVoting, setIsVoting] = useState(false);
    const shortVotes = useShortenedNumber(votes)

    const openShareModal = () => setShowShareModal(true)
    const closeShareModal = () => setShowShareModal(false)

    const voteCountRef = useRef(shortVotes)
    const [voteCount, setVoteCount] = useState(votes)
    const [isRequestProcessing, setIsRequestProcessing] = useState(false);

    const toast = useToast()

    useEffect(() =>
    {

        if (shouldFocusCommentSection == true)
        {
            handleShowCommentsModal(postId, userId)
        }

    }, [])

    const voteEndpoint = async (updatedType) =>
    {
        const currentUserId = await SecureStore.getItem("__userId");
        const response = await customFetch(
            `${ENDPOINT.BASE_URL}/api/v1/post/vote?userId=${currentUserId}&postId=${postId}&type=${updatedType}`,
            { method: 'PUT' }
        );
        return response;
    };

    const handleLikePress = useCallback(async () =>
    {
        if (isRequestProcessing) return;

        try
        {
            setIsRequestProcessing(true);

            const updatedType = likeState === 'LIKED' ? 'UNLIKED' : 'LIKED';

            // Optimistic update
            let oldLikeState = likeState;
            let oldVoteCount = voteCount;

            // Update UI optimistically
            setLikeState(updatedType);
            setVoteCount(
                updatedType === 'LIKED'
                    ? voteCount + 1
                    : voteCount - 1
            );

            const response = await voteEndpoint(updatedType);
            if (!response.ok)
            {
                // Revert to old state if request fails
                setLikeState(oldLikeState);
                setVoteCount(oldVoteCount);

                toast.show("Something went wrong, couldn't upvote the post", {
                    type: "normal",
                    placement: "top",
                    duration: 3500,
                    swipeEnabled: true,
                });
                return;
            }

            const voteCountFromDb = await response.text();
            const newCount = parseInt(voteCountFromDb, 10);
            setVoteCount(newCount);

            if (updatedType === "LIKED")
            {
                const actorId = parseInt(await SecureStore.getItem("__userId"));
                const userIdString = userId.toString();

                sendNotification(
                    actorId,
                    [userIdString],
                    [universityId],
                    postId,
                    "null",
                    "",
                    NOTIFICATION_TYPES.UPVOTE
                );

            }

        } catch (error)
        {
            toast.show("Something went wrong", {
                type: "normal",
                placement: "top",
                duration: 3000,
                animationType: "slide-in",
            });
            console.error(error);
        } finally
        {
            setIsRequestProcessing(false);
        }
    }, [isRequestProcessing, likeState, voteCount, postId, userId, universityId]);

    const handleDislikePress = useCallback(async () =>
    {
        if (isRequestProcessing) return;

        try
        {
            setIsRequestProcessing(true);

            const updatedType = likeState === 'DISLIKED' ? 'UNDISLIKED' : 'DISLIKED';

            // Optimistic update
            let oldLikeState = likeState;
            let oldVoteCount = voteCount;

            setLikeState(updatedType);
            setVoteCount(
                updatedType === 'DISLIKED'
                    ? voteCount - 1
                    : voteCount + 1
            );

            const response = await voteEndpoint(updatedType);
            if (!response.ok)
            {
                // Revert to old state if request fails
                setLikeState(oldLikeState);
                setVoteCount(oldVoteCount);

                toast.show("Something went wrong, couldn't downvote the post", {
                    type: "normal",
                    placement: "top",
                    duration: 3500,
                    swipeEnabled: true,
                });
                return;
            }

            const voteCountFromDb = await response.text();
            const newCount = parseInt(voteCountFromDb, 10);
            setVoteCount(newCount);

            if (updatedType === "DISLIKED")
            {
                const actorId = parseInt(await SecureStore.getItem("__userId"));
                const userIdString = userId.toString();
                sendNotification(
                    actorId,
                    [userIdString],
                    [universityId],
                    postId,
                    "null",
                    "",
                    NOTIFICATION_TYPES.DOWNVOTE
                );
            }

        } catch (error)
        {
            toast.show("Something went wrong", {
                type: "normal",
                placement: "top",
                duration: 3000,
                animationType: "slide-in",
            });
            console.error(error);
        } finally
        {
            setIsRequestProcessing(false);
        }
    }, [isRequestProcessing, likeState, voteCount, postId, userId, universityId]);

    const handleViewLikes = () =>
    {
        router.push({
            pathname: `/${segments[0]}/${segments[1]}/likes`,
            params: { id: postId }
        });
    };

    return (
        <View>
            <View style={styles.btnContainer}>
                <View style={{ flexDirection: "row", alignItems: "center", width: "80%" }}>
                    <Pressable onPress={handleViewLikes}>
                        <Text style={{ color: COLORS.tertiary, fontSize: SIZES.large, marginRight: SIZES.medium }}>{voteCount}</Text>
                    </Pressable>
                    <TouchableOpacity disabled={isVoting} onPress={handleLikePress}>
                        <AntDesign name="arrowup" size={22} color={likeState === 'LIKED' ? COLORS.secondary : COLORS.whiteAccent} />
                    </TouchableOpacity>
                    <TouchableOpacity disabled={isVoting} onPress={handleDislikePress} style={{ marginHorizontal: SIZES.medium }}>
                        <AntDesign name="arrowdown" size={22} color={likeState === 'DISLIKED' ? COLORS.error : COLORS.whiteAccent} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleShowCommentsModal(postId, userId)}
                    >
                        <Feather name="message-circle" size={22} color={COLORS.whiteAccent} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", width: "20%" }}>
                    <TouchableOpacity onPress={openShareModal}>
                        <Feather name="share" size={20} color={COLORS.whiteAccent} />
                    </TouchableOpacity>
                </View>
            </View>

            {
                showShareModal &&
                <SharePostModal isVisible={showShareModal} userId={userId} onClose={closeShareModal} postId={postId} />
            }
        </View>
    )
}

export default React.memo(ButtonContainer)

const styles = StyleSheet.create({
    btnContainer: {
        height: 35,
        justifyContent: "center",
        flexDirection: "row",
    }
})