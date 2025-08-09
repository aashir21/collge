import { StyleSheet, Text, Pressable, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { Image } from 'expo-image'
import AntDesign from '@expo/vector-icons/AntDesign';
import { FontAwesome } from '@expo/vector-icons';

const ShareFriendTab = ({ userId, firstName, lastName, avatar, role, isPremiumUser, selectFriendForSharing, selectedFriend }) =>
{
    return (
        <Pressable onPress={() => selectFriendForSharing(userId)} style={styles.container}>
            <Image style={styles.profilePic} source={avatar} />
            <Text lineBreakMode="tail" style={styles.name}>{firstName} {lastName}</Text>

            <View style={{ position: "absolute", right: 0, top: 0 }}>
                {
                    selectedFriend.has(userId) &&
                    <FontAwesome name="check" size={18} color={COLORS.secondary} />
                }
            </View>

        </Pressable>
    )
}

export default ShareFriendTab

const styles = StyleSheet.create({

    container: {
        marginHorizontal: 8,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    profilePic: {
        height: 72,
        width: 72,
        borderRadius: 72 / 2,
        objectFit: "cover"
    },
    name: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.tertiary,
        textAlign: "center",
        marginTop: 8,
        width: "65"
    }

})