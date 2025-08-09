import
{
    SafeAreaView, StyleSheet, Text,
    TouchableOpacity, useWindowDimensions, View, Image,
    TextInput,
    ScrollView,
    Platform,
    StatusBar,
    Pressable,
    Switch
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, FONT, SIZES, ENDPOINT } from '../../../constants/theme'
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from "expo-secure-store"
import MediaBtn from '../PostActionComps/MediaBtn';
import { Feather } from '@expo/vector-icons';
import PostMediaLoading from '../../Loading/PostMediaLoading';
import { useDispatch, useSelector } from 'react-redux';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { setPost } from "../../../state/post/postSlice"
import LocationBtn from '../PostActionComps/LocationBtn';
import { FontAwesome5 } from '@expo/vector-icons';
import ShowTagModal from "../../Modals/ShowTagModal"
import TagBtn from '../PostActionComps/TagBtn';
import MentionScreen from '../PostCommonComps/MentionScreen';
import { resetMedia, setMedia } from '../../../state/camera/cameraSlice';
import { customFetch } from "../../../utility/tokenInterceptor"
import { useToast } from 'react-native-toast-notifications';
import { isMediaSizeAllowedMultiple, isVideoDurationLessThanThirtySeconds } from '../../../utility/general';
import * as Haptics from 'expo-haptics';

