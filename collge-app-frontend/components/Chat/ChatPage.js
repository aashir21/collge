import { FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import { customFetch } from "../../utility/tokenInterceptor"
import * as SecureStore from "expo-secure-store"
import { useToast } from 'react-native-toast-notifications'
import ChatListEmptyComponent from './ChatListEmptyComponent'
import ChatHomeHeader from './ChatHomeHeader'
import NewChatModal from '../Modals/NewChatModal'
import ChatTab from "./ChatTab"
import GeneralLoading from "../Loading/GeneralLoading"

const ChatPage = () =>
{

    const [chatList, setChatList] = useState([])
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const toast = useToast()

    const openNewChatModal = () => setIsNewChatModalOpen(true);
    const closeNewChatModal = () => setIsNewChatModalOpen(false);

    const onRefresh = useCallback(async () =>
    {

        setRefreshing(true);
        setIsLoading(true)

        setTimeout(async () =>
        {
            try
            {
                setChatList([]);
                await Promise.all([getChatListsByUserId()])
                    .then(() =>
                    {
                        setRefreshing(false);
                        setIsLoading(false)
                    });
            } catch (err)
            {
                toast.show("Something went wrong", {
                    type: "normal",
                    duration: 3500,
                    placement: "top"
                })

            }
            finally
            {
                setRefreshing(false)
            }

        }, 1000); // Adjust the delay (in milliseconds) as needed
    }, []);

    const getChatListsByUserId = async () =>
    {

        try
        {
            const userId = await SecureStore.getItem("__userId");

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/chat/getAllChatsByUserId?userId=${userId}`)

            if (response.ok)
            {
                const data = await response.json()
                setChatList([...chatList, ...data])

            }
        } catch (err)
        {
            toast.show("Failed to fetch chats", {
                placement: "top",
                duration: 3000,
                type: "normal"
            })
        }
        finally
        {
            setIsLoading(false)
        }

    }

    useEffect(() =>
    {

        getChatListsByUserId()

    }, [])

    if (isLoading)
    {
        return <GeneralLoading />
    }

    return (
        <View style={styles.container}>

            <ChatHomeHeader onNewChatPress={openNewChatModal} />

            {
                chatList.length > 0 ?
                    <FlatList
                        data={chatList}
                        ListEmptyComponent={<ChatListEmptyComponent />}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={16}
                        keyExtractor={(item) => item?.userId?.toString()}
                        renderItem={({ item, index }) =>
                        (
                            <ChatTab
                                recipientId={item.userId}
                                firstName={item.firstName}
                                lastName={item.lastName}
                                avatar={item.avatar}
                                role={item.role}
                                premiumUser={item.premiumUser}
                                lastActivity={item.lastActivity}
                            />
                        )}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ alignItems: "center", flex: 0.25 }}>
                            <Text style={{ color: COLORS.tertiary, fontSize: SIZES.xxLarge, fontFamily: FONT.bold }}>No Active Chats &#128532;</Text>
                            <Text style={{ color: COLORS.whiteAccent, fontSize: SIZES.medium, fontFamily: FONT.regular, }}>It's okay, someone will text you soon.</Text>
                        </View>
                    </View>
            }

            {
                isNewChatModalOpen && <NewChatModal isVisible={isNewChatModalOpen} onClose={closeNewChatModal} />
            }

        </View>
    )
}

export default ChatPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
    }
})