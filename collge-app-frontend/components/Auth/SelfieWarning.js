import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import AntDesign from '@expo/vector-icons/AntDesign';
import SpanText from '../General Component/SpanText';
import { router } from 'expo-router';

const SelfieWarning = ({ nextScreen }) =>
{
    return (
        <View style={styles.container}>

            <AntDesign name="user" size={180} color={COLORS.tertiary} />
            <Text style={styles.title}>Selfie <SpanText subtext={"Verification"} /></Text>

            <View style={{ width: "85%", alignSelf: "center", marginTop: SIZES.medium }}>
                <Text style={styles.subTitle}><SpanText subtext={"1."} /> Make sure the room is well lit.</Text>
                <Text style={styles.subTitle}><SpanText subtext={"2."} /> The face should be fully visible, including both eyes, nose, and mouth.</Text>
                <Text style={styles.subTitle}><SpanText subtext={"3."} /> The person should be facing the camera directly, not at an angle.</Text>
                <Text style={styles.subTitle}><SpanText subtext={"4."} /> Check that the image is not blurry or pixelated.</Text>
                <Text style={styles.subTitle}><SpanText subtext={"5."} /> Your face should match the photo in your university ID card.</Text>
            </View>

            <TouchableOpacity style={styles.startBtn} onPress={() => router.replace(nextScreen)}>
                <Text style={styles.btnTitle}>Take Selfie</Text>
            </TouchableOpacity>

        </View>
    )
}

export default SelfieWarning

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