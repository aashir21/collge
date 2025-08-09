// @Authored by : Muhammad Aashir Siddiqui

import { StyleSheet, Text, View, Image, TouchableOpacity, useWindowDimensions, Platform, ActivityIndicator, ImageBackground } from 'react-native'
import { COLORS, SIZES, FONT, NOTIFICATION_TYPES, ENDPOINT } from '../../constants/theme'
import React, { useEffect, useState } from 'react'
import { AntDesign, FontAwesome5, Ionicons, Feather, Fontisto, MaterialCommunityIcons, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { sendNotification } from '../../utility/notification';
import { fetchUserIdFromStorage } from '../../utility/general';
import { debounce } from 'lodash';
import { useToast } from 'react-native-toast-notifications';
import { customFetch } from '../../utility/tokenInterceptor';
import FriendRequestModal from '../Modals/FriendRequestResponseModal';
import RemoveFriendModal from '../Modals/RemoveFriendModal';
import { router, useSegments } from 'expo-router';
import * as SecureStore from "expo-secure-store"
import UserSettingsModal from '../Modals/UserSettingsModal';
import CaptionBox from '../General Component/CaptionBox';

const FrndProfileInfo = ({ avatar, firstName, numOfPosts, title, fire, universityName, username, reputation, role, isPremiumUser, universityId, userId, isWinkable, friendListUrl, campus, yearOfGraduation, bio }) =>
{

    const { width } = useWindowDimensions()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [friendStatus, setFriendStatus] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [isFriendResponseOpen, setIsFriendResponseOpen] = useState(false)
    const [isRemoveFriendModalOpen, setIsRemoveFriendModalOpen] = useState(false)

    const segments = useSegments()

    const handleOpenFriendStatusModal = () => setIsFriendResponseOpen(true)
    const handleCloseFriendStatusModal = () => setIsFriendResponseOpen(false)

    const handleOpenRemoveFriendModal = () => setIsRemoveFriendModalOpen(true)
    const handleCloseRemoveFriendModal = () => setIsRemoveFriendModalOpen(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const debouncedSendWinkNotification = debounce(async () =>
    {
        try
        {
            const storedUserId = fetchUserIdFromStorage();
            const actorId = parseInt(storedUserId);
            // setObject(prev => [...prev, { object: <Text>😉</Text> }]);

            const responseCode = await sendNotification(
                actorId,
                [userId.toString()],
                [universityId],
                "null",
                "null",
                "",
                NOTIFICATION_TYPES.WINK
            );

            if (responseCode === 200)
            {
                toast.show(`${firstName} winked!`, {
                    placement: "top",
                    duration: 3500,
                    swipeEnabled: true,
                    type: "normal",
                });
            }
        } catch (err)
        {
            console.error(err)
        }
    }, 500);

    const sendProfileVisitNotificationIfPremiumUser = async () =>
    {
        const storedUserId = fetchUserIdFromStorage();
        const actorId = parseInt(storedUserId);

        const responseCode = await sendNotification(
            actorId,
            [userId.toString()],
            [universityId],
            "null",
            "null",
            "",
            NOTIFICATION_TYPES.PROFILE_VISIT
        );
    }

    const handleGetFriendStatus = async () =>
    {
        try
        {
            const storedUserId = fetchUserIdFromStorage();

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/friend/getFriendRequestBySenderAndReceiverId?senderId=${storedUserId}&receiverId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok)
            {

                const data = await response.json()

                setFriendStatus(data.requestStatus)

                if (data.friendId == storedUserId && data.requestStatus === "PENDING")
                {
                    setFriendStatus("RESPOND")
                }

            }

        } catch (err)
        {
            toast.show("Something went wrong", {

                placement: "top",
                duration: 3000,
                type: "normal"

            })

            console.log(err);

        }

    }


    const handleSendFriendRequest = debounce(async () =>
    {

        try
        {
            const storedUserId = fetchUserIdFromStorage();
            const actorId = parseInt(storedUserId);

            setIsLoading(true)

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/friend/send?senderId=${storedUserId}&receiverId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok)
            {

                const data = await response.text()

                setFriendStatus(data)

                if (data)
                {
                    sendNotification(
                        actorId,
                        [userId.toString()],
                        [universityId],
                        "null",
                        "null",
                        "",
                        NOTIFICATION_TYPES.FRIEND_REQUEST
                    )
                }
                else
                {
                    handleCancelNotification();
                }

            }
        } catch (err)
        {
            toast.show("Could not send friend request", {

                placement: "top",
                duration: 3000,
                type: "normal"

            })

            console.error(err)
        } finally
        {
            setIsLoading(false)
        }

    }, 350)

    const handleCancelNotification = async () =>
    {

        try
        {
            const storedUserId = fetchUserIdFromStorage();

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/notification?senderId=${storedUserId}&receiverId=${userId}&notificationType=${NOTIFICATION_TYPES.FRIEND_REQUEST}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (err)
        {
            toast.show("Could not un-send friend request", {

                placement: "top",
                duration: 3000,
                type: "normal"

            })
        }

    }

    const handleCallMethodOnFriendStatusType = () =>
    {

        if (friendStatus === "RESPOND")
        {
            handleOpenFriendStatusModal()
        }
        else if (friendStatus === "ACCEPTED")
        {
            handleOpenRemoveFriendModal()
        }
        else
        {
            handleSendFriendRequest()
        }

    }

    const updateFriendStatus = (newStatus) =>
    {

        setFriendStatus(newStatus)

    }

    const navigateToFriendsPage = () =>
    {

        const nextScreenUrl = friendListUrl ? friendListUrl : `/${segments[0]}/${segments[1]}/friends/[id]`

        router.push({
            pathname: nextScreenUrl,
            params: { userId: userId }
        })

    }

    const navigateToChatRoom = () =>
    {

        const senderId = SecureStore.getItem("__userId")

        router.push({
            pathname: "chat/userChat/[id]",
            params: { senderId: senderId, recipientId: userId }
        })

    }

    useEffect(() =>
    {
        handleGetFriendStatus()
        if (isPremiumUser == true)
        {
            sendProfileVisitNotificationIfPremiumUser()
        }

    }, [])

    return (
        <View style={styles.container}>
            <View style={[styles.avatarContainer]}>
                <View style={{ position: "relative" }}>
                    <ImageBackground source={{ uri: avatar }} blurRadius={25}>
                        {
                            router.canGoBack() ? null :
                                <TouchableOpacity style={styles.routerResetBtn} onPress={() => router.replace("/(tabs)/home/feeds")}>
                                    <AntDesign name="close" size={32} color={COLORS.secondary}></AntDesign>
                                </TouchableOpacity>
                        }
                        <Image style={{ height: Platform.OS === "android" ? 275 : 250, width: width, resizeMode: "contain", position: "relative", objectFit: "contain", backgroundColor: "transparent" }} source={{ uri: avatar }}></Image>
                    </ImageBackground>
                    <View style={styles.profileOptionsBtnCon}>
                        <TouchableOpacity onPress={openModal} style={styles.profileOptionsBtn}>
                            <MaterialCommunityIcons style={styles.profBtnIcon} name="dots-horizontal" size={28} color={COLORS.tertiary} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.nameContainer, { width: width, paddingHorizontal: SIZES.large }]}>
                    <View style={{ alignItems: "center", flexDirection: "row", }}>
                        <Text style={[styles.name]}>{firstName}</Text>
                        {
                            isPremiumUser ? <Image style={styles.vBadge} source={require("../../assets/images/verified.png")}></Image> : null
                        }
                        {
                            role !== "USER" ? <Image style={styles.cBadge} source={require("../../assets/images/C.png")}></Image> : null
                        }
                    </View>
                    <Text style={styles.username}>@{username}</Text>
                </View>
            </View>
            <View style={[styles.bioContainer, { width: width - SIZES.xxLarge }]}>
                <View style={{ flex: 0.6, flexWrap: "no-wrap" }}>
                    <Text style={[styles.title, { width: width }]}>{title}</Text>
                    <Text numberOfLines={2} style={[styles.uniName]}>{universityName}</Text>
                </View>
                <View style={{ flex: 0.4, flexWrap: "no-wrap", alignItems: "flex-end", justifyContent: "flex-end", flexDirection: "row" }}>
                    <TouchableOpacity style={[styles.editBtn, { marginRight: SIZES.xSmall }]} onPress={handleCallMethodOnFriendStatusType}>

                        {
                            isLoading ? <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />

                                :
                                <View>
                                    {
                                        friendStatus === "PENDING" ? <View style={{ flexDirection: "row", alignItems: "center" }}>

                                            <Text style={{ fontSize: SIZES.small, alignItems: "center", color: COLORS.secondary, marginRight: 8 }}>Requested</Text>
                                            <MaterialCommunityIcons name="timer-sand" size={16} color={COLORS.tertiary} />

                                        </View>
                                            : friendStatus == "ACCEPTED" ? <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Text style={{ fontSize: SIZES.small, alignItems: "center", color: COLORS.secondary, marginRight: 8 }}>Friends</Text>
                                                <Feather name="user-check" size={16} color={COLORS.tertiary} />
                                            </View>
                                                : friendStatus === "RESPOND" ? <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{ fontSize: SIZES.small, alignItems: "center", color: COLORS.secondary, marginRight: 8 }}>Respond</Text>
                                                    <MaterialCommunityIcons name="progress-question" size={16} color={COLORS.tertiary} />
                                                </View>
                                                    : <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                        <Text style={{ fontSize: SIZES.small, alignItems: "center", color: COLORS.secondary, marginRight: 8 }}>Add Friend</Text>
                                                        <AntDesign name="adduser" size={16} color={COLORS.tertiary} />
                                                    </View>

                                    }
                                </View>
                        }

                    </TouchableOpacity>


                </View>
            </View>

            <View style={[styles.infoContainer, { width: width }]}>

                <View style={[styles.infoBar, { width: width - SIZES.xxLarge }]}>
                    <View>
                        <Text style={styles.infoVal}>{numOfPosts}</Text>
                        <Text style={styles.infoLabel}>Posts</Text>
                    </View>
                    <View>
                        <Text style={styles.infoVal}>{reputation}</Text>
                        <Text style={styles.infoLabel}>Reputation</Text>
                    </View>
                    <View>
                        <Text style={styles.infoVal}>{fire}</Text>
                        <Text style={styles.infoLabel}>Fire</Text>
                    </View>
                </View>

            </View>

            <View style={[styles.userBioDetailsContainer, { width: width - 32 }]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.infoTitle}>Bio</Text>
                    {
                        userId <= 100 &&
                        <Image style={styles.ogImage} source={require("../../assets/images/Group 2.png")} />
                    }
                </View>
                <CaptionBox caption={bio} propStyle={{ fontSize: SIZES.small }} />
                <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                    {
                        role === "USER" &&
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: SIZES.small }}>
                            <FontAwesome name="graduation-cap" size={22} color={COLORS.tertiary} />
                            <Text style={styles.secondaryInfoTitle}>Class of {yearOfGraduation}</Text>
                        </View>
                    }
                    {
                        role === "USER" &&
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: SIZES.small }}>
                            <FontAwesome6 name="building-user" size={20} color={COLORS.tertiary} />
                            <Text style={styles.secondaryInfoTitle}>{campus}</Text>
                        </View>
                    }
                </View>
            </View>


            <View style={[styles.profileBtnContainer, { width: width - 32 }]}>

                <TouchableOpacity onPress={navigateToFriendsPage} style={[styles.editBtn, { marginRight: SIZES.small }]}>
                    <Text style={{ color: COLORS.tertiary, fontSize: SIZES.small }}>Friends</Text>

                    <FontAwesome5 style={{ marginLeft: SIZES.small }} name="user-friends" size={18} color={COLORS.tertiary} />

                </TouchableOpacity>

                {
                    friendStatus === "ACCEPTED" &&
                    <TouchableOpacity style={styles.editBtn} onPress={navigateToChatRoom}>
                        <Text style={{ color: COLORS.tertiary, fontSize: SIZES.small }}>Message</Text>
                        <Feather style={{ marginLeft: SIZES.small }} name="message-circle" size={18} color={COLORS.tertiary} />
                    </TouchableOpacity>
                }

                {
                    isWinkable === true &&
                    <TouchableOpacity onPress={debouncedSendWinkNotification} style={[styles.editBtn, { marginLeft: SIZES.small }]}>
                        <Text style={{ color: COLORS.tertiary, fontSize: SIZES.small }}>Wink</Text>

                        <Fontisto style={{ marginLeft: SIZES.small }} name="wink" size={20} color={COLORS.tertiary} />
                    </TouchableOpacity>
                }

            </View>

            {
                isFriendResponseOpen && <FriendRequestModal isVisible={isFriendResponseOpen} onClose={handleCloseFriendStatusModal} firstName={firstName} universityId={universityId} userId={userId} updateFriendStatus={updateFriendStatus} />
            }

            {
                isRemoveFriendModalOpen && <RemoveFriendModal firstName={firstName} isVisible={isRemoveFriendModalOpen} onClose={handleCloseRemoveFriendModal} userId={userId} updateFriendStatus={updateFriendStatus} />
            }

            {
                isModalOpen && <UserSettingsModal isVisible={isModalOpen} onClose={closeModal} userId={userId} />
            }

        </View>
    )
}

