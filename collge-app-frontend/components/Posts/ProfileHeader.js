import { StyleSheet, Text, View, Image, useWindowDimensions, TouchableOpacity, Pressable, Platform } from 'react-native'
import { FONT, COLORS, SIZES } from '../../constants/theme'
import React, { useEffect, useRef, useState } from 'react'
import { MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import ShowTagModal from "../Modals/ShowTagModal"
import ShowLocationModal from "../Modals/ShowLocationModal"
import { router, usePathname } from 'expo-router';


const ProfileHeader = ({ name, profilePicUri, value, isPremiumUser, role, userId, createdAt, showModal, location, taggedUsers }) =>
{
    const [showTagModal, setShowTagModal] = useState(false)
    const [showLocationModal, setShowLocationModal] = useState(false)

    const path = usePathname()

    const handleOnPress = async () =>
    {
        if (userId)
        {
            router.push({
                pathname: `/home/user/[id]`,
                params: { id: userId }
            })
        }
    }

    const openShowTagModal = () => { setShowTagModal(true) }
    const closeShowTagModal = () => { setShowTagModal(false) }

    const openShowLocationModal = () => { setShowLocationModal(true) }
    const closeShowLocationModal = () => { setShowLocationModal(false) }

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                <Pressable onPress={handleOnPress} style={styles.imgCon}>
                    <Image style={{ objectFit: "cover", height: 48, width: 48, borderRadius: 48 / 2 }} source={{ uri: profilePicUri }} />
                </Pressable>
                <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Pressable onPress={handleOnPress}><Text style={styles.postAuthorName}>{name}</Text></Pressable>
                            <View style={{ flexDirection: "row", alignItems: "flex-start", paddingBottom: Platform.OS === "android" ? 4 : 0 }}>
                                {
                                    isPremiumUser == "true" ? <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image> : null
                                }
                                {
                                    (role === "ADMIN" || role === "MANAGER") ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
                                }
                            </View>
                            <Text style={styles.timeStamp}>{createdAt}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text numberOfLines={1} style={[styles.postAuthorName, { fontFamily: FONT.regular, fontSize: SIZES.small + 1, color: COLORS.secondary }]}>
                            {value.length > 24 ? value.substring(0, 24) + ".." : value}
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            {
                                taggedUsers &&
                                <View style={[styles.taggedContainer]}>
                                    <TouchableOpacity onPress={openShowTagModal} style={{ flexDirection: "row" }}>
                                        {taggedUsers && <Feather name="users" size={14} color={COLORS.whiteAccent} />}
                                        <Text numberOfLines={1} style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.fontBodySize - 2, textAlign: "left", marginLeft: SIZES.xSmall - 4 }}>{`${taggedUsers.length}`}</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {
                                location && <Pressable onPress={openShowLocationModal} style={[styles.locationContainer]}>
                                    <FontAwesome5 name="map-pin" size={12} color={COLORS.whiteAccent} />
                                    <Text style={[styles.locationName]}>{location.length > 25 ? location.substring(0, 18) : location}</Text>
                                </Pressable>
                            }
                        </View>
                    </View>

                    <View>
                        {
                            showTagModal && <ShowTagModal handleRemoveTaggedUser={null} taggedUsers={taggedUsers} isVisible={showTagModal} shouldRunFunction={false} onClose={closeShowTagModal} />
                        }
                    </View>

                    <View>
                        {
                            showLocationModal && <ShowLocationModal isVisible={showLocationModal} onClose={closeShowLocationModal} locationName={location} />
                        }
                    </View>

                </View>
            </View>
            <View style={{ alignItems: "flex-end", justifyContent: "flex-end", flex: 1, alignSelf: "flex-start" }}>
                <TouchableOpacity onPress={showModal}>
                    <MaterialCommunityIcons name="dots-horizontal" size={24} color={COLORS.whiteAccent} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default React.memo(ProfileHeader)

const styles = StyleSheet.create({
    imgCon: {
        height: 48,
        width: 48,
        borderRadius: 48 / 2,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SIZES.xSmall

    },
    timeStamp: {
        fontSize: SIZES.small,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        marginHorizontal: SIZES.xSmall
    },
    postAuthorName: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.medium,
    },
    verified: {
        height: 12,
        width: 12,
        objectFit: "contain",
        marginLeft: 4
    },
    locationContainer: {
        flexDirection: "row",
        marginLeft: SIZES.xSmall,
    },
    locationName: {
        fontSize: SIZES.fontBodySize - 2,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        marginLeft: 4
    },
    taggedContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginLeft: SIZES.medium
    }

})