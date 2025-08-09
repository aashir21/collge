import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, ENDPOINT, FONT, NOTIFICATION_TYPES, SIZES } from '../../constants/theme'
import { FontAwesome5 } from '@expo/vector-icons';
import ProfileHeader from '../Posts/ProfileHeader';
import CollabProfileHeader from '../Posts/CollabProfileHeader';
import useTimeSince from '../../hooks/useTimeSince';
import { customFetch } from '../../utility/tokenInterceptor';
import LinkUpSettingsModal from "../Modals/LinkUpSettingsModal"
import { fetchUserIdFromStorage } from '../../utility/general';
import { useToast } from 'react-native-toast-notifications';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { sendNotification } from '../../utility/notification';
import { debounce } from 'lodash';
import * as SecureStore from "expo-secure-store"
import LinkUpSoloProfileHeader from '../Posts/LinkUpSoloProfileHeader';
import { router, useSegments } from 'expo-router';

const LinkUpCard = ({ userId, friendId, author, time, date, location, caption, invitedUser, createdAt, isLocationHidden, postId, collaborativeRequestStatus, status }) =>
{

    const { width } = useWindowDimensions()
    const timeSince = useTimeSince(createdAt);
    const [interestStatus, setInterestStatus] = useState(null)
    const [isDisabled, setIsDisabled] = useState(true)
    const [isDeleted, setIsDeleted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const currentRequestStatus = useRef("NOT_INTERESTED")
    const [isModalVisible, setIsModalVisible] = useState(false)
    const segments = useSegments()

    const toast = useToast();

    const showModal = () => setIsModalVisible(true);
    const hideModal = () => setIsModalVisible(false);

    const deletePost = () => setIsDeleted(true)

    const navigateToLinkUpProfile = () =>
    {
        router.push({
            pathname: `/${segments[0]}/${segments[1]}/linkupprofile/[id]`,
            params: { userId: userId }
        })
    }

    const checkLinkUpInterestByUserId = async () =>
    {

        try
        {
            const currentUserId = await fetchUserIdFromStorage()
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/linkup/isLinkUpInterestPresent?postId=${postId}&userId=${currentUserId}`, {
                method: "GET"
            })

            if (response.ok)
            {
                const data = await response.text()
                setInterestStatus(data);
                setIsDisabled(false)

                currentRequestStatus.current = data;

            }
        } catch (err)
        {
            toast.show("Something went wrong", {
                type: "normal",
                duration: 3500,
                placement: "top"
            })
        }
    }

    const createLinkUpInterestRequest = debounce(async () =>
    {

        setIsLoading(true)

        try
        {

            const currentUserId = await fetchUserIdFromStorage()
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/linkup/createLinkUpRequest?postId=${postId}&userId=${currentUserId}`, {
                method: "POST"
            })

            if (response.ok)
            {
                const data = await response.text()
                setInterestStatus(data);
                currentRequestStatus.current = data;

                if (currentRequestStatus.current === "INTERESTED")
                {

                    const actorId = parseInt(currentUserId)
                    const receiverId = userId.toString()
                    sendNotification(actorId, new Array(receiverId), [null], null, "null", "", NOTIFICATION_TYPES.LINKUP_INTEREST)

                }
            }

            if (response.status === 400 || response.status === 404)
            {
                setIsDeleted(true)

                toast.show("LinkUp was either deleted or matched with someone else", {
                    type: "normal",
                    duration: 3500,
                    placement: "top"
                })
            }

        } catch (er)
        {
            toast.show("Something went wrong", {
                type: "normal",
                duration: 3500,
                placement: "top"
            })

            console.log(err);

        }
        finally
        {
            setIsLoading(false)
        }

    }, 350)

    useEffect(() =>
    {

        checkLinkUpInterestByUserId()

    }, [])

    return (
        <View>
            {
                !isDeleted ? <View style={[styles.container, { width: width - 32 }]}>

                    <View>
                        {
                            invitedUser ? <CollabProfileHeader collabRequestStatus={collaborativeRequestStatus} createdAt={timeSince} userId={userId} name={author?.authorFirstName} value={author?.authorUniName} profilePicUri={author?.authorAvatar} invitedUserName={invitedUser?.friendFirstName} invitedUserProfilePicUri={invitedUser?.friendAvatar} invitedUserId={friendId} invitedUserUni={invitedUser?.friendUniName} showModal={showModal} postId={postId} />
                                : <LinkUpSoloProfileHeader userId={userId} name={author?.authorFirstName} value={author?.authorUniName} profilePicUri={author?.authorAvatar} createdAt={timeSince} showModal={showModal} />
                        }

                        {
                            collaborativeRequestStatus === "PENDING" && <Text style={styles.collabStatusTitle}>This post is awaiting {invitedUser?.friendFirstName}'s collaboration response.</Text>
                        }

                        <View style={{ marginVertical: SIZES.medium }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>

                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={styles.timeHeader}>Time: </Text>
                                    <Text style={styles.time}>{date} , {time}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginHorizontal: SIZES.medium }}>
                                    <FontAwesome5 name="map-pin" size={14} color={COLORS.tertiary} />
                                    <Text style={styles.location} numberOfLines={1}>{isLocationHidden ? "Hidden" : location.length > 16 ? location.substring(0, 16) : location}</Text>
                                </View>
                            </View>
                            <Text style={styles.linkUptext}>{caption}</Text>
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                            <TouchableOpacity onPress={createLinkUpInterestRequest} disabled={(userId == SecureStore.getItem("__userId") || status === "CLOSED") || isDisabled} style={[styles.actionBtn, { opacity: (userId == SecureStore.getItem("__userId") || status === "CLOSED") ? 0.4 : 1 }]}>
                                {
                                    isLoading ? <ActivityIndicator color={COLORS.whiteAccent} size={"small"} />
                                        :
                                        <View>
                                            {
                                                interestStatus === "INTERESTED" ? <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                                    <Text style={[styles.btnTitle, { marginRight: 8 }]}>Interested</Text>
                                                    <FontAwesome6 name="check" size={14} color={COLORS.secondary} />
                                                </View>
                                                    :

                                                    <Text style={styles.btnTitle}>LinkUp</Text>
                                            }
                                        </View>
                                }
                            </TouchableOpacity>

                            <TouchableOpacity onPress={navigateToLinkUpProfile} style={[styles.actionBtn]}>
                                <Text style={styles.btnTitle}>View Profile</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                    {isModalVisible && (
                        <LinkUpSettingsModal userId={userId} postId={postId} isVisible={isModalVisible} sourceScreen={"HOME"} onClose={hideModal} deletePost={deletePost} />
                    )}

                </View>
                    : null
            }
        </View>
    )
}

export default LinkUpCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.large,
        marginTop: SIZES.medium,
        padding: SIZES.large,
        alignSelf: "center"
    },
    userName: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.tertiary,
        marginHorizontal: SIZES.small
    },
    userUni: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.secondary,
        marginHorizontal: SIZES.small,
    },
    userImage: {
        height: 48,
        width: 48,
        borderRadius: 48 / 2,
        objectFit: "cover",
    },
    location: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.whiteAccent,
        marginLeft: 6
    },
    timePosted: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.whiteAccent
    },
    timeHeader: {

        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        color: COLORS.tertiary

    },
    time: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        color: COLORS.whiteAccent
    },
    linkUptext: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        color: COLORS.tertiary,
        marginVertical: SIZES.small
    },
    collabStatusTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.warning,
        marginTop: SIZES.medium
    },
    actionBtn: {
        backgroundColor: COLORS.primary,
        width: "45%",
        paddingVertical: SIZES.medium,
        borderRadius: SIZES.large
    },
    btnTitle: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: 13,
        textAlign: "center"
    }
})