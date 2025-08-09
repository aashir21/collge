import { StyleSheet, Text, useWindowDimensions, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, FONT, REPORT_REQUEST_TYPES, SIZES } from '../../constants/theme'
import { MaterialIcons } from '@expo/vector-icons';
import { navigateToReportPage } from '../../utility/navigation';

const SetTab = ({ postId, userId, onClose, type }) =>
{
    const { width } = useWindowDimensions()

    return (
        <TouchableOpacity onPress={() =>
        {
            onClose()
            navigateToReportPage({ reportPostId: postId, reportType: type, reportUserId: userId })
        }} style={[styles.container, { width: width - 32 }]}>
            <View style={styles.innerContainer}>
                <MaterialIcons name="report-gmailerrorred" size={24} color={COLORS.error} />
                <Text style={styles.tabName}>Report</Text>
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