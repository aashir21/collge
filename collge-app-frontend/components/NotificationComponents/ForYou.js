// @Authored by : Muhammad Aashir Siddiqui

import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, useWindowDimensions } from 'react-native'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import * as SecureStore from "expo-secure-store"
import { customFetch } from "../../utility/tokenInterceptor"
import { useToast } from 'react-native-toast-notifications'
import NotificationTab from './NotificationTab'
import NotificationForYouListHeader from './NotificationForYouListHeader'

const ForYou = () =>
{
    const toast = useToast()
    const [offset, setOffset] = useState(0);

    const [storageUserId, setStorageUserId] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const { width } = useWindowDimensions()

    const PAGE_SIZE = 7;

    const onRefresh = useCallback(async () =>
    {
        setRefreshing(true);
        setOffset(0)

        setTimeout(async () =>
        {
            try
            {
                const storedUserId = await fetchUserIdFromStorage(); // Ensure userId is fetched again on refresh
                if (storedUserId)
                {
                    setNotifications([])
                    await handleGetNotificationsByUserId(storedUserId, 0);


                } else
                {
                    throw new Error('User ID is null or undefined');
                }
            } catch (err)
            {
                console.error(err);
            } finally
            {
                setRefreshing(false);
            }
        }, 1000); // Adjust the delay (in milliseconds) as needed
    }, []);


    useEffect(() =>
    {

        const fetchData = async () =>
        {
            // First, fetch the user ID from storage
            const storedUserId = await fetchUserIdFromStorage();

            // Then, call the function to get notifications
            if (storedUserId)
            {
                await handleGetNotificationsByUserId(storedUserId, offset);
            }
        };

        fetchData();
    }, []);

    const fetchUserIdFromStorage = async () =>
    {
        const storedUserId = await SecureStore.getItemAsync("__userId");
        setStorageUserId(storedUserId); // Still update the state if you need it elsewhere
        return storedUserId;
    };

    const loadMoreNotifications = async () =>
    {
        const storedUserId = await fetchUserIdFromStorage();
        if (storedUserId)
        {
            await handleGetNotificationsByUserId(storedUserId, offset);
        }
    };

    const handleGetNotificationsByUserId = async (userId, offset) =>
    {
        try
        {

            setIsLoading(true)

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/notification/user?userId=${userId}&offset=${offset}&pageSize=${PAGE_SIZE}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (response.ok)
            {
                const data = await response.json()
                setOffset((prevOffset) => prevOffset + 1)

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

    if (isLoading)
    {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
                <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
            </View>
        )
    }

    return (
        <View style={styles.container}>

            {
                notifications.length > 0 ?
                    <View style={{ marginVertical: SIZES.large }}>
                        <FlatList
                            data={notifications}
                            ListHeaderComponent={<NotificationForYouListHeader />}
                            scrollEnabled={true}
                            keyboardShouldPersistTaps="always"
                            keyboardDismissMode="on-drag"
                            bounces={true}
                            keyExtractor={(item) => item.notificationId}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            renderItem={({ item }) =>
                            (
                                <NotificationTab universityId={item.universityId} userId={item.userId} commentId={item.commentId} postId={item.postId} actorId={item.actorId} createdAt={item.createdAt} message={item.message} notificationType={item.notificationType} username={item.username} avatar={item.avatar} role={item.role} isPremiumUser={item.isPremiumUser} />
                            )}

                        />
                    </View>
                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: COLORS.tertiary, fontFamily: FONT.bold, fontSize: SIZES.xxLarge, textAlign: "center" }}>
                            Notification Apocalypse 🌋
                        </Text>
                        <Text style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.medium, textAlign: "center", marginTop: SIZES.small }}>The world has gone silent (for now).</Text>
                    </View>
            }
        </View>
    )
}

export default ForYou

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary
    }

})