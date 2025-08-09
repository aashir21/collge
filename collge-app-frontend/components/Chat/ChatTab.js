import { StyleSheet, Text, View, Pressable, Image, useWindowDimensions } from 'react-native'
import React from 'react'
import { SIZES, FONT, COLORS } from '../../constants/theme'
import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import * as SecureStore from "expo-secure-store"
import useTimeSince from "../../hooks/useTimeSince"

const ChatTab = ({ recipientId, firstName, lastName, avatar, premiumUser, role, lastActivity }) =>
{

    const { width } = useWindowDimensions()
    const activityTime = useTimeSince(lastActivity);

    const navigateToChatRoom = () =>
    {

        const senderId = SecureStore.getItem("__userId")

        router.push({
            pathname: "chat/userChat/[id]",
            params: { senderId: senderId, recipientId: recipientId }
        })

    }

    return (
        <Pressable onPress={navigateToChatRoom}>
            <View style={[styles.container, { flexDirection: "row", backgroundColor: COLORS.lightBlack, width: width - 32, alignSelf: "center" }]}>
                <View style={styles.searchTabCon}>
                    <View>
                        <Image source={{ uri: avatar }} style={styles.searchTabImg}></Image>
                    </View>

                    <View style={{ marginHorizontal: SIZES.medium }}>
                        <View style={{ flexDirection: "row" }}>
                            <View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={styles.searchTabName}>{firstName || "Deleted"} {lastName || "User"}</Text>
                                    {
                                        premiumUser == true ? <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image> : null
                                    }
                                    {
                                        role === "ADMIN" ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ justifyContent: "center", alignItems: "flex-end" }}>
                    <Text style={{ fontFamily: FONT.regular, color: COLORS.whiteAccent, fontSize: SIZES.small }}>{activityTime}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default ChatTab

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.large,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.small,
        marginTop: SIZES.xSmall
    },

    searchTabCon: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
    },
    searchTabImg: {
        height: 48,
        width: 48,
        borderRadius: 48 / 2,
        objectFit: "cover",
        backgroundColor: COLORS.primary
    },
    searchTabName: {
        fontFamily: FONT.bold,
        fontSize: SIZES.medium - 2,
        color: COLORS.tertiary,
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
    }
})