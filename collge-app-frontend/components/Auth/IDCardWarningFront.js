import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import AntDesign from '@expo/vector-icons/AntDesign';
import SpanText from '../General Component/SpanText';
import { router } from 'expo-router';

const IDCardWarningFront = () =>
{

    return (
        <View style={styles.container}>

            <AntDesign name="idcard" size={150} color={COLORS.tertiary} />
            <Text style={styles.title}>Student ID Card Front <SpanText subtext={"Verification"} /></Text>

            <View style={{ width: "85%", alignSelf: "center", marginTop: SIZES.medium }}>
                <Text style={styles.subTitle}><SpanText subtext={"1."} /> Make sure the room is well lit.</Text>
                <Text style={styles.subTitle}><SpanText subtext={"2."} /> Ensure the ID card does not have any glares.</Text>
                <Text style={styles.subTitle}><SpanText subtext={"3."} /> All the details on the ID card should not be blurry.</Text>
                <Text style={styles.subTitle}><SpanText subtext={"4."} /> ID card should contain name of the university you entered while registering on the app.</Text>
                <Text style={styles.subTitle}><SpanText subtext={"5."} /> Ensure the ID card is not expired.</Text>
                <Text style={styles.subTitle}><SpanText subtext={"6."} /> ID card should contain your photo on it.</Text>
            </View>

            <TouchableOpacity style={styles.startBtn} onPress={() => router.replace("/auth/verification/cardFrontVerification")}>
                <Text style={styles.btnTitle}>Take picture of front</Text>
            </TouchableOpacity>

        </View>
    )
}

export default IDCardWarningFront

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