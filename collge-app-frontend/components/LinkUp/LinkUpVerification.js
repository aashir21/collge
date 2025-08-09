import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import SpanText from "../General Component/SpanText"
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setVerificationData } from "../../state/verification/verificationSlice"

const LinkUpVerification = () =>
{
    const { width } = useWindowDimensions()
    const dispatch = useDispatch()

    const navigateToSelfiePage = () =>
    {

        dispatch(
            setVerificationData(
                {
                    key: "verificationType",
                    value: "LINKUP"
                }
            )
        )

        router.replace("/auth/verification/selfieWarning")

    }

    return (
        <SafeAreaView style={[styles.container]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ width: width - 32, alignSelf: "center" }}>
                    <Text style={styles.title}>LinkUp <SpanText subtext={"Verification"} /></Text>
                    <Text style={styles.subTitle}>Before you start linking up with people, we need to verify your identity.</Text>
                </View>

                <View style={{ marginVertical: SIZES.small, width: width - 32, alignSelf: "center" }}>
                    <Text style={styles.subHeading}>Why we do this?</Text>
                    <View>
                        <View style={{ flexDirection: "row", marginVertical: SIZES.small }}>
                            <AntDesign name="Safety" size={24} color={COLORS.secondary} />
                            <View style={{ marginHorizontal: 8 }}>
                                <Text style={styles.whyCardTitle}>Safety</Text>
                                <Text style={styles.whyCardSubTitle}>We want to make sure that Collge feels like a comfortable and welcoming space for all to connect and interact. We're committed to creating a positive and secure environment for all our users.</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", marginVertical: SIZES.small }}>
                            <FontAwesome6 name="peace" size={24} color={COLORS.secondary} />
                            <View style={{ marginHorizontal: 8 }}>
                                <Text style={styles.whyCardTitle}>Peace Of Mind</Text>
                                <Text style={styles.whyCardSubTitle}>Feel confident when meeting someone new! Every LinkUp post creator will be verified by the Collge team, so you can enjoy your time with others knowing everything's been checked for a smooth experience.</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ width: width - 32, alignSelf: "center" }}>
                    <Text style={styles.subHeading}>What we need from you?</Text>
                    <View>
                        <View style={{ flexDirection: "row", marginVertical: SIZES.small }}>
                            <AntDesign name="user" size={24} color={COLORS.secondary} />
                            <View style={{ marginHorizontal: 8 }}>
                                <Text style={styles.whyCardTitle}>Your Selfie</Text>
                                <Text style={styles.whyCardSubTitle}>A picture of you looking into the camera.</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", marginVertical: SIZES.small }}>
                            <AntDesign name="idcard" size={24} color={COLORS.secondary} />
                            <View style={{ marginHorizontal: 8 }}>
                                <Text style={styles.whyCardTitle}>Your Student ID Card</Text>
                                <Text style={styles.whyCardSubTitle}>A photo of your university ID Card with your photo on it.</Text>
                            </View>
                        </View>

                    </View>
                </View>

                <View style={{ width: width - 32, alignSelf: "center", marginVertical: SIZES.large }}>
                    <Text style={styles.warning}>If you exit the verification process midway, you’ll need to restart it from the beginning.</Text>
                </View>

                <TouchableOpacity style={styles.startBtn} onPress={navigateToSelfiePage}>
                    <Text style={styles.btnTitle}>Start Verification</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default LinkUpVerification

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 18 : 0,
        alignSelf: "center"
    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xxLarge,
        color: COLORS.tertiary
    },
    subTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        color: COLORS.whiteAccent,
    },
    subHeading: {
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge,
        color: COLORS.tertiary,
    },
    whyCardTitle: {
        fontFamily: FONT.bold,
        fontSize: SIZES.fontBodySize + 2,
        color: COLORS.tertiary
    },
    whyCardSubTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        color: COLORS.tertiary,
        flexWrap: "wrap"
    },
    startBtn: {
        paddingVertical: SIZES.medium,
        paddingHorizontal: SIZES.large,
        backgroundColor: COLORS.textAccent,
        width: "50%",
        alignSelf: "center",
        marginVertical: SIZES.small,
        borderRadius: SIZES.large
    },
    btnTitle: {
        fontFamily: FONT.regular,
        color: COLORS.secondary,
        fontSize: SIZES.small,
        textAlign: "center"
    },
    warning: {
        fontFamily: FONT.regular,
        fontSize: SIZES.fontBodySize,
        color: COLORS.warning
    }

})