import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, SIZES, FONT } from '../../constants/theme'

const ChatListEmptyComponent = () =>
{
    return (
        <View style={{ height: "100%", justifyContent: "center", alignItems: "center", marginTop: 150 }}>
            <Text style={{ color: COLORS.tertiary, fontSize: SIZES.xxLarge, fontFamily: FONT.bold }}>No Active Chats &#128532;</Text>
            <Text style={{ color: COLORS.whiteAccent, fontSize: SIZES.medium, fontFamily: FONT.regular, }}>It's okay, someone will text you soon.</Text>
        </View>
    )
}

export default ChatListEmptyComponent
