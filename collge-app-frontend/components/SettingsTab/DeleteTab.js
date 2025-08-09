import { Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DeleteTab = () =>
{
    const { width } = useWindowDimensions()

    return (
        <View style={[styles.container, { width: width - 32 }]}>
            <View style={styles.innerContainer}>
                <MaterialCommunityIcons name="delete-outline" size={22} color={COLORS.error} />
                <Text style={styles.tabName}>Delete Post</Text>
            </View>
        </View>
    )
}

export default DeleteTab

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