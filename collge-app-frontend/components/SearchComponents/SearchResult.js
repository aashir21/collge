import { StyleSheet, Text, View, useWindowDimensions, Image, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { Entypo } from '@expo/vector-icons';
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { useToast } from 'react-native-toast-notifications';


const SearchResult = ({ userId, avatar, firstName, lastName, username, premiumUser, role, bgColor, cardOnPress, listOfTaggedUsers }) =>
{

    const { width } = useWindowDimensions()
    const [isDisabled, setIsDisabled] = useState(false)

    const toast = useToast()

    const getUserIdFromStorage = async (userId) =>
    {

        const storedUserId = await SecureStore.getItem("__userId");
        let isSelf = false;

        console.log(storedUserId == userId);

        if (storedUserId == userId)
        {
            toast.show("No self tagging!", {
                type: "nromal",
                placement: "top",
                duration: 3500,
                swipeEnabled: true
            })

            return;
        }

        setIsDisabled(true)
    }

    const handleOnPress = async () =>
    {
        router.push({
            pathname: `/home/user/[id]`,
            params: { id: userId }
        })
    }

    const handleCustomPress = async () =>
    {

        getUserIdFromStorage(userId)

        cardOnPress({
            userId: userId,
            avatar: avatar,
            firstName: firstName,
            lastName: lastName,
            username: username,
            premiumUser: premiumUser,
            role: role
        })

    }

    useEffect(() =>
    {

        if (listOfTaggedUsers !== null && listOfTaggedUsers !== undefined)
        {
            if (listOfTaggedUsers.find(user => user.userId === userId))
            {
                setIsDisabled(true)
            }
        }
    }, [])

    return (
        <Pressable style={{ opacity: isDisabled ? 0.3 : 1 }} disabled={isDisabled} onPress={cardOnPress ? handleCustomPress : handleOnPress}>
            <View style={[styles.container, { width: width - SIZES.large, flexDirection: "row", backgroundColor: bgColor }]}>
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
                    <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                </View>
            </View>
        </Pressable>
    )
}

export default SearchResult

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