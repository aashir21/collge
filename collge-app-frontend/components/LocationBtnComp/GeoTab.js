import { Keyboard, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { FontAwesome6 } from '@expo/vector-icons';

const GeoTab = ({ name, handleLocation, onClose }) =>
{
    const { width } = useWindowDimensions()

    const handleLocationState = async () =>
    {
        handleLocation(name)
        onClose()
    }

    return (
        <TouchableOpacity onPress={handleLocationState} style={[styles.container, { width: width - 32 }]}>
            <FontAwesome6 name="tree-city" size={18} color={COLORS.tertiary} />
            <Text style={styles.locationName} numberOfLines={1}>{name}</Text>
        </TouchableOpacity>
    )
}

export default GeoTab

const styles = StyleSheet.create({

    container: {
        alignSelf: "center",
        backgroundColor: COLORS.lightBlack,
        marginVertical: 4,
        paddingVertical: SIZES.large,
        paddingHorizontal: SIZES.small,
        borderRadius: SIZES.medium,
        alignItems: "center",
        flexDirection: "row"
    },
    locationName: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        marginHorizontal: SIZES.small
    }
})