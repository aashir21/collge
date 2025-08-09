import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { Image } from 'expo-image'
import { router } from 'expo-router'

const UserFromUniversityCard = ({ userId, firstName, lastName, username, avatar, premiumUser, role }) =>
{

    const navigateToUserProfile = () =>
    {

        router.push({
            pathname: "/(tabs)/home/user/[id]",
            params: { id: userId }
        })

    }

    return (
        <View style={styles.container}>
            <View>
                <Pressable onPress={navigateToUserProfile}>
                    <Image style={styles.userImg} source={{ uri: avatar }} />
                </Pressable>
                <View style={styles.badges}>
                    {
                        premiumUser == true ? <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image> : null
                    }
                    {/* {
                        role === "ADMIN" ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
                    } */}
                </View>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                <Text style={styles.name}>{firstName} {lastName}</Text>
            </View>
            <Text style={styles.username}>@{username}</Text>
            <TouchableOpacity onPress={navigateToUserProfile} style={styles.actionBtn}>
                <Text style={{ color: COLORS.tertiary, fontFamily: FONT.regular, fontSize: SIZES.xSmall }}>View Profile</Text>
            </TouchableOpacity>
        </View>
    )
}

export default UserFromUniversityCard

const styles = StyleSheet.create({

    container: {
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.medium,
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.medium,
        width: "45%",
        marginHorizontal: SIZES.xSmall,
        marginBottom: SIZES.small,
    },
    userImg: {
        width: 72,
        height: 72,
        alignSelf: "center",
        borderRadius: 72 / 2,
        marginBottom: SIZES.medium,
        backgroundColor: COLORS.primary
    },
    name: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.fontBodySize,
        textAlign: "center"
    },
    username: {
        fontFamily: FONT.regular,
        color: COLORS.secondary,
        fontSize: SIZES.small,
        textAlign: "center"
    },
    verified: {
        height: 16,
        width: 16,
        objectFit: "contain",
        marginLeft: 4,
    },
    badges: {
        position: "absolute",
        flexDirection: "row",
        right: 37,
        bottom: 20
    },
    actionBtn: {
        alignSelf: "center",
        backgroundColor: COLORS.primary,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.small,
        borderRadius: SIZES.large,
        marginTop: SIZES.medium
    }

})