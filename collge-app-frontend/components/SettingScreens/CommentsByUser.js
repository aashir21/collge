import { Platform, StatusBar, StyleSheet, Text, useWindowDimensions, View, Switch, SafeAreaView, ActivityIndicator, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, FONT, NOTIFICATION_TYPES, SIZES, ENDPOINT } from "../../constants/theme"
import { useToast } from 'react-native-toast-notifications'
import { customFetch } from '../../utility/tokenInterceptor'
import Comment from './SettingsComponents/Comment'
import * as SecureStore from "expo-secure-store"
import SpanText from "../General Component/SpanText"
import { router } from 'expo-router'

const CommentsMadeByUser = () =>
{

    const { width } = useWindowDimensions()
    const toast = useToast()

    const [isLoading, setIsLoading] = useState(false)
    const [storageUserId, setStorageUserId] = useState()
    const [comments, setComments] = useState([])

    const offset = useRef(0);

    const handleFetchCommentsByUserId = async () =>
    {

        try
        {
            setIsLoading(true)

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/comment/getCommentsByUserId?userId=${storageUserId}&offset=${offset.current}&pageSize=10`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (response.ok)
            {

                const data = await response.json()
                setComments([...comments, ...data])

                offset.current += 1;

            }

        } catch (err)
        {

            toast.show("Something went wrong", {
                type: "normal",
                duration: 3000,
                swipeEnabled: true,
                placement: "top"
            })

        }
        finally
        {
            setIsLoading(false)
        }

    }

    const handleUserIdFromStorage = async () =>
    {

        const rawUserId = await SecureStore.getItemAsync("__userId");

        if (rawUserId)
        {
            setStorageUserId(rawUserId)
        }

    }

    useEffect(() =>
    {


        Promise.all([handleUserIdFromStorage()])

        if (storageUserId)
        {
            handleFetchCommentsByUserId()
        }

    }, [storageUserId]);



    return (
        <SafeAreaView style={[styles.container]}>
            <View style={{ width: width - 32, alignSelf: "center" }}>

                {
                    isLoading ? <View style={{ height: "100%", justifyContent: "center", alignContent: "center" }}><ActivityIndicator size={"small"} color={COLORS.whiteAccent} /></View> :
                        (comments.length > 0 || comments === null) ?
                            <FlatList
                                style={{ marginTop: SIZES.medium }}
                                data={comments}
                                scrollEnabled={true}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode="on-drag"
                                bounces={true}
                                keyExtractor={(item) => item.commentId}
                                renderItem={({ item, index }) =>
                                (
                                    <View>
                                        {
                                            index === 0 &&
                                            <Text style={[styles.winkTitle, { marginBottom: SIZES.small }]}>Comments made by
                                                <SpanText subtext={" you."} />
                                            </Text>
                                        }
                                        <Comment userId={storageUserId} postId={item.postId} opacity={1} comment={item.comment} username={item.username} createdAt={item.createdAt} avatar={item.avatar} repliesCount={0} role={item.role} isPremiumUser={item.isPremiumUser} />
                                    </View>
                                )}
                            />
                            :
                            <View style={{ height: "100%", marginTop: Platform.OS === "android" ? StatusBar.currentHeight + 16 : 0 }}>
                                <View style={{ flex: 0.2 }}>
                                    <Text style={[styles.winkTitle, { marginBottom: SIZES.small }]}>Comments made by
                                        <SpanText subtext={" you."} />
                                    </Text>
                                </View>
                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={styles.emptyStateTitle}>You haven't commented on anyone's post 🙊</Text>
                                </View>
                            </View>
                }
            </View>
        </SafeAreaView>
    )
}

export default CommentsMadeByUser

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    winkTitle: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.xxLarge
    },
    toggleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: Platform.OS === "android" ? 0 : SIZES.xSmall
    },
    emptyStateTitle: {
        color: COLORS.tertiary,
        textAlign: "center",
        fontSize: SIZES.xLarge,
        fontFamily: FONT.bold,
    }

})