import { StyleSheet, Text, View, useWindowDimensions, Image, Pressable } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { Entypo } from '@expo/vector-icons';
import { router } from "expo-router"


const VoteResult = ({ userId, avatar, username, firstName, lastName, isPremiumUser, role }) =>
{

    const { width } = useWindowDimensions()

    const handleOnPress = async () =>
    {
        router.push({
            pathname: `/home/user/[id]`,
            params: { id: userId }
        })
    }

    return (
        <Pressable onPress={handleOnPress}>
            <View style={[styles.container, { width: width - SIZES.large, flexDirection: "row" }]}>
                <View style={styles.searchTabCon}>
                    <View>
                        <Image source={{ uri: avatar }} style={styles.searchTabImg}></Image>
                    </View>

                    <View style={{ marginHorizontal: SIZES.medium }}>
                        <View style={{ flexDirection: "column" }}>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Text style={styles.searchTabName}>{firstName} {lastName}</Text>
                                {
                                    isPremiumUser == "true" ? <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image> : null
                                }
                                {
                                    (role === "ADMIN" || role === "MANAGER") ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
                                }
                            </View>
                            <Text style={styles.searchTabUsername}>{username}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ justifyContent: "center", alignItems: "flex-end" }}>
                    <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                </View>
            </View>
        </Pressable>
    )
}

export default VoteResult

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.textAccent,
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
        width: "80%"
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
})