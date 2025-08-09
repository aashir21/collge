import { StyleSheet, Text, View, Image, useWindowDimensions, TouchableOpacity, Pressable, Platform, ImageBackground } from 'react-native'
import { COLORS, SIZES, FONT } from '../../constants/theme'
import { MaterialIcons, AntDesign, FontAwesome5, Ionicons, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import React, { useState } from 'react'
import { router, useSegments } from 'expo-router';
import StatsModal from "../Modals/StatsModal"
import CaptionBox from '../General Component/CaptionBox';

const ProfileInfo = ({ avatar, firstName, isPremiumUser, role, username, title, universityName, reputation, fire, numOfPosts, userId, bio, yearOfGraduation, campus, isLinkUpVerified }) =>
{

    const { width } = useWindowDimensions()
    const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
    const segments = useSegments()

    const handleShowStatsModal = () => setIsStatsModalVisible(true)
    const handleCloseStatsModal = () => setIsStatsModalVisible(false)

    return (
        <View style={styles.container}>
            <View style={[styles.avatarContainer]}>
                <ImageBackground source={{ uri: avatar }} blurRadius={25}>
                    <Image style={{ height: Platform.OS === "android" ? 275 : 250, width: width, resizeMode: "contain", position: "relative", objectFit: "contain", backgroundColor: "transparent" }} source={{ uri: avatar }}></Image>
                </ImageBackground>
                <View style={[styles.nameContainer, { width: width, paddingHorizontal: SIZES.large }]}>
                    <View style={{ alignItems: "center", flexDirection: "row", }}>
                        <Text style={[styles.name]}>{firstName}</Text>
                        {
                            isPremiumUser ? <Image style={styles.vBadge} source={require("../../assets/images/verified.png")}></Image> : null
                        }
                        {
                            role !== "USER" ? <Image style={styles.cBadge} source={require("../../assets/images/C.png")}></Image> : null
                        }
                    </View>
                    <Text style={styles.username}>@{username}</Text>
                </View>
            </View>
            <View style={[styles.bioContainer, { width: width - SIZES.xxLarge }]}>
                <View style={{ flex: 0.6, flexWrap: "no-wrap" }}>
                    <Text style={[styles.title, { width: width }]}>{title}</Text>
                    <Text numberOfLines={2} style={[styles.uniName]}>{universityName}</Text>
                </View>
                <View style={{ flex: 0.4, flexWrap: "no-wrap", alignItems: "flex-end" }}>
                    <TouchableOpacity style={[styles.editBtn]} onPress={() => router.push(`/(tabs)/profile/settings`)}>
                        <Text style={{ color: COLORS.tertiary, fontSize: SIZES.small }}>Profile</Text>
                        <AntDesign style={{ marginLeft: SIZES.small }} name="user" size={18} color={COLORS.tertiary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.infoContainer, { width: width }]}>

                <Pressable onPress={handleShowStatsModal} style={[styles.infoBar, { width: width - SIZES.xxLarge }]}>
                    <View>
                        <Text style={styles.infoVal}>{numOfPosts}</Text>
                        <Text style={styles.infoLabel}>Posts</Text>
                    </View>
                    <View>
                        <Text style={styles.infoVal}>{reputation}</Text>
                        <Text style={styles.infoLabel}>Reputation</Text>
                    </View>
                    <View>
                        <Text style={styles.infoVal}>{fire}</Text>
                        <Text style={styles.infoLabel}>Fire</Text>
                    </View>
                </Pressable>

            </View>

            <View style={[styles.userBioDetailsContainer, { width: width - 32 }]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.infoTitle}>Biography</Text>
                    {
                        userId <= 100 &&
                        <Image style={styles.ogImage} source={require("../../assets/images/Group 2.png")} />
                    }
                </View>
                <CaptionBox caption={bio} propStyle={{ fontSize: SIZES.small }} />
                <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                    {
                        role === "USER" &&
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: SIZES.small }}>
                            <FontAwesome name="graduation-cap" size={22} color={COLORS.tertiary} />
                            <Text style={styles.secondaryInfoTitle}>Class of {yearOfGraduation}</Text>
                        </View>
                    }
                    <View style={{ flexDirection: "row", alignItems: "center", marginRight: SIZES.small }}>
                        <FontAwesome6 name="building-user" size={20} color={COLORS.tertiary} />
                        <Text style={styles.secondaryInfoTitle}>{campus}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.profileBtnContainer, { width: width - 32 }]}>

                <TouchableOpacity onPress={() => router.push({ pathname: `${segments[0]}/${segments[1]}/friends/[id]`, params: { userId: userId } })} style={[styles.editBtn, { marginRight: SIZES.small }]}>
                    <Text style={{ color: COLORS.tertiary, fontSize: SIZES.small }}>Friends</Text>
                    <FontAwesome5 style={{ marginLeft: SIZES.small }} name="user-friends" size={18} color={COLORS.tertiary} />
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.editBtn}>
                    <Text style={{ color: COLORS.tertiary, fontSize: SIZES.small }}>Posts</Text>
                    <Ionicons style={{ marginLeft: SIZES.small }} name="images-outline" size={18} color={COLORS.tertiary} />
                </TouchableOpacity> */}

            </View>
            {
                isStatsModalVisible && <StatsModal isVisible={isStatsModalVisible} onClose={handleCloseStatsModal} />
            }

        </View>
    )
}

export default ProfileInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
    },
    userBioDetailsContainer: {

        alignSelf: "center",
        backgroundColor: COLORS.textAccent,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.large,
        marginTop: SIZES.medium,
        borderRadius: SIZES.large

    },
    nameContainer: {
        flex: 1,
        position: "absolute",
        bottom: 0,
        paddingVertical: SIZES.medium
    },
    name: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.xxLarge,
        textAlign: "left",
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,
    },
    vBadge: {
        height: 18,
        width: 18,
        resizeMode: "cover",
        objectFit: "contain",
        marginLeft: SIZES.xSmall,
    },
    cBadge: {
        height: 18,
        width: 18,
        resizeMode: "cover",
        objectFit: "contain",
        marginLeft: 4,
    },
    username: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        textAlign: "left",
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,

    },
    avatarContainer: {
        // backgroundColor: "red"
    },
    bioContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: SIZES.medium
    },
    title: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.secondary,
        paddingHorizontal: 2,
        textAlign: "left",
    },
    ogImage: {
        width: 28,
        height: 28,
        objectFit: "contain",
        marginLeft: 8
    },
    uniName: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.tertiary,
        marginTop: 2,
        textAlign: "left",
        paddingHorizontal: 2,
    },
    editBtn: {
        backgroundColor: COLORS.textAccent,
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.medium,
        borderRadius: SIZES.small,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

    },

    infoContainer: {

        justifyContent: "flex-start",
        alignItems: "center",

        // backgroundColor: "green"
    },
    infoBar: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.large,
        padding: SIZES.large
        // borderTopRightRadius: SIZES.large,
        // borderBottomLeftRadius: SIZES.large,
    },
    infoLabel: {
        textAlign: "center",
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.tertiary
    },
    infoVal: {
        textAlign: "center",
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.tertiary
    },
    profileBtnContainer: {

        marginTop: SIZES.medium,
        marginBottom: SIZES.xxLarge,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
        // backgroundColor: "yellow",
    },
    profileContainer: {

        justifyContent: "center",
        alignItems: "center"
    },
    infoTitle: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.large
    },
    secondaryInfoTitle: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.small,
        marginLeft: 8
    }
})