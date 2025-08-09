import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { Image } from 'expo-image'

const ChatPostProfileHeader = ({ authorAvatar, authorUsername }) =>
{

    return (
        <View style={styles.container}>

            <Image style={styles.authorAvatar} source={{ uri: authorAvatar }} />
            <Text style={styles.authorUsername}>{authorUsername}</Text>

        </View>
    )
}

export default ChatPostProfileHeader

const styles = StyleSheet.create({

    container: {
        backgroundColor: COLORS.textAccent,
        paddingHorizontal: SIZES.small,
        paddingVertical: SIZES.medium,
        width: "100%"
    },
    authorAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        objectFit: "cover"
    },
    authorUsername: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.tertiary,
        marginHorizontal: SIZES.large
    }

})