import { StyleSheet, Text, useWindowDimensions, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const EditTab = () =>
{
    const { width } = useWindowDimensions()

    return (
        <View style={[styles.container, { width: width - 32 }]}>
            <View style={styles.innerContainer}>
                <AntDesign name="edit" size={22} color={COLORS.tertiary} />
                <Text style={styles.tabName}>Edit Post</Text>
            </View>
        </View>
    )
}

export default EditTab

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