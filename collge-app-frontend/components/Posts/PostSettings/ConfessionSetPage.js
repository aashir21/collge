import
{
    SafeAreaView, StyleSheet, Text,
    TouchableOpacity, useWindowDimensions, View, Image,
    TextInput,
    Platform,
    StatusBar,
    Switch,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, FONT, SIZES, ENDPOINT } from '../../../constants/theme'

import { router } from 'expo-router';
import * as SecureStore from "expo-secure-store"
import { useDispatch, useSelector } from 'react-redux';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { setPost } from "../../../state/post/postSlice"
import LocationBtn from '../PostActionComps/LocationBtn';
import { FontAwesome5 } from '@expo/vector-icons';
import ShowTagModal from "../../Modals/ShowTagModal"
import TagBtn from '../PostActionComps/TagBtn';
import MentionScreen from '../PostCommonComps/MentionScreen';
import { customFetch } from '../../../utility/tokenInterceptor';

const PostSetPage = () =>
{

    const { width } = useWindowDimensions();
    const [avatar, setAvatar] = useState(null)
    const [isDisabled, setIsDisabled] = useState(true)
    const [caption, setCaption] = useState("")
    const [selectedImages, setSelectedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const [location, setLocation] = useState(null)
    const postData = useSelector(state => state.post)
    const [sound, setSound] = useState();
    const [taggedUsers, setTaggedUsers] = useState([])
    const [showTagModal, setShowTagModal] = useState(false)
    const [storedUserId, setStoredUserId] = useState(null)
    const [openMentionModal, setOpenMentionModal] = useState(false)
    const [results, setResults] = useState([])
    const [isGlobal, setIsGlobal] = useState(true)

    async function playSound()
    {

        const { sound } = await Audio.Sound.createAsync(require('../../../assets/audios/post-success.mp3')
        );
        setSound(sound);


        await sound.playAsync();
    }

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

    }, [avatar, storedUserId])

    const handleTextChange = (text) =>
    {
        if (text[text.length - 1] === "@")
        {
            setOpenMentionModal(true)
        }

        const trimmedText = text.trim()
        setCaption(text); // Update caption with the new text
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
        setCaption(caption + text)
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
        for (let i = 0; i < taggedUsers.length; i++)
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

    const handleExtractImgSource = async () =>
    {

        const images = []

        selectedImages.forEach((image) =>
        {

            images.push(image.uri);
        })

        return images;
    }



    const handleRedirectToHome = async () =>
    {

        let extractedSources = [];
        const formData = new FormData()

        const postDataRequest = {
            userId: SecureStore.getItem("__userId"),
            universityId: SecureStore.getItem("__universityId"),
            caption: caption.trim(),
            postType: "CONFESSION",
            isGlobal: isGlobal
        }

        formData.append('postDataRequest', JSON.stringify(postDataRequest));

        dispatch(
            setPost(
                {
                    avatar: await SecureStore.getItem("__avatar"),
                    name: await SecureStore.getItem("__firstName"),
                    type: "CONFESSION",
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
                            type: "CONFESSION",
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
                <TouchableOpacity style={[styles.postBtn, isDisabled && styles.disabledBtn]} onPress={handleRedirectToHome} disabled={isDisabled}>
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
                                        <View style={{ flexDirection: "row" }}>
                                            {location ? <FontAwesome5 name="map-pin" size={14} color={COLORS.whiteAccent} /> : null}
                                            <Text numberOfLines={1} style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize - 2, textAlign: "left", marginLeft: SIZES.xSmall - 2 }}>{location.length > 25 ? location.substring(0, 30) : location}</Text>
                                        </View>
                                    </TouchableOpacity> : null
                            }
                            {/* {
                                taggedUsers.length > 0 ? <View style={[styles.locationContainer, { marginLeft: SIZES.medium }]}>
                                    <TouchableOpacity onPress={handleOpenShowTagModal} style={{ flexDirection: "row" }}>
                                        {taggedUsers.length > 0 ? <MaterialCommunityIcons name="tag-plus-outline" size={14} color={COLORS.whiteAccent} /> : null}
                                        <Text numberOfLines={1} style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize - 2, textAlign: "left", marginLeft: SIZES.xSmall - 2 }}>{`${taggedUsers.length} tagged`}</Text>
                                    </TouchableOpacity>
                                </View> : null
                            } */}
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: SIZES.small, marginLeft: SIZES.small + 2 }}>
                                <Text style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize - 2, textAlign: "left", marginRight: SIZES.xSmall - 2 }}>Post globally?</Text>
                                <Switch value={isGlobal} onChange={() => setIsGlobal(!isGlobal)} />
                            </View>
                        </View>

                        <View style={[styles.captionContainer, { width: width - 32 }]}>

                            <View style={{ flexDirection: "row", height: "75%" }}>
                                <Image source={{ uri: avatar }} style={styles.profilePic}></Image>
                                {/* <TextInput style={[styles.captionBox]} multiline={true} placeholder="Have your say..." placeholderTextColor={COLORS.whiteAccent}></TextInput> */}
                                <View style={styles.captionBoxContainer}>
                                    <TextInput onChangeText={handleTextChange} value={caption} textAlignVertical="top" placeholderTextColor={COLORS.whiteAccent} style={styles.captionBox} multiline={true} placeholder="What's cookin', good lookin'?" autoFocus />
                                </View>
                            </View>

                            <View style={{ paddingHorizontal: SIZES.large, flexDirection: "row", alignItems: "center" }}>
                                <MaterialCommunityIcons name="information-outline" size={28} color={COLORS.whiteAccent} />
                                <Text style={{ color: COLORS.whiteAccent, fontSize: SIZES.fontBodySize, fontFamily: FONT.regular, paddingLeft: SIZES.small }}>All confessions are anonymous, your identity will be hidden</Text>
                            </View>


                            <View style={styles.btnContainer}>

                                {/* <LocationBtn widthSize={"45%"} handleLocation={handleLocationState} /> */}

                                {/* <TagBtn widthSize={"45%"} listOfTaggedUsers={taggedUsers} handleTaggedUsers={handleTaggedUsers} /> */}

                            </View>

                        </View>

                        <View>
                            {
                                showTagModal && <ShowTagModal shouldRunFunction={true} handleRemoveTaggedUser={handleRemoveTaggedUser} taggedUsers={taggedUsers} isVisible={showTagModal} onClose={handleCloseShowTagModal} />
                            }
                        </View>
                    </View> : <MentionScreen initialMentionUsers={results} username={caption[caption.length - 1]} onClose={handleCloseMentionModal} handleSetMentionedUser={handleMentionedUser} />
                }

            </View>

        </SafeAreaView>
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
        flex: 1,
        padding: SIZES.xSmall,

    },
    captionBox: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        width: "100%",
        height: "95%",

    },
    btnContainer: {
        // height: "15%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",

    },
    capBtnCon: {
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.medium,
        flexDirection: "column",
        flex: 0.5
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
        justifyContent: "center",
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
    }
})