const PostSetPage = () =>
{

    const { width } = useWindowDimensions();
    const [avatar, setAvatar] = useState(null)
    const [isDisabled, setIsDisabled] = useState(true)
    const [caption, setCaption] = useState("")
    const [selectedImages, setSelectedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [location, setLocation] = useState(null)
    const [sound, setSound] = useState();
    const [taggedUsers, setTaggedUsers] = useState([])
    const [showTagModal, setShowTagModal] = useState(false)
    const [storedUserId, setStoredUserId] = useState(null)
    const [openMentionModal, setOpenMentionModal] = useState(false)
    const [results, setResults] = useState([])  //api results
    const [isMediaBtnDisabled, setIsMediaBtnDisabled] = useState(false)
    const [isGlobal, setIsGlobal] = useState(true)

    const dispatch = useDispatch()
    const postData = useSelector(state => state.post)
    const mediaData = useSelector(state => state.camera);
    const toast = useToast()
    const [areMediaLimitsNotExceeded, setAreMediaLimitsNotExceeded] = useState(false)


    async function playSound()
    {

        const { sound } = await Audio.Sound.createAsync(require('../../../assets/audios/post-success.mp3')
        );
        setSound(sound);


        await sound.playAsync();
    }

    const handleImagePress = (index) =>
    {
        removeImage(index); // Remove the image instead of opening the modal

    };

    const handleImagesSelected = (images) =>
    {
        setSelectedImages(prevImages => [...prevImages, ...images]);  // Update the parent's state with the selected images
    };

    const fetchAvatarAndUserIdFromStorage = async () =>
    {
        const profilePic = await SecureStore.getItem("__avatar")
        const storedId = await SecureStore.getItem("__userId")
        setAvatar(profilePic)
        setStoredUserId(storedId)
    }

    useEffect(() =>
    {
        fetchAvatarAndUserIdFromStorage()
        setIsMediaBtnDisabled(false)

    }, [avatar, storedUserId])

    const handleTextChange = (text) =>
    {
        if (text[text?.length - 1] === "@")
        {
            setOpenMentionModal(true)
        }

        const trimmedText = text.trim()
        setCaption(text);

        if (trimmedText)
        {
            setIsDisabled(false); // Enable if the trimmed text is not empty
        } else
        {
            setIsDisabled(true); // Disable if the trimmed text is empty
        }
    };

    const handleMentionedUser = (text) =>
    {
        setCaption(caption + text.username)
    }

    const handleLoadingState = (state) =>
    {
        setIsLoading(state)
    }

    const handleDisablePostBtnState = (state) =>
    {
        setIsDisabled(state)
    }

    const handleLocationState = (locationName) =>
    {
        setLocation(locationName)
    }

    const handleTaggedUsers = (newUser) =>
    {

        if (newUser.userId == storedUserId)
        {
            return;
        }

        const updatedData = Array.from(
            new Set([...taggedUsers, newUser].map(JSON.stringify))
        ).map(JSON.parse);

        setTaggedUsers(updatedData)

    };

    const handleRemoveTaggedUser = (userIdToRemove) =>
    {
        // Create a new array to hold the filtered users
        let updatedTaggedUsers = [];

        // Iterate through the existing taggedUsers
        for (let i = 0; i < taggedUsers?.length; i++)
        {
            // If the current user ID doesn't match the one to remove, add it to the new array
            if (taggedUsers[i].userId !== userIdToRemove)
            {
                updatedTaggedUsers.push(taggedUsers[i]);
            }
        }

        // Update the state with the filtered array of users
        setTaggedUsers(updatedTaggedUsers);
    };



    const removeImage = (index) =>
    {
        setSelectedImages((prevImages) =>
        {
            const newImages = [...prevImages]; // Create a copy of the array
            newImages.splice(index, 1);        // Remove the image at the specified index
            return newImages;                  // Update the state with the new array
        });
    };

    const handleExtractImgSource = async () =>
    {

        const images = []

        selectedImages.forEach((image) =>
        {
            images.push(image.uri);
        })

        return images;
    }

    const checkMediaSize = async () =>
    {

        const isAllowed = await isMediaSizeAllowedMultiple(20, selectedImages);
        const isLessThan30Seconds = await isVideoDurationLessThanThirtySeconds(selectedImages);

        if (isAllowed && isLessThan30Seconds)
        {
            handleRedirectToHome()
        }
        else
        {
            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
            )
            toast.show("Media files must be 20MB or less. Videos within these files are limited to 30 seconds.", {
                placement: "top",
                duration: 5000
            })
        }

    }

    const handleRedirectToHome = async () =>
    {

        let extractedSources = [];
        const formData = new FormData()


        if (mediaData.media !== null)
        {
            setIsMediaBtnDisabled(true)
            formData.append('file', {
                uri: mediaData.media.uri,
                type: mediaData.media.mimeType,
                name: `captured_${Date.now()}.jpg`
            })
            extractedSources = [...extractedSources, mediaData.media.uri]
        }
        else
        {
            extractedSources = await handleExtractImgSource();

            for (let i = 0; i < selectedImages.length; i++)
            {

                formData.append('file', {
                    uri: selectedImages[i]?.uri,
                    type: selectedImages[i]?.mimeType,
                    name: selectedImages[i]?.fileName
                })
            }
        }

        const postDataRequest = {
            userId: SecureStore.getItem("__userId"),
            universityId: SecureStore.getItem("__universityId"),
            caption: caption.trim(),
            postType: "POST",
            isGlobal: isGlobal
        }

        formData.append('postDataRequest', JSON.stringify(postDataRequest));

        dispatch(
            setPost(
                {
                    avatar: await SecureStore.getItem("__avatar"),
                    name: await SecureStore.getItem("__firstName"),
                    type: "POST",
                    isPosting: true,
                    username: await SecureStore.getItem("__username"),
                    caption: caption.trim(),
                    isPremiumUser: await SecureStore.getItem("__isPremiumUser"),
                    role: await SecureStore.getItem("__role"),
                    userId: await SecureStore.getItem("__userId"),
                    authorName: await SecureStore.getItem("__firstName"),
                    source: extractedSources,
                    location: location,
                    taggedUsers: taggedUsers?.length === 0 ? null : taggedUsers,
                    postId: "some-id",
                    isGlobal: isGlobal
                }
            )
        )

        router.replace("/(tabs)/home/feeds")

        try
        {
            // Simulate backend upload (replace with actual API call in the future)
            // await uploadToBackend(formData); // Uncomment when ready to integrate with backend
            setIsDisabled(true)

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/post/newPost`, {
                method: "POST",
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.ok)
            {

                const data = await response.json()

                dispatch(
                    setPost(
                        {
                            avatar: await SecureStore.getItem("__avatar"),
                            name: await SecureStore.getItem("__firstName"),
                            type: "POST",
                            isPosting: true,
                            username: await SecureStore.getItem("__username"),
                            caption: caption.trim(),
                            isPremiumUser: await SecureStore.getItem("__isPremiumUser"),
                            role: await SecureStore.getItem("__role"),
                            userId: data.userId,
                            authorName: await SecureStore.getItem("__firstName"),
                            source: extractedSources,
                            posted: true,
                            location: location,
                            taggedUsers: taggedUsers?.length === 0 ? null : taggedUsers,
                            postId: data.postId,
                            isGlobal: isGlobal
                        }
                    )
                )

                await playSound()
                setCaption(null)
                setSelectedImages(null)
                setLocation(null)
                setTaggedUsers(null)
                dispatch(resetMedia())

            }


        } catch (error)
        {
            // Handle potential errors during the simulated upload
            toast.show("Something went wrong...", {
                placement: "top",
                duration: 3500,
                type: "normal"
            })
            dispatch(setPost({ ...postData, isPosting: false }));
        }

    }

    useEffect(() =>
    {
        setIsLoading(false)

    }, [selectedImages])

    useEffect(() =>
    {
        const handleGetInitialUsers = async () =>
        {
            try
            {

                const currentUserId = SecureStore.getItem("__userId");

                const response = await fetch(`${ENDPOINT.BASE_URL}/api/v2/search/getUsers?query=a&offset=0&pageSize=5&userId=${currentUserId}`);
                const data = await response.json();

                setResults(data)


            } catch (error)
            {
                console.error('Error fetching data:', error);
                setResults([]);
            }

        }

        handleGetInitialUsers()
    }, [])



    const handleOpenShowTagModal = () => setShowTagModal(true)
    const handleCloseShowTagModal = () => setShowTagModal(false)

    const handleCloseMentionModal = () => setOpenMentionModal(false)

    return (
        <SafeAreaView style={[styles.container, { width: width, alignItems: "center" }]}>
            <View style={[styles.header, { width: width - 32, marginTop: Platform.OS === "android" ? SIZES.large : 0 }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.btnTitle}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.postBtn, isDisabled && styles.disabledBtn]} onPress={checkMediaSize} disabled={(isDisabled && !isLoading)}>
                    <Text style={[styles.btnTitle, { color: COLORS.primary }]}>Post</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.capBtnCon}>

                {
                    !openMentionModal ? <View>
                        <View style={{ flexDirection: "row", width: width - 52, justifyContent: "flex-end", alignItems: "center" }}>
                            {
                                location ?
                                    <TouchableOpacity onPress={() => setLocation(null)} style={[styles.locationContainer]}>
                                        <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
                                            {location ? <FontAwesome5 name="map-pin" size={14} color={COLORS.whiteAccent} /> : null}
                                            <Text numberOfLines={1} style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize - 2, textAlign: "left", marginLeft: SIZES.xSmall - 2 }}>{location?.length > 16 ? location.substring(0, 22) : location}</Text>
                                        </View>
                                    </TouchableOpacity> : null
                            }
                            {/* {
                                taggedUsers?.length > 0 ? <View style={[styles.locationContainer, { marginLeft: SIZES.medium }]}>
                                    <TouchableOpacity onPress={handleOpenShowTagModal} style={{ flexDirection: "row" }}>
                                        {taggedUsers?.length > 0 ? <MaterialCommunityIcons name="tag-plus-outline" size={14} color={COLORS.whiteAccent} /> : null}
                                        <Text numberOfLines={1} style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize - 2, textAlign: "left", marginLeft: SIZES.xSmall - 2 }}>{`${taggedUsers?.length} tagged`}</Text>
                                    </TouchableOpacity>
                                </View> : null
                            } */}

                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: SIZES.small, marginLeft: SIZES.small + 2 }}>
                                <Text style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize - 2, textAlign: "left", marginRight: SIZES.xSmall - 2 }}>Post globally?</Text>
                                <Switch value={isGlobal} onChange={() => setIsGlobal(!isGlobal)} />
                            </View>

                        </View>

                        <View style={[styles.captionContainer, { width: width - 32 }]}>

                            <View style={{ flexDirection: "row", height: "85%" }}>
                                <Image source={{ uri: avatar }} style={styles.profilePic}></Image>
                                {/* <TextInput style={[styles.captionBox]} multiline={true} placeholder="Have your say..." placeholderTextColor={COLORS.whiteAccent}></TextInput> */}
                                <View style={styles.captionBoxContainer}>
                                    <TextInput onChangeText={handleTextChange} value={caption} textAlignVertical="top" placeholderTextColor={COLORS.whiteAccent} style={styles.captionBox} multiline={true} placeholder="What's cookin', good lookin'?" autoFocus />
                                </View>
                            </View>



                            {
                                isLoading ? <View style={{ position: "absolute", bottom: 75, alignSelf: "flex-start", paddingLeft: SIZES.large }}>
                                    <PostMediaLoading />
                                </View>
                                    :
                                    <View style={[styles.mediaContainer, { width: width - 32 }]}>

                                        {(selectedImages?.length > 0) ? (
                                            <ScrollView
                                                keyboardShouldPersistTaps={'always'}
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                scrollEventThrottle={16}
                                                contentContainerStyle={styles.imageContainer}

                                            >
                                                {selectedImages.map((asset, index) => (
                                                    <Pressable key={index} onPress={() => handleImagePress(index)}>
                                                        <Image
                                                            source={{
                                                                uri: asset.type === "video"
                                                                    ? asset.thumbnailUri
                                                                    : asset.uri
                                                            }}
                                                            style={styles.selectedImageStyle}
                                                        />
                                                        {
                                                            asset.type === "video" ?
                                                                <View style={styles.videoIcon}>
                                                                    <Feather name="video" size={24} color={COLORS.tertiary} />
                                                                </View>
                                                                : null
                                                        }
                                                        <View style={styles.removeIconHolder}>
                                                            <AntDesign name="minus" size={14} color={"red"} />
                                                        </View>
                                                    </Pressable>
                                                )
                                                )}
                                            </ScrollView>
                                        )
                                            : mediaData.media !== null ?
                                                <Pressable>
                                                    <Image
                                                        source={{
                                                            uri: mediaData.mediaType === "VIDEO"
                                                                ? mediaData.thumbnail
                                                                : mediaData.media.uri
                                                        }}
                                                        style={styles.selectedImageStyle}
                                                    />
                                                    {
                                                        mediaData.mediaType === "VIDEO" ?
                                                            <View style={styles.videoIcon}>
                                                                <Feather name="video" size={24} color={COLORS.tertiary} />
                                                            </View>
                                                            : null
                                                    }
                                                    <View style={styles.removeIconHolder}>
                                                        <AntDesign name="minus" size={14} color={"red"} />
                                                    </View>
                                                </Pressable>
                                                : null}
                                    </View>
                            }

                            <View style={styles.btnContainer}>

                                <MediaBtn widthSize={"45%"} types={["images", "videos"]} title={"Media"} bgColor={COLORS.primary} isDisabled={isMediaBtnDisabled} onImagesSelected={handleImagesSelected} handleDisablePostBtnState={handleDisablePostBtnState} handleLoadingState={handleLoadingState} mediaLimit={5 - selectedImages?.length} />

                                {/* <LocationBtn widthSize={"45%"} handleLocation={handleLocationState} /> */}

                                {/* <TagBtn listOfTaggedUsers={taggedUsers} handleTaggedUsers={handleTaggedUsers} /> */}

                            </View>

                        </View>

                        <View>
                            {
                                showTagModal && <ShowTagModal shouldRunFunction={true} handleRemoveTaggedUser={handleRemoveTaggedUser} taggedUsers={taggedUsers} isVisible={showTagModal} onClose={handleCloseShowTagModal} />
                            }
                        </View>
                    </View> : <MentionScreen initialMentionUsers={results} username={caption[caption?.length - 1]} onClose={handleCloseMentionModal} handleSetMentionedUser={handleMentionedUser} />
                }

            </View>

        </SafeAreaView >
    )
}

export default PostSetPage

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    header: {
        width: "100%",
        paddingVertical: SIZES.small,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    backBtn: {
        backgroundColor: COLORS.textAccent,
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.xxLarge,
        borderRadius: SIZES.medium,
        textAlign: "center"
    },
    postBtn: {
        backgroundColor: COLORS.tertiary,
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.xxLarge,
        borderRadius: SIZES.medium,
        textAlign: "center"
    },
    title: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: SIZES.large
    },
    profilePic: {
        height: 48,
        width: 48,
        borderRadius: 48 / 2,
        objectFit: "cover"

    },
    captionContainer: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: COLORS.textAccent,
        paddingHorizontal: SIZES.small,
        paddingBottom: SIZES.small,
        borderRadius: SIZES.medium,
        marginTop: SIZES.small
    },
    captionBoxContainer: {
        width: "90%",
        padding: SIZES.xSmall,
    },
    captionBox: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        width: "100%",
        height: "60%",
    },
    btnContainer: {
        height: "15%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",

    },
    capBtnCon: {
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.medium,
        flexDirection: "column",
        flex: 0.6
    },
    actionBtn: {
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.xLarge,
        width: "30%",
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.medium
    },
    disabledBtn: {
        // backgroundColor: "#989898"
        backgroundColor: "gray"
    },
    btnTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.tertiary
    },
    mediaContainer: {
        alignItems: "center",
        justifyContent: "flex-start",
        alignSelf: "center",
        flexDirection: "row",
        position: "absolute",
        paddingHorizontal: SIZES.medium,
        bottom: 75,
        zIndex: 5,

    },
    selectedImageStyle: {
        height: 92,
        width: 92,
        borderRadius: SIZES.medium,
        marginRight: SIZES.small,
        position: "relative",
        backgroundColor: COLORS.primary
    },
    imageContainer: {
        flexDirection: 'row', // Arrange images in a row (horizontal)
        // Add some margin above the contain
    },
    removeIconHolder: {
        position: "absolute",
        right: 10,
        backgroundColor: "#fef3f2",
        height: 18,
        width: 18,
        borderRadius: 9,
        justifyContent: "center",
        alignItems: "center"
    },
    videoIcon: {
        position: "absolute",
        left: 7
    },
    locationContainer: {
        flexDirection: "row",
        marginTop: SIZES.small,
        justifyContent: "flex-end"
    },
    mediaWarning: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.warning,
        alignSelf: "center",
        marginVertical: SIZES.xSmall
    }
})