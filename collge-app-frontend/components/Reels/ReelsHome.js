import { StyleSheet, View, FlatList, useWindowDimensions, RefreshControl, Platform, Text, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from "../../constants/theme"
import ReelsTemplate from './ReelsTemplate'
import { customFetch } from '../../utility/tokenInterceptor'
import GeneralLoading from "../Loading/GeneralLoading"
import AltCommentsModal from '../Modals/AltCommentsModal'
import SpanText from "../General Component/SpanText"
import BottomSheetCommentsModal from '../Modals/BottomSheetCommentsModal'
import * as SecureStore from "expo-secure-store"


const ReelsHome = () =>
{

    const [reels, setReels] = useState([])
    const dimensions = useWindowDimensions()
    const [isLoading, setIsLoading] = useState(true)
    const flatListRef = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
    const [showCommentsModal, setShowCommentsModal] = useState({
        isVisible: false,
        postId: null,
        userId: null
    })
    const PAGE_SIZE = 4;
    const [offset, setOffset] = useState(0)

    const onViewableItemsChanged = ({ viewableItems }) =>
    {
        if (viewableItems.length > 0)
        {
            setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
        }
    }
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])


    const handleApiFetch = async () =>
    {

        const currentUserId = SecureStore.getItem("__userId")

        try
        {
            customFetch(`${ENDPOINT.BASE_URL}/api/v1/post/getPostsByType?userId=${currentUserId}&type=REEL&offset=${offset}&pageSize=${PAGE_SIZE}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then((data) =>
                {
                    setReels([...reels, ...data])
                    setOffset(prevOffset => prevOffset + 1)

                })

                .catch(error => console.error('Error:', error));
        } catch (error)
        {
            console.error('Error fetching data:', error);
        }
        finally
        {
            setIsLoading(false)
        }
    };

    const onRefresh = useCallback(async () =>
    {
        setRefreshing(true);
        setIsLoading(true)
        setTimeout(async () =>
        {
            try
            {
                setReels([]);
                setOffset(0)

                await Promise.all([handleApiFetch()]);
            } catch (err)
            {
                console.error(err);
            } finally
            {
                setRefreshing(false);
            }
        }, 1000); // Adjust the delay (in milliseconds) as needed
    }, []);

    useEffect(() =>
    {

        handleApiFetch()

    }, [])

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

    return (
        <View style={styles.container}>
            {
                isLoading ? <GeneralLoading title={"Loading fresh tapes..."} />
                    :
                    <FlatList
                        data={reels}
                        keyExtractor={(item) => item.postId.toString()}
                        renderItem={({ item, index }) => (
                            <View style={{ width: dimensions.width, height: Platform.OS === "ios" ? dimensions.height - 83 : dimensions.height - 60 }}>
                                <ReelsTemplate
                                    likeStatus={item.likeStatus}
                                    userId={item.userId}
                                    caption={item.caption}
                                    username={item.username}
                                    vidSource={item.source[0]} // Assuming source is an array
                                    votes={item.votes}
                                    avatar={item.avatar}
                                    isPremiumUser={item.isPremiumUser} // Corrected prop name
                                    role={item.role}
                                    focused={index === currentViewableItemIndex}
                                    postId={item.postId}
                                    name={item.firstName}
                                    handleShowCommentsModal={openCommentsModal}
                                    universityId={item.universityId}
                                />
                            </View>
                        )}
                        ref={flatListRef}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        pagingEnabled
                        onEndReachedThreshold={0.5}
                        onEndReached={() => handleApiFetch(offset)}
                        removeClippedSubviews={true}
                        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                        scrollEventThrottle={16}
                        overScrollMode="never"
                    />
            }

            {
                showCommentsModal.isVisible &&
                <BottomSheetCommentsModal userId={showCommentsModal.userId} postId={showCommentsModal.postId} closeModal={closeCommentsModal} />
            }
        </View>
    )
}

export default ReelsHome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
    },
    reelsTitle: {
        color: COLORS.tertiary,
        fontFamily: FONT.bold,
        fontSize: SIZES.xxLarge,
        marginTop: SIZES.large,
    }
})