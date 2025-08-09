import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, REPORT_TYPES, SIZES } from "../../constants/theme"
import ReportTab from './ReportTab'

const ReportScreen = () =>
{

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Report An Issue</Text>
            <Text style={styles.subTitle}>Your report is anonymous. We aim to resolve your problem within 24 hours.</Text>

            <ScrollView style={{ marginTop: SIZES.medium }}>

                <ReportTab title={"Bullying or unwanted contact"} type={REPORT_TYPES.BULLYING} />
                <ReportTab title={"Suicide, self-injury or eating disorders"} type={REPORT_TYPES.SELF_HARM} />
                <ReportTab title={"Violence, hate or exploitation"} type={REPORT_TYPES.VIOLENCE} />
                <ReportTab title={"Selling or promoting restricted items"} type={REPORT_TYPES.VIOLENCE} />
                <ReportTab title={"Nudity or sexual activity"} type={REPORT_TYPES.VIOLENCE} />
                <ReportTab title={"Scam or fraud"} type={REPORT_TYPES.SCAM} />
                <ReportTab title={"False information"} type={REPORT_TYPES.FALSE_INFORMATION} />
            </ScrollView>

        </SafeAreaView>
    )
}

export default ReportScreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    },
    title: {
        color: COLORS.tertiary,
        fontSize: SIZES.xxLarge,
        fontFamily: FONT.bold,
        paddingHorizontal: SIZES.large,
        paddingTop: SIZES.medium
    },
    subTitle: {
        color: COLORS.whiteAccent,
        fontSize: SIZES.fontBodySize,
        fontFamily: FONT.regular,
        paddingHorizontal: SIZES.large
    }
})