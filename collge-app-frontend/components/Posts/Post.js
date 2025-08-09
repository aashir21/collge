import { SafeAreaView, StyleSheet, Text, useWindowDimensions, View, TouchableOpacity, Platform, StatusBar } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { MaterialIcons, AntDesign, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';


const Post = () =>
{

    const { width } = useWindowDimensions();


    return (
        <SafeAreaView style={[styles.container]}>
            <View style={{ paddingHorizontal: SIZES.large, marginVertical: Platform.OS === "android" ? SIZES.xLarge : SIZES.medium }}>
                <Text style={styles.postTitle}>What's brewing?</Text>
                <View style={{ marginTop: SIZES.large }}>
                    {/* <TouchableOpacity onPress={() => router.push("/camera")} style={[styles.optionCard, { width: width - SIZES.xxLarge }]}>
                        <Feather name="camera" size={24} color={COLORS.tertiary} />
                        <Text style={styles.optionCardTitle}>Camera</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => router.push("post/postinfo")} style={[styles.optionCard, { width: width - SIZES.xxLarge }]}>
                        <MaterialIcons name="post-add" size={24} color={COLORS.tertiary} />
                        <Text style={styles.optionCardTitle}>Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("post/reel-create")} style={[styles.optionCard, { width: width - SIZES.xxLarge }]}>
                        <FontAwesome5 name="tape" size={24} color={COLORS.tertiary} />
                        <Text style={styles.optionCardTitle}>Tape</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("post/confession-create")} style={[styles.optionCard, { width: width - SIZES.xxLarge }]}>
                        <AntDesign name="question" size={24} color={COLORS.tertiary} />
                        <Text style={styles.optionCardTitle}>Confession</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("post/linkupPost")} style={[styles.optionCard, { width: width - SIZES.xxLarge }]}>
                        <MaterialCommunityIcons name="hook" size={24} color={COLORS.tertiary} />
                        <Text style={styles.optionCardTitle}>Link Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Post

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: COLORS.primary,

    },
    postTitle: {
        fontSize: SIZES.xxLarge,
        fontFamily: FONT.bold,
        color: COLORS.tertiary
    },
    optionCard: {
        backgroundColor: COLORS.textAccent,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.large,
        borderRadius: SIZES.large,
        marginBottom: SIZES.large,
    },
    optionCardTitle: {
        fontSize: SIZES.medium,
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        marginHorizontal: SIZES.small
    }
})