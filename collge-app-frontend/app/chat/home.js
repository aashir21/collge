import { StyleSheet } from 'react-native'
import React from 'react'
import { COLORS } from '../../constants/theme'
import ChatPage from "../../components/Chat/ChatPage"

const home = () =>
{
    return (
        <ChatPage />
    )
}

export default home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
    }
})