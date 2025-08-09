import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, useWindowDimensions } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from "../../constants/theme"
import Octicons from '@expo/vector-icons/Octicons';
import { router } from 'expo-router';

const SubmitVerification = ({ shouldDisplayButton }) =>
{

    const { width } = useWindowDimensions()

    return (
        <SafeAreaView style={[styles.container]}>

            <View style={{ width: width - 32, alignSelf: "center", justifyContent: "center" }}>

                <Octicons style={{ alignSelf: "center" }} name="unverified" size={150} color={COLORS.secondary} />

                <View style={{ marginVertical: SIZES.medium }}>
                    <Text style={styles.title}>In review!</Text>
                    <Text style={styles.subTitle}>Our team is still reviewing your verification request.</Text>
                    <Text style={styles.subTitle}>If it has been more than 24 hours, please contact support@collge.io</Text>
                </View>

                {
                    shouldDisplayButton &&
                    <View>
                        <TouchableOpacity style={styles.startBtn} onPress={() => router.back()}>
                            <Text style={styles.btnTitle}>Go back</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>

        </SafeAreaView>
    )
}

export default SubmitVerification

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
    },
    title: {
        fontSize: SIZES.xLarge + 2,
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        textAlign: "center"
    },
    subTitle: {
        fontSize: SIZES.fontBodySize,
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        textAlign: "center"
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