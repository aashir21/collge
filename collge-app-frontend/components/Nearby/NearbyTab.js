import { StyleSheet, Text, View, useWindowDimensions, Image, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT, NOTIFICATION_TYPES, SIZES } from '../../constants/theme'
import Entypo from '@expo/vector-icons/Entypo';
import { router } from "expo-router"
import useTimeSince from "../../hooks/useTimeSince"
import { sendNotification } from '../../utility/notification';
import * as SecureStore from "expo-secure-store"

const NearbyTab = ({ userId, avatar, username, firstName, lastName, isPremiumUser, role, lastTimeAtLocation, uniName }) =>
{

    const { width } = useWindowDimensions()
    const timeSince = useTimeSince(lastTimeAtLocation)
    const [isDisabled, setIsDisabled] = useState(false)

    const navigateToProfile = () =>
    {

        router.push({
            pathname: "/(tabs)/home/user/[id]",
            params: { id: userId }
        })

    }

    const winkAtuser = async () =>
    {

        const currentUserId = SecureStore.getItem("__userId")

        await sendNotification(currentUserId, [userId], [null], null, "null", "", NOTIFICATION_TYPES.WINK);

        setIsDisabled(true)

    }

    return (
        <Pressable>
            <View style={[styles.container, { width: width - SIZES.large, flexDirection: "row" }]}>
                <View style={styles.searchTabCon}>
                    <Pressable onPress={navigateToProfile}>
                        <Image source={{ uri: avatar }} style={styles.searchTabImg}></Image>
                    </Pressable>

                    <View style={{ marginHorizontal: SIZES.medium }}>
                        <View style={{ flexDirection: "column" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                    <Pressable onPress={navigateToProfile}>
                                        <Text style={styles.searchTabName}>{firstName} {lastName}</Text>
                                    </Pressable>
                                    {
                                        isPremiumUser == "true" ? <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image> : null
                                    }
                                    {
                                        (role === "ADMIN" || role === "MANAGER") ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
                                    }
                                    <Text style={styles.time}>{timeSince}</Text>
                                </View>
                            </View>
                            <Pressable>
                                <Text style={styles.searchTabUsername}>@{username}</Text>
                            </Pressable>
                            <Text style={styles.uniName}>Studies at {uniName}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                                <TouchableOpacity disabled={isDisabled} onPress={winkAtuser} style={[styles.actionBtn, { opacity: isDisabled ? 0.5 : 1 }]}>
                                    <Text style={styles.btnTitle}>Wink</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={navigateToProfile} style={styles.actionBtn}>
                                    <Text style={styles.btnTitle}>View Profile</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

export default NearbyTab

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.large,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.small,
        marginTop: SIZES.xSmall,
        alignSelf: "center"
    },

    searchTabCon: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "80%"
    },
    searchTabImg: {
        height: 60,
        width: 60,
        borderRadius: 60 / 2,
        objectFit: "cover",
    },
    searchTabName: {
        fontFamily: FONT.bold,
        fontSize: SIZES.medium - 2,
        color: COLORS.tertiary
    },
    searchTabName: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        color: COLORS.tertiary
    },
    searchTabUsername: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.secondary
    },
    verified: {
        height: 12,
        width: 12,
        objectFit: "contain",
        marginLeft: 4
    },
    time: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.xSmall,
        marginHorizontal: 8
    },
    btnContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    actionBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.xLarge,
        borderRadius: SIZES.medium,
        marginRight: 8,
        alignSelf: "center"
    },
    btnTitle: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: SIZES.xSmall,
        textAlign: "center"
    },
    uniName: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.small,
        marginVertical: 4,
        textAlign: "left"
    }
})