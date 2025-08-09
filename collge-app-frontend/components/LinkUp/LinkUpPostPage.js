import { Keyboard, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View, Switch, Platform } from 'react-native'
import React, { useState } from 'react'
import { COLORS, ENDPOINT, FONT, NOTIFICATION_TYPES, SIZES } from '../../constants/theme'
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import LocationBtn from "../Posts/PostActionComps/LocationBtn"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { convertMillisToReadbleTime, formatDate } from '../../utility/general';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Feather, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import SpanText from '../General Component/SpanText';
import LinkUpVerifiedUsersModal from '../Modals/LinkUpVerifiedUsersModal';
import { useToast } from 'react-native-toast-notifications';
import * as Haptics from 'expo-haptics';
import { useDispatch } from 'react-redux';
import { resetLinkUpPost, setLinkUpPost } from "../../state/linkup/linkupSlice"
import * as SecureStore from "expo-secure-store"
import { router } from 'expo-router';
import { sendNotification } from '../../utility/notification';
import { customFetch } from '../../utility/tokenInterceptor';
import { method } from 'lodash';

const LinkUpPostPage = () =>
{

    const { width } = useWindowDimensions()
    const [time, setTime] = useState(new Date())
    const [date, setDate] = useState(false)
    const [defaultTime, setDefaultTime] = useState(null)
    const [defaultDate, setDefaultDate] = useState(null)
    const [showTimeModal, setShowTimeModal] = useState(false)
    const [showDateModal, setShowDateModal] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const [isLocationHidden, setIsLocationHidden] = useState(false)
    const [location, setLocation] = useState(null)
    const [isLinkUpVerifiedUserModalOpen, setIsLinkUpVerifiedUserModalOpen] = useState(false)

    const [input, setInput] = useState("")
    const [invitedFriend, setInvitedFriend] = useState(null)
    const [isInviteAFriendBtnDisabled, setIsInviteAFriendBtnDisabled] = useState(false)

    const openLinkUpFriendsModal = () => setIsLinkUpVerifiedUserModalOpen(true)
    const closeLinkUpFriendsModal = () => setIsLinkUpVerifiedUserModalOpen(false)

    const toast = useToast()
    const dispatch = useDispatch()

    const onTimeBtnPress = () =>
    {

        if (Keyboard.isVisible)
        {
            Keyboard.dismiss()
        }

        setShowTimeModal(true)
    }

    const onDateBtnPress = () =>
    {

        if (Keyboard.isVisible)
        {
            Keyboard.dismiss()
        }

        setShowDateModal(true)
    }

    const handleConfirm = async (time) =>
    {
        setTime(time)
        setShowTimeModal(false)

        const formattedTime = await convertMillisToReadbleTime(time)
        setDefaultTime(formattedTime)
    };

    const handleDateConfirm = async (newDate) =>
    {
        setDate(newDate)
        setShowDateModal(false)

        const formattedDate = await formatDate(newDate)

        setDefaultDate(formattedDate)
    };

    const toggleIsLocationHidden = async () =>
    {
        setIsLocationHidden(!isLocationHidden)
    }

    const handleLocation = (newLocation) =>
    {
        setLocation(newLocation)
    }

    const handleInput = (newText) =>
    {
        const trimmedText = newText.trim(); // Trim the newText to remove leading/trailing spaces
        setInput(newText); // Update the input with the raw text

        if (trimmedText)
        {
            setIsDisabled(false); // Enable if the trimmed text is not empty
        } else
        {
            setIsDisabled(true); // Disable if the trimmed text is empty
        }
    };

    const inviteUserToLinkUp = (friend) =>
    {

        setInvitedFriend(friend)
        closeLinkUpFriendsModal()
        setIsInviteAFriendBtnDisabled(true)

    }

    const createLinkupPost = async () =>
    {

        const currentUserId = await SecureStore.getItem("__userId");

        const author = {
            authorFirstName: await SecureStore.getItem("__firstName"),
            authorUniName: null,
            authorAvatar: await SecureStore.getItem("__avatar"),
        }

        if (defaultDate === null)
        {
            toast.show("Please select a date", {
                type: "normal",
                placement: "top",
                duration: 3000
            })

            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
            )

            return;
        }

        if (defaultTime === null)
        {
            toast.show("Please select a time", {
                type: "normal",
                placement: "top",
                duration: 3000
            })

            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
            )

            return;
        }

        if (location === null)
        {
            toast.show("Please select a location", {
                type: "normal",
                placement: "top",
                duration: 3000
            })

            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
            )

            return;
        }

        dispatch(setLinkUpPost({
            userId: await SecureStore.getItemAsync("__userId"),
            author: author,
            isPosting: true,
            caption: input,
            posted: false,
            isPremiumUser: await SecureStore.getItemAsync("__isPremiumUser"),
            date: defaultDate,
            time: defaultTime,
            role: await SecureStore.getItemAsync("__role"),
            postId: "some-id",
            location: location,
            invitedUser: invitedFriend,
            isLocationHidden: isLocationHidden,
            collaborativeRequestStatus: invitedFriend !== null ? "PENDING" : "NOT_PENDING",
            responseStatus: 200
        }))

        try
        {

            toast.show("Creating LinkUp!", {
                placement: "top",
                duration: 3500,
                type: "normal"
            })

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/linkup`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUserId,
                    friendId: invitedFriend ? invitedFriend.userId : null,
                    universityId: await SecureStore.getItem("__universityId"),
                    caption: input,
                    date: defaultDate,
                    time: defaultTime,
                    location: location,
                    collaborativePost: invitedFriend ? true : false,
                    locationHidden: isLocationHidden

                })
            })

            if (response.ok)
            {

                const data = await response.json()

                dispatch(setLinkUpPost({
                    postId: data.postId,
                    userId: data.userId,
                    isPosting: true,
                    author: author,
                    caption: input,
                    posted: true,
                    isPremiumUser: await SecureStore.getItemAsync("__isPremiumUser"),
                    date: defaultDate,
                    time: defaultTime,
                    role: await SecureStore.getItemAsync("__role"),
                    location: location,
                    invitedUser: invitedFriend,
                    isLocationHidden: isLocationHidden,
                    responseStatus: 200,
                    collaborativeRequestStatus: invitedFriend !== null ? "PENDING" : "NOT_PENDING"

                }))

                router.replace("/(tabs)/linkup/linkups")


                if (invitedFriend)
                {
                    actorId = parseInt(currentUserId)
                    friendIdString = invitedFriend.userId.toString()
                    sendNotification(actorId, new Array(friendIdString), [0], null, "null", "", NOTIFICATION_TYPES.LINKUP_COLLAB_REQUEST)
                }

                toast.show("New LinkUp created!", {
                    placement: "top",
                    duration: 3500,
                    type: "normal"
                })

            }

            if (response.status === 409)
            {
                dispatch(setLinkUpPost({
                    userId: await SecureStore.getItemAsync("__userId"),
                    isPosting: true,
                    author: author,
                    caption: input,
                    posted: true,
                    isPremiumUser: await SecureStore.getItemAsync("__isPremiumUser"),
                    date: defaultDate,
                    time: defaultTime,
                    role: await SecureStore.getItemAsync("__role"),
                    postId: null,
                    location: location,
                    invitedUser: invitedFriend,
                    isLocationHidden: isLocationHidden,
                    responseStatus: 409,
                    collaborativeRequestStatus: invitedFriend !== null ? "PENDING" : "NOT_PENDING"

                }))

                toast.show("You have another active LinkUp post. Please delete the old one to create a new one", {
                    placement: "top",
                    duration: 3500,
                    type: "normal"
                })
            }


        } catch (error)
        {
            // Handle potential errors during the simulated upload
            toast.show("Couldnt create LinkUp", {
                duration: 3500,
                placement: "top",
                type: "normal"
            })
            // Reset posting state and potentially show an error message to the user
            dispatch(setLinkUpPost({ ...postData, isPosting: false }));
            // ... (consider showing an error notification)
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="always" style={{ width: width - 32, alignSelf: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SIZES.medium }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                        <View>
                            <Text style={styles.title}>A new <SpanText subtext={"adventure"} />!</Text>
                            <Text style={styles.subTitle}>Meet new people!</Text>
                        </View>
                        <TouchableOpacity onPress={createLinkupPost} style={[styles.postBtn, { opacity: isDisabled ? 0.4 : 1 }]} disabled={isDisabled}>
                            <MaterialCommunityIcons name="hook" size={14} color={COLORS.secondary} />
                            <Text style={styles.btnTitle}>Link</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <TouchableOpacity disabled={isInviteAFriendBtnDisabled} onPress={() => openLinkUpFriendsModal()} style={[styles.editProfileBtn, { opacity: isInviteAFriendBtnDisabled ? 0.4 : 1 }]}>
                        <AntDesign name="addusergroup" size={14} color={COLORS.tertiary} />
                        <Text style={styles.btnTitle}>Invite a friend</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: SIZES.small }}>
                        <Text style={{ color: COLORS.whiteAccent, fontSize: SIZES.xSmall, fontFamily: FONT.regular }}>Hide location?</Text>
                        <Switch onChange={toggleIsLocationHidden} value={isLocationHidden} style={{ marginLeft: SIZES.small }}></Switch>
                    </View>
                </View>

                <View style={styles.detailsContainer}>

                    <View style={{ marginVertical: SIZES.xSmall, alignSelf: "flex-end", flexDirection: "row" }}>
                        {
                            (location) &&
                            <TouchableOpacity onPress={() => setLocation(null)} style={{ marginHorizontal: SIZES.xSmall }}>
                                <View style={{ flexDirection: "row" }}>
                                    {location ? <FontAwesome5 name="map-pin" size={14} color={COLORS.whiteAccent} /> : null}
                                    <Text numberOfLines={1} style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.small - 2, textAlign: "left", marginLeft: 4 }}>{location?.length > 25 ? location.substring(0, 30) : location}</Text>
                                </View>
                            </TouchableOpacity>
                        }

                        {
                            (invitedFriend) &&
                            <TouchableOpacity onPress={() => { setInvitedFriend(null), setIsInviteAFriendBtnDisabled(false) }}>
                                <View style={{ flexDirection: "row" }}>
                                    {invitedFriend ? <AntDesign name="user" size={14} color={COLORS.whiteAccent} /> : null}
                                    <Text numberOfLines={1} style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.small - 2, textAlign: "left", marginLeft: 4 }}>{invitedFriend.firstName} {invitedFriend.lastName}</Text>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>

                    <TextInput onChangeText={(newText) => handleInput(newText)} style={[styles.captionBox]} textAlignVertical="top" placeholderTextColor={COLORS.whiteAccent} multiline={true} placeholder="Okay, where we off to?" autoFocus />

                    <View style={styles.btnContainer}>

                        <TouchableOpacity style={styles.linkUpOptionsBtn} onPress={onTimeBtnPress}>
                            <AntDesign name="clockcircleo" color={COLORS.secondary} style={{ marginRight: 6 }} size={16} />
                            {
                                defaultTime ? <Text style={styles.linkUpOptionsTitle}>{defaultTime}</Text>
                                    :
                                    <Text style={styles.linkUpOptionsTitle}>Set Time</Text>
                            }
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.linkUpOptionsBtn, { marginHorizontal: 4 }]} onPress={onDateBtnPress}>
                            <Fontisto name="date" color={COLORS.secondary} style={{ marginRight: 6 }} size={16} />
                            {
                                defaultDate ? <Text style={styles.linkUpOptionsTitle}>{defaultDate}</Text>
                                    :
                                    <Text style={styles.linkUpOptionsTitle}>Set Date</Text>
                            }
                        </TouchableOpacity>

                        <View>
                            <LocationBtn handleLocation={handleLocation} />
                        </View>
                    </View>
                </View>

                {
                    showTimeModal &&
                    <DateTimePickerModal
                        isVisible={showTimeModal}
                        mode="time"
                        onConfirm={handleConfirm}
                        onCancel={() => setShowTimeModal(false)}
                    />
                }

                {
                    showDateModal &&
                    <DateTimePickerModal
                        isVisible={showDateModal}
                        mode="date"
                        onConfirm={handleDateConfirm}
                        onCancel={() => setShowDateModal(false)}
                    />
                }

                {
                    isLinkUpVerifiedUserModalOpen && <LinkUpVerifiedUsersModal inviteUserToLinkUp={inviteUserToLinkUp} isVisible={isLinkUpVerifiedUserModalOpen} onClose={closeLinkUpFriendsModal} />
                }

            </ScrollView>
        </SafeAreaView>
    )
}

export default LinkUpPostPage

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 24 : 0
    },
    title: {
        color: COLORS.tertiary,
        fontSize: SIZES.xLarge + 2,
        fontFamily: FONT.bold
    },
    subTitle: {
        color: COLORS.whiteAccent,
        fontSize: SIZES.fontBodySize,
        fontFamily: FONT.regular
    },
    detailsContainer: {
        height: 275,
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.medium,
        paddingHorizontal: SIZES.medium
    },
    editProfileBtn: {
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.medium,

        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.small,
        alignSelf: "flex-start",
        marginVertical: SIZES.medium,
    },
    btnTitle: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: SIZES.xSmall,
        marginHorizontal: SIZES.xSmall
    },
    optionStyle: {
        color: COLORS.tertiary
    },
    captionBox: {
        color: COLORS.tertiary
    },
    btnContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        marginVertical: SIZES.small
    },
    linkUpOptionsBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.medium,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.large,
    },
    linkUpOptionsTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.tertiary
    },
    addPeopleBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: SIZES.small
    },
    addPeopleTitle: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.xSmall,
        marginHorizontal: 4
    },
    postBtn: {
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.medium,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.small,
        height: 40
    }
})