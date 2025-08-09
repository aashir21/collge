import { StyleSheet, View, useWindowDimensions, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FONT, COLORS, SIZES } from '../../constants/theme'
import { useLocalSearchParams } from 'expo-router'
import ProfileHeader from './ProfileHeader'
import ButtonContainer from './ButtonContainer'
import useTimeSince from "../../hooks/useTimeSince"
import PostSettingModal from "../Modals/PostSettingModal"
import CommentsModal from "../Modals/CommentsModal"
import * as FileSystem from 'expo-file-system'
import ImageCarousel from './PostCommonComps/ImageCarousel'
import PostVideoComp from './PostCommonComps/PostVideoComp'
import CaptionBox from '../General Component/CaptionBox'
import BottomSheetCommentsModal from '../Modals/BottomSheetCommentsModal'

const ImagePost = ({ username, name, caption, source, votes, avatar, isPremiumUser, role, userId, createdAt, postId, sourceScreen, taggedUsers, shouldPlay, location, shouldFocusCommentSection, universityId, handleShowCommentsModal, likeStatus }) =>
{

    const { width } = useWindowDimensions()
    const timeAgo = useTimeSince(createdAt)
    const [aspectRatio, setAspectRatio] = useState(4 / 5)
    const [mediaType, setMediaType] = useState({}); // Track the current page
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true)
    const [isFirstAssetVid, setIsFirstAssetVid] = useState(false)

    const showModal = () => setIsModalVisible(true);
    const hideModal = () => setIsModalVisible(false);

    const showCommentsModal = () => setIsCommentsModalVisible(true)
    const hideCommentsModal = () => setIsCommentsModalVisible(false);

    const deletePost = () => setIsDeleted(true)

    const updatedPostData = useLocalSearchParams();

    async function getMediaTypeFromScratch(uri)
    {
        if (!uri)
        { // Check if uri is undefined
            console.warn("URI is undefined. Cannot determine media type.");
            return 'unknown';
        }
        try
        {
            if (uri.startsWith('http'))
            {
                // Remote URI
                const response = await fetch(uri, { method: 'HEAD' });
                const contentType = response.headers.get('content-type');

                // Simple MIME type to extension mapping (add more as needed)
                const mimeToExtensionMap = {
                    'image/jpeg': 'jpg',
                    'image/png': 'png',
                    'video/mp4': 'mp4',
                    'video/quicktime': 'mov',
                    // ... (add other MIME types and extensions)
                };

                return mimeToExtensionMap[contentType] || 'unknown';
            } else
            {
                // Local file URI
                // (Use expo-file-system or similar for local file access)
                const info = await FileSystem.getInfoAsync(uri);
                if (info.exists)
                {
                    const extension = info.uri.split('.').pop().toLowerCase();
                    return extension;
                } else
                {

                    return 'unknown';
                }
            }
        } catch (error)
        {
            console.error("Error determining media type:", error);
            return 'unknown';
        }
    }

    useEffect(() =>
    {
        async function fetchData()
        {
            if (!source || source.length < 1)
            {
                return;
            }

            if (source && source.length === 1 && source[0])
            {
                const fetchedMediaInfo = await getMediaTypeFromScratch(source[0]);
                setMediaType(fetchedMediaInfo);

                //Determine aspect ratio for the first image
                if (fetchedMediaInfo === "png" || fetchedMediaInfo === "jpg")
                {
                    await Image.getSize(source[0], (width, height) =>
                    {
                        if (width > height)
                        {
                            setAspectRatio(5 / 4)
                        }
                    });
                }
                else
                {
                    setIsFirstAssetVid(true)
                }


            }
        }
        fetchData(); // Call the async function inside useEffect
    }, [source]);



    const handleVideoLoadState = (state) =>
    {
        setIsImageLoading(state)
    }

    const handleAspectRatio = (ratio) =>
    {
        setAspectRatio(ratio)
    }


    return (
        <View>
            {
                !isDeleted ? <View style={{ width: width - 32, backgroundColor: COLORS.textAccent, borderRadius: SIZES.large, padding: SIZES.large, marginBottom: SIZES.medium, alignSelf: "center" }}>

                    <View>
                        <ProfileHeader taggedUsers={taggedUsers} location={location} userId={userId} name={name} value={`${username}`} handleNavigation profilePicUri={avatar} isPremiumUser={isPremiumUser} role={role} createdAt={timeAgo} showModal={showModal} />
                        <View>
                            <View>
                                <View style={styles.captionTextCon}>
                                    <CaptionBox caption={caption} updatedCaption={updatedPostData.updatedCaption} postId={postId} updatedPostId={updatedPostData.postId} />
                                </View>
                                <View>
                                    {
                                        source.length === 1 ? <View style={[styles.postImgCon]}>
                                            <View style={{ backgroundColor: COLORS.primary, justifyContent: "center", borderRadius: SIZES.large, }}>
                                                {
                                                    (mediaType === "png" || mediaType === "jpg") ?
                                                        <Image
                                                            style={[styles.postImg, { aspectRatio: aspectRatio }]}
                                                            source={{ uri: source[0] }}
                                                            onLoadStart={() => setIsImageLoading(true)}
                                                            onLoadEnd={() => setIsImageLoading(false)}
                                                        /> : <PostVideoComp isFirstAssetVid={isFirstAssetVid} index={0} handleAspectRatio={handleAspectRatio} numOfAssets={1} handleVideoLoadState={handleVideoLoadState} vidSource={source[0]} shouldPlay={shouldPlay} aspectRatio={aspectRatio} isPartOfCarousel={false} />
                                                }
                                                <View style={styles.imageLoader}>
                                                    {isImageLoading && <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />}
                                                </View>
                                            </View>
                                        </View> : source.length < 1 ? null : (
                                            <View style={{ marginTop: SIZES.small }}>
                                                <ImageCarousel handleVideoLoadState={handleVideoLoadState} shouldPlay={shouldPlay} source={source} />
                                            </View>

                                        )
                                    }
                                </View>
                            </View>

                            <ButtonContainer likeStatus={likeStatus} handleShowCommentsModal={handleShowCommentsModal} universityId={universityId} shouldFocusCommentSection={shouldFocusCommentSection} votes={votes} userId={userId} postId={postId} showModal={showCommentsModal} />

                        </View>
                    </View>

                    {isModalVisible && (
                        <PostSettingModal postId={postId} isVisible={isModalVisible} sourceScreen={sourceScreen} onClose={hideModal} deletePost={deletePost} userId={userId}></PostSettingModal>
                    )}

                    {isCommentsModalVisible && (
                        <View>
                            <BottomSheetCommentsModal />
                        </View>
                    )}

                </View> : null
            }
        </View>
    )
}

