import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../../constants/theme'
import { Ionicons } from '@expo/vector-icons';

const StoryBlock = ({ name, userUri }) =>
{
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row" }}>
                <Image style={styles.storyImg} source={{ uri: userUri }} />

            </View>
            <Text style={{ marginTop: SIZES.small, color: COLORS.tertiary, fontFamily: FONT.regular, fontSize: SIZES.small }}>{name}</Text>
        </View>
    )
}

export default StoryBlock

const styles = StyleSheet.create({
    container: {

        justifyContent: "flex-start",
        alignItems: "center",
        flex: 1,
        marginRight: SIZES.medium,

    },
    storyImg: {
        height: 78,
        width: 78,
        resizeMode: "cover",
        objectFit: "cover",
        borderRadius: 78 / 2,

    }
})