import { StyleSheet, Text, View, Pressable, Image, useWindowDimensions, TouchableOpacity, Platform, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import { SIZES, FONT, COLORS } from '../../constants/theme'
import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'

const ChatRoomHeader = ({ recipientId, firstName, lastName, role, premiumUser, avatar, username }) =>
{

    const { width } = useWindowDimensions()

    const navigateToRecipientProfile = () =>
    {

        router.push({
            pathname: "/chat/user/[id]",
            params: { id: recipientId, nextScreenUrl: "/chat/friends/[id]" }
        })

    }

    return (
        <Pressable>
            <View style={[styles.container, { flexDirection: "row", backgroundColor: COLORS.textAccent, width: width, alignItems: "center" }]}>

                <View>
                    {
                        router.canGoBack() ?
                            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                                <AntDesign name="left" size={24} color={COLORS.whiteAccent} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/(tabs)/home/feeds")}>
                                <AntDesign name="close" size={24} color={COLORS.whiteAccent} />
                            </TouchableOpacity>
                    }
                </View>

                <View style={styles.searchTabCon}>
                    <Pressable onPress={navigateToRecipientProfile}>
                        <Image source={{ uri: avatar }} style={styles.searchTabImg}></Image>
                    </Pressable>

                    <View style={{ marginHorizontal: SIZES.medium }}>
                        <View style={{ flexDirection: "row" }}>
                            <View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Pressable onPress={navigateToRecipientProfile}>
                                        <Text style={styles.searchTabName}>{firstName} {lastName}</Text>
                                    </Pressable>
                                    {
                                        premiumUser == true ? <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image> : null
                                    }
                                    {
                                        role === "ADMIN" ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
                                    }
                                </View>
                                <Pressable onPress={navigateToRecipientProfile}>
                                    <Text style={styles.searchTabUsername}>@{username}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

export default ChatRoomHeader

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SIZES.medium,
        paddingTop: Platform.OS === "android" ? 8 : 0,
        paddingBottom: SIZES.small
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
    },
    backBtn: {
        marginRight: 8,
    }

})