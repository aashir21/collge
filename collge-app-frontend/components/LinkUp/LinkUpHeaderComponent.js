import { StyleSheet, Text, useWindowDimensions, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { router } from 'expo-router'
import * as SecureStore from "expo-secure-store"

const LinkUpHeaderComponent = () =>
{

    const { width } = useWindowDimensions()

    const navigateToLinkUpProfile = async () =>
    {

        const userId = await SecureStore.getItem("__userId");

        router.push({
            pathname: "/(tabs)/linkup/linkupprofile/[id]",
            params: { userId: userId }
        })

    }

    return (
        <View style={{ alignSelf: "center" }}>
            <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row", width: width - 32, alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={styles.linkUpTitle}>LinkUp</Text>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                    </View>

                    <View style={{ justifyContent: "flex-end", alignItems: "center" }}>
                        <TouchableOpacity onPress={navigateToLinkUpProfile} style={styles.createBtn}>
                            <MaterialCommunityIcons name="hook" size={14} color={COLORS.tertiary} />
                            <Text style={styles.createBtnText}>LinkUp Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Text style={styles.linkUpSubTitle}>Time to make new friends!</Text>
        </View>
    )
}

export default LinkUpHeaderComponent

const styles = StyleSheet.create({
    linkUpTitle: {
        color: COLORS.tertiary,
        fontFamily: FONT.bold,
        fontSize: SIZES.xxLarge,

    },
    createBtn: {
        borderRadius: SIZES.large,
        backgroundColor: COLORS.textAccent,
        padding: SIZES.small,
        flexDirection: "row",
        alignItems: "center"
    },
    createBtnText: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.small,
        marginHorizontal: 4
    },
    linkUpSubTitle: {
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
    },

})