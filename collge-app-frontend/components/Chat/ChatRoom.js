import { ActivityIndicator, StyleSheet, Text, View, ImageBackground } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { customFetch } from "../../utility/tokenInterceptor"
import { COLORS, ENDPOINT, SIZES } from '../../constants/theme'
import { useToast } from 'react-native-toast-notifications'
import ChatRoomHeader from './ChatRoomHeader'
import { Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat'
import { AntDesign } from '@expo/vector-icons'
import { Client, Stomp, Message } from '@stomp/stompjs';
// @ts-ignore
import { TextDecoder, TextEncoder } from 'text-encoding';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import ChatBubble from './ChatBubble'
import { useFocusEffect } from '@react-navigation/native'
import * as SecureStore from "expo-secure-store"
import { AppState } from 'react-native'

const ChatRoom = ({ recipientId, senderId }) =>
{

    const [messages, setMessages] = useState([])
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true)
    const [recipient, setRecipient] = useState({})
    const [text, setText] = useState('')
    const [stompClient, setStompClient] = useState(false);
    const [isLoadEarlierVisible, setIsLoadEarlierVisible] = useState(false)
    const [offset, setOffset] = useState(0)
    const PAGE_SIZE = 10

    const SOCKET_URL = `${ENDPOINT.BASE_URL}/api/v1/app/ws`

    const getChatMessages = async (newOffset) =>
    {
        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/chat/messages/${senderId}/${recipientId}/${newOffset}/${PAGE_SIZE}`);

            if (response.ok)
            {
                const data = await response.json();

                if (data.length === PAGE_SIZE)
                {
                    setIsLoadEarlierVisible(true)
                }
                else
                {
                    setIsLoadEarlierVisible(false)
                }

                const convertedMessages = processIncomingMessages(data);
                setMessages(previousMessages => GiftedChat.append(convertedMessages, previousMessages));

                setOffset((prevOffset) => prevOffset + 1)
            }
        } catch (err)
        {
            toast.show("Something went wrong", {
                placement: "top",
                duration: 3500,
                type: "normal"
            });
        }
        finally
        {
            setIsLoading(false)
        }

    };

    const processIncomingMessages = (messages) =>
    {
        return messages.map(msg => ({
            _id: msg.messageId,
            text: msg.content,
            createdAt: new Date(msg.createdAt),
            user: {
                _id: msg.senderId,
                avatar: recipient.avatar,
            },
            post: {
                _id: msg?.postId,
                authorUsername: msg?.username,
                postCaption: msg?.caption,
                authorAvatar: msg?.avatar,
                isPostFound: msg?.isPostFound,
                isTextOnly: msg?.isTextOnly,
                postType: msg?.postType,
                mediaThumbnailUrl: msg?.mediaThumbnailUrl,
                role: msg?.role,
                isPremiumUser: msg?.isPremiumUser
            }
        }));
    };

    const getRecipientDetails = async () =>
    {

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/chat/getRecipientDetails?userId=${recipientId}`)

            if (response.ok)
            {
                const data = await response.json()
                setRecipient(data)
            }
        } catch (err)
        {
            toast.show("Something went wrong", {
                placement: "top",
                duration: 3500,
                type: "normal"
            })
        }

    }

    const renderInputToolbar = (props) =>
    {
        return (
            <InputToolbar
                {...props}
                containerStyle={{ backgroundColor: COLORS.lightBlack, borderTopWidth: 0, paddingVertical: 4, borderRadius: SIZES.large, marginBottom: 8 }}
            />
        );
    };

    const renderChatEmpty = (props) =>
    {
        return (
            <View style={styles.emptyChatContainer}>
                <Text style={styles.emptyChatText}>
                    No messages yet. Start the conversation!
                </Text>
            </View>
        );
    };

    const clearActiveChat = async () =>
    {
        try
        {
            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/chat/clearActiveChat?userId=${senderId}`, {
                method: 'POST',
            });


        } catch (error)
        {
            console.error('Error setting active chat:', error);
        }

    }

    const setActiveChat = async () =>
    {
        try
        {
            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/chat/setActiveChat?userId=${senderId}&activeChatUserId=${recipientId}`, {
                method: 'POST',
            });

        } catch (error)
        {
            console.error('Error setting active chat:', error);
        }
    };

    const renderBubble = (props) =>
    {
        return <ChatBubble props={props} />
    }

    const sendMessage = useCallback(() =>
    {
        if (stompClient && stompClient.connected && text && senderId && recipientId)
        {
            const newChatMessageDTO = {
                senderId: senderId,
                recipientId: recipientId,
                content: text,
                postId: null
            };

            stompClient.publish({
                destination: '/app/chat',
                body: JSON.stringify(newChatMessageDTO),
            });

            // Add the sent message to the local state immediately
            const newMessage = {
                _id: Date.now().toString(),
                text: text,
                createdAt: new Date(),
                user: {
                    _id: senderId,
                },
                post: {
                    _id: null,
                    authorUsername: null,
                    postCaption: null,
                    authorAvatar: null,
                    isPostFound: null,
                    postType: null,
                    mediaThumbnailUrl: null,
                    role: null,
                    isPremiumUser: null
                }
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));

            setText(''); // Clear the input after sending
        }
    }, [stompClient, text]);

    useEffect(() =>
    {
        // Initialize STOMP client
        const client = new Client({
            brokerURL: SOCKET_URL, // Replace with your WebSocket URL
            connectHeaders: {
                userId: String(senderId),
                Authorization: SecureStore.getItem("__refreshToken"),
                recipientId: String(recipientId)
            },
            debug: (str) =>
            {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            forceBinaryWSFrames: true,
            // appendMissingNULLonIncoming: true,
        });

        client.onConnect = async () =>
        {
            console.log('Connected to STOMP');
            // Subscribe to personal queue
            await client.subscribe(`/user/${senderId}/queue/messages`, (message) =>
            {
                const receivedMessage = JSON.parse(message.body);
                const processedMessage = processIncomingMessages([receivedMessage]);
                setMessages(previousMessages => GiftedChat.append(previousMessages, processedMessage));
            });

            // Fetch old messages
            getChatMessages(offset);
        };

        client.onStompError = (frame) =>
        {
            console.log('STOMP error', frame.headers['message']);
            console.log('Additional details:', frame.body);
        };

        client.activate();
        setStompClient(client);

        return () =>
        {
            if (client)
            {
                client.deactivate();
            }
        };
    }, [senderId, recipientId, recipient]);


    useEffect(() =>
    {
        const handleAppStateChange = (nextAppState) =>
        {
            if (nextAppState === 'background')
            {
                clearActiveChat();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () =>
        {
            subscription.remove();
        };
    }, []);


    useFocusEffect(
        React.useCallback(() =>
        {
            // This is executed when the screen is focused (optional logic here)

            return () =>
            {
                // Call `clearActiveChat` when the screen loses focus
                clearActiveChat();
            };
        }, [senderId])
    );

    useEffect(() =>
    {

        Promise.all([getRecipientDetails(), setActiveChat()])

    }, [])

    if (isLoading)
    {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
                <ActivityIndicator color={COLORS.whiteAccent} size={"small"} />
            </View>
        )
    }

    return (
        <>
            <SafeAreaView edges={["top"]} style={{ flex: 0, backgroundColor: COLORS.textAccent }} />
            <View style={[styles.container]}>
                <ImageBackground source={require("../../assets/images/Chat-Background.png")} style={{ flex: 1 }}>
                    <ChatRoomHeader recipientId={recipient?.userId} username={recipient?.username} firstName={recipient?.firstName} lastName={recipient?.lastName} premiumUser={recipient?.premiumUser} role={recipient?.role} avatar={recipient?.avatar} />
                    <GiftedChat
                        messages={messages}
                        onSend={() => sendMessage()}
                        user={{
                            _id: senderId,
                        }}
                        infiniteScroll={true}
                        loadEarlier={isLoadEarlierVisible}
                        onLoadEarlier={() => getChatMessages(offset)}
                        onInputTextChanged={setText}
                        renderBubble={(props) => renderBubble(props)}
                        renderInputToolbar={renderInputToolbar}
                        // renderChatEmpty={renderChatEmpty}
                        textInputProps={{ color: COLORS.tertiary }}
                        renderSend={(props) => (
                            <View
                                style={{
                                    height: 44,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 14,
                                    paddingHorizontal: 14,
                                }}>
                                {text !== '' && (
                                    <Send
                                        {...props}
                                        containerStyle={{
                                            justifyContent: 'center',
                                        }}>
                                        <AntDesign name="arrowup" color={COLORS.secondary} size={24} />
                                    </Send>
                                )}
                            </View>
                        )}
                        placeholder='Message...'
                    />

                    <View style={{
                        position: 'absolute',
                        height: useSafeAreaInsets().top,
                        backgroundColor: 'red'
                    }} />

                </ImageBackground>
            </View>
            <SafeAreaView edges={["bottom"]} style={{ flex: 0, backgroundColor: COLORS.primary }} />
        </>
    )
}

export default ChatRoom

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.textAccent
    },
    sendButton: {
        height: 36,
        width: 36,
        backgroundColor: COLORS.secondary, // Customize as needed
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8
    },
    emptyChatContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        transform: [{ scaleY: -1 }], // Flips the container back to normal
    },
    emptyChatText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
    },

})