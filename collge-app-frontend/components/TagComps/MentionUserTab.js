import { StyleSheet, Text, View, useWindowDimensions, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { AntDesign, Entypo } from '@expo/vector-icons';


const MentionUserTab = ({ userId, avatar, firstName, lastName, username, premiumUser, role, bgColor, handleSetMentionedUser, onClose }) =>
{

    const { width } = useWindowDimensions()


    const handleCustomOnPress = () =>
    {
        handleSetMentionedUser({ username: username, userId: userId })
        onClose()
    }


    return (
        <Pressable onPress={handleCustomOnPress}>
            <View style={[styles.container, { width: width - SIZES.large - 32, flexDirection: "row", backgroundColor: bgColor }]}>
                <View style={styles.searchTabCon}>
                    <View>
                        <Image source={{ uri: avatar }} style={styles.searchTabImg}></Image>
                    </View>

                    <View style={{ marginHorizontal: SIZES.medium }}>
                        <View style={{ flexDirection: "row" }}>
                            <View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={styles.searchTabName}>{firstName} {lastName}</Text>
                                    {
                                        premiumUser == true ? <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image> : null
                                    }
                                    {
                                        role === "ADMIN" ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
                                    }
                                </View>
                                <Text style={styles.searchTabUsername}>@{username}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ justifyContent: "center", alignItems: "flex-end" }}>
                    <AntDesign name="plus" size={16} color={COLORS.sucess} />
                </View>
            </View>
        </Pressable>
    )
}

export default MentionUserTab

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
        fontSize: SIZES.medium - 4,
        color: COLORS.tertiary
    },
    searchTabUsername: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small - 2,
        color: COLORS.whiteAccent
    },
    verified: {
        height: 12,
        width: 12,
        objectFit: "contain",
        marginLeft: 4
    }
})