import { Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { FontAwesome } from '@expo/vector-icons';

const DeleteTab = () =>
{
    const { width } = useWindowDimensions()

    return (
        <TouchableOpacity style={[styles.container, { width: width - 32 }]}>
            <View style={styles.innerContainer}>
                <FontAwesome name="save" size={22} color={COLORS.secondary} />
                <Text style={styles.tabName}>Save Post</Text>
            </View>
        </TouchableOpacity>
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