export default FrndProfileInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
    },
    nameContainer: {
        flex: 1,
        position: "absolute",
        bottom: 0,
        paddingVertical: SIZES.medium
    },
    name: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.xxLarge,
        textAlign: "left",
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,

    },
    vBadge: {
        height: 18,
        width: 18,
        resizeMode: "cover",
        objectFit: "contain",
        marginLeft: SIZES.xSmall,
    },
    cBadge: {
        height: 18,
        width: 18,
        resizeMode: "cover",
        objectFit: "contain",
        marginLeft: 4,
    },
    username: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        textAlign: "left",
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,

    },
    userBioDetailsContainer: {

        alignSelf: "center",
        backgroundColor: COLORS.textAccent,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.large,
        marginTop: SIZES.medium,
        borderRadius: SIZES.large

    },
    ogImage: {
        width: 28,
        height: 28,
        objectFit: "contain",
        marginLeft: 8
    },
    infoTitle: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.large
    },
    secondaryInfoTitle: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.small,
        marginLeft: 8
    },
    avatarContainer: {

        // backgroundColor: "red"
    },
    profileOptionsBtnCon: {
        position: "absolute",
        right: 0,
        zIndex: 5,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: SIZES.medium
    },
    profileOptionsBtn: {
        height: 32,
        width: 32,
        borderRadius: 32 / 2,
        justifyContent: "center",
        alignItems: "center",

    },
    profBtnIcon: {
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 4,
    },
    bioContainer: {
        // backgroundColor: "green",
        flexDirection: "row",
        alignItems: "center",
        marginVertical: SIZES.medium
    },
    title: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.secondary,
        paddingHorizontal: 2,
        textAlign: "left",


    },
    uniName: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.tertiary,
        marginTop: 2,
        textAlign: "left",
        paddingHorizontal: 2,
    },
    editBtn: {
        backgroundColor: COLORS.textAccent,
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.medium,
        borderRadius: SIZES.small,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

    },

    infoContainer: {

        justifyContent: "flex-start",
        alignItems: "center",
        // backgroundColor: "green"
    },
    routerResetBtn: {

        padding: SIZES.small,
        position: "absolute",
        zIndex: 10
    },
    infoBar: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.large,
        padding: SIZES.large
        // borderTopRightRadius: SIZES.large,
        // borderBottomLeftRadius: SIZES.large,
    },
    infoLabel: {
        textAlign: "center",
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.tertiary
    },
    infoVal: {
        textAlign: "center",
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.tertiary
    },
    profileBtnContainer: {
        marginTop: SIZES.medium,
        marginBottom: SIZES.xxLarge,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },

})