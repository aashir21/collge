import { StyleSheet, Text, View, useWindowDimensions, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { Entypo, Feather } from '@expo/vector-icons';
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { useToast } from 'react-native-toast-notifications';
import UnblockUserModal from '../Modals/UnblockUserModal';


const BlockedUserTab = ({ userId, avatar, firstName, lastName, username, premiumUser, role }) =>
{

    const { width } = useWindowDimensions()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toast = useToast()

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    return (
        <Pressable style={{ alignSelf: "center" }} onPress={openModal}>
            <View style={[styles.container, { width: width - SIZES.large, flexDirection: "row", backgroundColor: COLORS.textAccent }]}>
                <View style={styles.searchTabCon}>
                    <View>
                        <Image source={{ uri: avatar }} style={styles.searchTabImg}></Image>
                    </View>

                    <View style={{ marginHorizontal: SIZES.medium }}>
                        <View style={{ flexDirection: "row" }}>
                            <View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={styles.searchTabName}>{firstName} {lastName}</Text>
                                    {
                                        premiumUser == true ? <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image> : null
                                    }
                                    {
                                        role === "ADMIN" ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
                                    }
                                </View>
                                <Text style={styles.searchTabUsername}>@{username}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ justifyContent: "center", alignItems: "flex-end" }}>
                    <Feather name="user-x" size={16} color={COLORS.whiteAccent} />
                </View>
            </View>

            {
                isModalOpen && <UnblockUserModal firstName={firstName} userId={userId} isVisible={isModalOpen} onClose={closeModal} />
            }

        </Pressable>
    )
}

export default BlockedUserTab

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.large,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.small,
        marginTop: SIZES.xSmall
    },

    searchTabCon: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "80%"
    },
    searchTabImg: {
        height: 48,
        width: 48,
        borderRadius: 48 / 2,
        objectFit: "cover",
    },
    searchTabName: {
        fontFamily: FONT.bold,
        fontSize: SIZES.medium - 2,
        color: COLORS.tertiary,
    },
    searchTabUsername: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.secondary
    },
    verified: {
        height: 12,
        width: 12,
        objectFit: "contain",
        marginLeft: 4
    }
})