import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SpanText from '../General Component/SpanText';
import { router } from 'expo-router';

const IDCardWarningRear = () =>
{

    return (
        <View style={styles.container}>

            <MaterialCommunityIcons name="card-bulleted-outline" size={150} color={COLORS.tertiary} />
            <Text style={styles.title}>Student ID Card Rear <SpanText subtext={"Verification"} /></Text>

            <View style={{ width: "85%", alignSelf: "center", marginTop: SIZES.medium }}>
                <Text style={styles.subTitle}><SpanText subtext={"1."} /> Make sure the room is well lit.</Text>
                <Text style={styles.subTitle}><SpanText subtext={"2."} /> Ensure the ID card does not have any glares.</Text>
                <Text style={styles.subTitle}><SpanText subtext={"3."} /> All the details on the ID card should not be blurry.</Text>
                <Text style={styles.subTitle}><SpanText subtext={"4."} /> ID card should contain name of the university you entered while registering on the app.</Text>
                <Text style={styles.subTitle}><SpanText subtext={"5."} /> ID card should not be expired.</Text>
            </View>

            <TouchableOpacity style={styles.startBtn} onPress={() => router.replace("/auth/verification/cardRearVerification")}>
                <Text style={styles.btnTitle}>Take picture of rear</Text>
            </TouchableOpacity>

        </View>
    )
}

export default IDCardWarningRear

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge + 2,
        color: COLORS.tertiary
    },
    subTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        color: COLORS.tertiary,
        lineHeight: 30
    },
    startBtn: {
        paddingVertical: SIZES.medium,
        paddingHorizontal: SIZES.large,
        backgroundColor: COLORS.textAccent,
        width: "50%",
        alignSelf: "center",
        marginVertical: SIZES.medium,
        borderRadius: SIZES.large
    },
    btnTitle: {
        fontFamily: FONT.regular,
        color: COLORS.secondary,
        fontSize: SIZES.small,
        textAlign: "center"
    }

})