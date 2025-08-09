import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from 'react-native'
import React from 'react'
import { COLORS, SIZES, FONT } from '../../constants/theme'
import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'


const NotificationForYouListHeader = () =>
{
    const { width } = useWindowDimensions()

    return (
        <View>
            {
                !router.canGoBack() &&
                <TouchableOpacity style={styles.routerResetBtn} onPress={() => router.replace("/(tabs)/home/feeds")}>
                    <AntDesign name="close" size={24} color={COLORS.secondary}></AntDesign>
                </TouchableOpacity>
            }
            <TouchableOpacity onPress={() => router.push("/(tabs)/home/requests")} style={[styles.requestBtn, { width: width - 32 }]}>
                <View>
                    <Text style={styles.requestBtnTitle}>Requests</Text>
                    <Text style={styles.requestBtnSubtitle}>Friend & LinkUp requests</Text>
                </View>

                <AntDesign name="right" size={16} color={COLORS.whiteAccent} />

            </TouchableOpacity>
        </View>
    )
}

export default NotificationForYouListHeader

const styles = StyleSheet.create({

    requestBtn: {
        marginTop: SIZES.small,
        marginVertical: SIZES.xLarge,
        marginHorizontal: SIZES.medium,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    requestBtnTitle: {
        fontSize: SIZES.large,
        color: COLORS.tertiary,
        fontFamily: FONT.bold,
        textAlign: "left"
    },
    requestBtnSubtitle: {
        fontSize: SIZES.small,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        textAlign: "left"
    },
    routerResetBtn: {
        paddingHorizontal: SIZES.small,
    }
})