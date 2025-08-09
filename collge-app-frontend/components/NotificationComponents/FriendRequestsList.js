import { ActivityIndicator, StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, SIZES, FONT, NOTIFICATION_TYPES, ENDPOINT } from '../../constants/theme'
import NotificationTab from './NotificationTab'
import { useToast } from 'react-native-toast-notifications'
import * as SecureStore from "expo-secure-store"
import { customFetch } from '../../utility/tokenInterceptor'
import SpanText from "../General Component/SpanText"

const FriendRequestsList = () =>
{

    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const offset = useRef(0)
    const toast = useToast()
    const PAGE_SIZE = 15;

    const handleGetNotificationsByUserIdAndType = async () =>
    {

        const userId = await SecureStore.getItem("__userId");

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/notification/getNotificationsByTypeForUser?userId=${userId}&notificationType=${NOTIFICATION_TYPES.FRIEND_REQUEST}&offset=${offset.current}&pageSize=${PAGE_SIZE}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (response.ok)
            {
                const data = await response.json()
                offset.current += 1

                setNotifications([...notifications, ...data])
            }
        } catch (err)
        {
            console.log(err);

            toast.show("Something went wrong", {
                placement: "top",
                type: "normal",
                duration: 3000,
                animationType: "slide-in",
            })
        }
        finally
        {
            setIsLoading(false)
        }

    }

    useEffect(() =>
    {

        handleGetNotificationsByUserIdAndType()

    }, [])

    if (isLoading)
    {
        return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}><ActivityIndicator size={"small"} color={COLORS.whiteAccent} /></View>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Friend Requests</Text>
            <Text style={styles.subTitle}>Grow your network</Text>
            {
                notifications.length > 0 ?
                    <View style={{ marginVertical: SIZES.large }}>
                        <FlatList
                            data={notifications}
                            scrollEnabled={true}
                            keyboardShouldPersistTaps="always"
                            keyboardDismissMode="on-drag"
                            bounces={true}
                            keyExtractor={(item) => item.notificationId}
                            renderItem={({ item }) =>
                            (
                                <NotificationTab universityId={item.universityId} userId={item.userId} commentId={item.commentId} postId={item.postId} actorId={item.actorId} createdAt={item.createdAt} message={item.message} notificationType={item.notificationType} username={item.username} avatar={item.avatar} role={item.role} isPremiumUser={item.isPremiumUser} />
                            )}

                        />
                    </View>
                    :
                    <View style={{ flex: 1, alignItems: "center", marginTop: 200 }}>
                        <Text style={{ color: COLORS.tertiary, fontFamily: FONT.bold, fontSize: SIZES.xxLarge, textAlign: "center" }}>
                            You're all <SpanText subtext={"caught"} /> up!
                        </Text>
                        <Text style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.medium, textAlign: "center", marginTop: SIZES.small }}>No pending friend requests</Text>
                    </View>
            }
        </View>
    )
}

export default FriendRequestsList

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.large,
        paddingHorizontal: SIZES.medium

    },
    title: {
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.tertiary
    },
    subTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.whiteAccent
    }

})