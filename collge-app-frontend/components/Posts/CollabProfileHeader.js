import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from 'react-native'
import { FONT, COLORS, SIZES } from '../../constants/theme'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useSegments } from 'expo-router';


const CollabProfileHeader = ({ name, profilePicUri, value, userId, createdAt, invitedUserName, invitedUserProfilePicUri, invitedUserId, showModal, postId, collabRequestStatus, invitedUserUni }) =>
{

    const segments = useSegments()

    const handleOnPress = async () =>
    {
        router.push({
            pathname: `${segments[0]}/${segments[1]}/user/[id]`,
            params: { id: userId }
        })
    }

    const navigateToInvitedUserProfile = () =>
    {
        router.push({
            pathname: `${segments[0]}/${segments[1]}/user/[id]`,
            params: { id: invitedUserId }
        })
    }

    const mockName = "Lahore University of Management Sciences"

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginLeft: SIZES.xLarge, marginTop: SIZES.xSmall }}>
            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                <View>
                    <Pressable onPress={handleOnPress} style={[styles.imgCon]}>
                        <Image style={{ objectFit: "cover", height: 48, width: 48, borderRadius: 48 / 2 }} source={{ uri: profilePicUri }} />
                    </Pressable>
                    <Pressable onPress={navigateToInvitedUserProfile} style={[styles.friendImgCon, { opacity: collabRequestStatus === "PENDING" ? 0.4 : 1 }]}>
                        <Image style={{ objectFit: "cover", height: 48, width: 48, borderRadius: 48 / 2 }} source={{ uri: invitedUserProfilePicUri }} />
                    </Pressable>
                </View>
                <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ flexDirection: "row" }}>
                                <Pressable onPress={handleOnPress}>
                                    <Text style={styles.postAuthorName}>{name}</Text>
                                </Pressable>

                                <Text style={styles.postAuthorName}> & </Text>

                                <Pressable onPress={navigateToInvitedUserProfile}>
                                    <Text style={[styles.postAuthorName, { opacity: collabRequestStatus === "PENDING" ? 0.4 : 1 }]}>{invitedUserName}</Text>
                                </Pressable>
                            </View>
                            <Text style={styles.timeStamp}>{createdAt}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        {
                            value === invitedUserUni ? <Text style={[styles.postAuthorName, { fontFamily: FONT.regular, fontSize: SIZES.small + 1, color: COLORS.secondary }]}>{(value.length > 16 && invitedUserUni !== value) ? value.substring(0, 12) + ".." : value}</Text>
                                :
                                <Text style={[styles.postAuthorName, { fontFamily: FONT.regular, fontSize: SIZES.small + 1, color: COLORS.secondary }]}>{value.length > 20 ? value.substring(0, 18) + ".." : value}</Text>
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

export default React.memo(CollabProfileHeader)

const styles = StyleSheet.create({
    imgCon: {
        height: 48,
        width: 48,
        borderRadius: 48 / 2,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SIZES.xSmall,
        zIndex: 1
    },
    friendImgCon: {
        height: 48,
        width: 48,
        borderRadius: 48 / 2,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SIZES.xSmall,
        position: "absolute",
        right: 25,
        bottom: 10
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
    }

})