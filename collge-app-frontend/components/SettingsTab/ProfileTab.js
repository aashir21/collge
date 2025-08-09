import { Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { AntDesign } from '@expo/vector-icons';
import { router, useSegments } from 'expo-router';

const SetTab = ({ userId, onClose, postType }) =>
{
    const { width } = useWindowDimensions()
    const segments = useSegments()

    const navigateToUserProfile = () =>
    {

        onClose()

        if (postType !== "CONFESSION")
        {
            router.push({
                pathname: `${segments[0]}/${segments[1]}/user/[id]`,
                params: { id: userId }

            })
        }

    }

    return (
        <TouchableOpacity onPress={navigateToUserProfile} style={[styles.container, { width: width - 32 }]}>
            <View style={styles.innerContainer}>
                <AntDesign name="user" size={22} color={COLORS.tertiary} />
                <Text style={styles.tabName}>View Profile</Text>
            </View>
        </TouchableOpacity>
    )
}

export default SetTab

const styles = StyleSheet.create({

    container: {
        alignSelf: "center",
        backgroundColor: COLORS.lightBlack,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.large,
        borderRadius: SIZES.large,
        marginBottom: SIZES.small
    },
    innerContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center"
    },
    tabName: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        marginHorizontal: SIZES.medium
    }

})