export default React.memo(ImagePost)

const styles = StyleSheet.create({
    postImgCon: {
        marginVertical: SIZES.small
    },
    postImg: {

        objectFit: "cover",
        borderRadius: SIZES.large,
        backgroundColor: COLORS.primary,
        position: "relative",

    },
    imageLoader: {
        alignSelf: "center",
        borderRadius: SIZES.large,
    },
    postCount: {
        position: "absolute",
        zIndex: 5,
        right: 0,
        height: 28,
        width: 28,
        borderRadius: 14,
        marginVertical: SIZES.small,
        marginHorizontal: SIZES.small,
        backgroundColor: COLORS.lightBlack,
        justifyContent: "center",
        alignItems: "center"

    },
    locationContainer: {
        flexDirection: "row",
        marginTop: SIZES.medium
    },
    locationName: {
        fontSize: SIZES.fontBodySize - 2,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        marginHorizontal: 4
    },
    captionTextCon: {

    },
    editInput: {
        color: COLORS.tertiary,
        flexWrap: "wrap"
    },
    captionText: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.fontBodySize
    },
    paginationDotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        position: "absolute",
        bottom: 10,          // Adjust distance from the bottom as needed
        left: 0,
        right: 0,
        zIndex: 5
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.whiteAccent, // Inactive dot color
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.secondary, // Active dot color
    },
    modal: {
        backgroundColor: COLORS.secondary
    }
})