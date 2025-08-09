import { Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from "../../constants/theme"
import Entypo from '@expo/vector-icons/Entypo';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const RegisterType = () =>
{

    const { width } = useWindowDimensions()

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()}>
                <AntDesign style={{ marginHorizontal: SIZES.medium, marginTop: SIZES.small }} name="left" size={24} color={COLORS.tertiary} />
            </TouchableOpacity>
            <Text style={styles.title}>Choose A Sign Up Method</Text>

            <Pressable onPress={() => router.push("/auth/register")} style={[styles.option, { width: width - 32 }]}>
                <Entypo name="email" size={20} color={COLORS.tertiary} />
                <Text style={styles.optionTitle}>Sign up using student email</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/auth/photoUserDetails")} style={[styles.option, { width: width - 32 }]}>
                <AntDesign name="idcard" size={20} color={COLORS.tertiary} />
                <Text style={styles.optionTitle}>Sign up using student ID card</Text>
            </Pressable>

        </SafeAreaView>
    )
}

export default RegisterType

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    },
    title: {
        color: COLORS.tertiary,
        fontFamily: FONT.bold,
        fontSize: SIZES.xxLarge,
        marginVertical: SIZES.medium,
        marginHorizontal: SIZES.medium
    },
    option: {
        paddingVertical: SIZES.large,
        paddingHorizontal: SIZES.medium,
        backgroundColor: COLORS.textAccent,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: SIZES.medium,
        alignSelf: "center",
        marginBottom: SIZES.medium
    },
    optionTitle: {
        fontFamily: FONT.regular,
        marginHorizontal: SIZES.medium,
        color: COLORS.tertiary
    }

})