import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import * as SecureStore from "expo-secure-store"
import { MaterialIcons, Feather, Fontisto, MaterialCommunityIcons, Entypo, AntDesign, Octicons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';
import { customFetch } from '../../utility/tokenInterceptor';
import DeleteAccountModal from '../Modals/DeleteAccountModal';
import NearbySettingsModal from '../Modals/NearbySettingsModal';

const Settings = () =>
{

    const { width } = useWindowDimensions()
    const toast = useToast()
    const [isDisabled, setIsDisabled] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isNearbyModalOpen, setIsNearbyModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const openNearbyModal = () => setIsNearbyModalOpen(true)
    const closeNearbyModal = () => setIsNearbyModalOpen(false)


    const handleLogout = async () =>
    {

        toast.show("Logging out...", {
            type: "normal",
            placement: "top",
            duration: 3500
        })
        setIsDisabled(true)

        await deleteNotificationToken()

        try
        {

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/auth/logout`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: SecureStore.getItem("__userId"),
                    jwtToken: SecureStore.getItem("__jwtToken"),
                    refreshToken: SecureStore.getItem("__refreshToken")
                })
            })

            await SecureStore.deleteItemAsync("__isLoggedIn")
            await SecureStore.deleteItemAsync("__refreshToken")
            await SecureStore.deleteItemAsync("__jwtToken")
            await SecureStore.deleteItemAsync("__userId")

            router.replace("/auth/login")

        } catch (er)
        {

            await SecureStore.deleteItemAsync("__isLoggedIn")
            await SecureStore.deleteItemAsync("__refreshToken")
            await SecureStore.deleteItemAsync("__jwtToken")
            await SecureStore.deleteItemAsync("__userId")

            router.replace("/auth/login")

        }
        finally
        {
            setIsDisabled(false)
        }
    }

    const deleteNotificationToken = async () =>
    {

        try
        {

            const userId = await SecureStore.getItem("__userId");

            await customFetch(`${ENDPOINT.BASE_URL}/api/v1/notificationToken/deleteToken?userId=${userId}`, {
                method: "DELETE"
            })

        } catch (err)
        {
            toast.show("Something went wrong...", {
                placement: "top",
                duration: 3000,
                type: "normal"
            })
        }

    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={[styles.btnsContainer, { width: width - 32 }]}>
                <ScrollView style={{ flex: 1, marginTop: SIZES.large }} showsVerticalScrollIndicator={false}>

                    {/* //User settings options */}
                    <Text style={styles.sectionTitle}>Account Settings</Text>

                    <TouchableOpacity onPress={() => router.push("/profile/settings/changeusername")} style={[styles.settingsBtn, { justifyContent: "space-between" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <AntDesign name="user" size={20} color={COLORS.tertiary} style={styles.settingsIcon} />
                            <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Change Username</Text>
                        </View>
                        <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/profile/settings/password/verifyPassword")} style={[styles.settingsBtn, { justifyContent: "space-between" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Feather name="lock" size={20} color={COLORS.tertiary} style={styles.settingsIcon} />
                            <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Change Password</Text>
                        </View>
                        <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/profile/settings/changeavatar")} style={[styles.settingsBtn, { justifyContent: "space-between" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <MaterialCommunityIcons name="face-man-profile" size={20} color={COLORS.tertiary} style={styles.settingsIcon} />
                            <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Change Avatar</Text>
                        </View>
                        <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/profile/settings/changebio")} style={[styles.settingsBtn, { justifyContent: "space-between" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <MaterialCommunityIcons name="bio" size={20} color={COLORS.tertiary} style={styles.settingsIcon} />
                            <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Change Bio</Text>
                        </View>
                        <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                    </TouchableOpacity>

                    {/* //Collge specific features */}
                    <Text style={[styles.sectionTitle]}>Activity on your profile</Text>
                    <TouchableOpacity style={[styles.settingsBtn, { justifyContent: "space-between" }]} onPress={() => router.push("profile/settings/wink")}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Fontisto name="wink" size={20} color={COLORS.tertiary} style={styles.settingsIcon} />
                            <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Winks</Text>
                        </View>
                        <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.settingsBtn, { justifyContent: "space-between" }]} onPress={() => router.push("profile/settings/profilevisit")}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <MaterialCommunityIcons name="account-eye" size={22} color={COLORS.tertiary} style={styles.settingsIcon} />
                            <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Profile Visits</Text>
                        </View>
                        <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/profile/settings/linkups")} style={[styles.settingsBtn, { justifyContent: "space-between" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <MaterialCommunityIcons name="hook" size={22} color={COLORS.tertiary} />
                            <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Link Ups</Text>
                        </View>
                        <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openNearbyModal} style={[styles.settingsBtn, { justifyContent: "space-between" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <FontAwesome5 name="map-marked-alt" size={22} color={COLORS.tertiary} />
                            <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Nearby</Text>
                        </View>
                        <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/profile/settings/blockedUsers")} style={[styles.settingsBtn, { justifyContent: "space-between" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Entypo name="block" size={22} color={COLORS.tertiary} />
                            <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Blocked Users</Text>
                        </View>
                        <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                    </TouchableOpacity>

                    {/* //Genral User settings options */}
                    {/* <Text style={styles.sectionTitle}>How you use Collge</Text>

                    <TouchableOpacity style={[styles.settingsBtn, { justifyContent: "space-between" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <AntDesign name="arrowsalt" size={20} color={COLORS.tertiary} style={styles.settingsIcon} />
                            <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Votes</Text>
                        </View>
                        <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingsBtn, { justifyContent: "space-between" }]} onPress={() => router.push("profile/settings/comments")}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Feather name="message-circle" size={20} color={COLORS.tertiary} style={styles.settingsIcon} />
                            <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Comments</Text>
                        </View>
                        <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={[styles.settingsBtn, { justifyContent: "space-between" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Feather name="archive" size={20} color={COLORS.tertiary} style={styles.settingsIcon} />
                            <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Archive</Text>
                        </View>
                        <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingsBtn, { justifyContent: "space-between" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <FontAwesome name="save" size={20} color={COLORS.tertiary} style={styles.settingsIcon} />
                            <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Saved</Text>
                        </View>
                        <Entypo name="chevron-right" size={16} color={COLORS.whiteAccent} />
                    </TouchableOpacity> */}

                    {/* //Danger zones */}
                    <Text style={[styles.sectionTitle, { color: COLORS.error }]}>Danger zone</Text>

                    <TouchableOpacity disabled={isDisabled} style={[styles.settingsBtn, { opacity: isDisabled ? 0.2 : 1 }]} onPress={() => router.push("/report/appReport")}>
                        <MaterialIcons name="bug-report" size={24} color={COLORS.error} style={styles.settingsIcon} />
                        <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Report A Problem</Text>
                    </TouchableOpacity>

                    <TouchableOpacity disabled={isDisabled} style={[styles.settingsBtn, { opacity: isDisabled ? 0.2 : 1 }]} onPress={openModal}>
                        <AntDesign name="deleteuser" size={24} color={COLORS.error} style={styles.settingsIcon} />
                        <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Delete Account</Text>
                    </TouchableOpacity>

                    <Text style={[styles.sectionTitle]}>Logout</Text>

                    <TouchableOpacity disabled={isDisabled} style={[styles.settingsBtn, { opacity: isDisabled ? 0.2 : 1 }]} onPress={handleLogout}>
                        <MaterialIcons name="logout" size={24} color={COLORS.error} style={styles.settingsIcon} />
                        <Text style={[styles.btnTitle, { color: COLORS.tertiary }]}>Logout</Text>
                    </TouchableOpacity>
                </ScrollView>

                {
                    isModalOpen && <DeleteAccountModal isVisible={isModalOpen} onClose={closeModal} />
                }

                {
                    isNearbyModalOpen && <NearbySettingsModal isVisible={isNearbyModalOpen} onClose={closeNearbyModal} />
                }

            </View>

        </SafeAreaView>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: COLORS.textAccent,
    },
    btnsContainer: {
        height: "100%",
        justifyContent: "flex-end",
    },

    sectionTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        marginLeft: 2,
        color: COLORS.whiteAccent,
        marginVertical: SIZES.small
    },

    settingsBtn: {

        backgroundColor: COLORS.lightBlack,
        paddingHorizontal: SIZES.small,
        paddingVertical: SIZES.large,
        borderRadius: SIZES.medium,
        flexDirection: "row",
        marginBottom: SIZES.xSmall,
        alignItems: "center"

    },
    btnTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.tertiary,
        marginLeft: SIZES.small,
        width: "75%"
    },
    settingsIcon: {
        maxWidth: "10%"
    }
})