import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { MaterialIcons } from '@expo/vector-icons';

const SetTab = () =>
{
    const { width } = useWindowDimensions()

    return (
        <View style={[styles.container, { width: width - 32 }]}>
            <View style={styles.innerContainer}>
                <MaterialIcons name="report-gmailerrorred" size={24} color={COLORS.tertiary} />
                <Text style={styles.tabName}>Report</Text>
            </View>
        </View>
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
        marginVertical: SIZES.medium
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