import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import * as SecureStore from "expo-secure-store"
import { customFetch } from "../../utility/tokenInterceptor"
import { useToast } from 'react-native-toast-notifications'
import UniNotificationTab from './UniNotificationTab'

const UniveristyNotifications = () =>
{
    const toast = useToast()
    const [offset, setOffset] = useState(0);

    const [storageUserId, setStorageUserId] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const PAGE_SIZE = 7;

    const onRefresh = useCallback(async () =>
    {
        setRefreshing(true);

        setTimeout(async () =>
        {
            try
            {
                const storedUniId = await fetchUniIdFromStorage(); // Ensure userId is fetched again on refresh
                if (storedUniId)
                {
                    setNotifications([])
                    await handleGetNotificationsByUserId(storedUniId, 0);
                    setOffset(0)

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
            const storedUniId = await fetchUniIdFromStorage();

            // Then, call the function to get notifications
            if (storedUniId)
            {
                await handleGetNotificationsByUserId(storedUniId, offset);
            }
        };

        fetchData();
    }, []);

    const fetchUniIdFromStorage = async () =>
    {
        const storedUniId = await SecureStore.getItemAsync("__universityId");
        setStorageUserId(storedUniId); // Still update the state if you need it elsewhere
        return storedUniId;
    };


    const handleGetNotificationsByUserId = async (universityId, offset) =>
    {
        try
        {

            setIsLoading(true)

            const currentUserId = SecureStore.getItem("__userId");

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v2/notification/university?universityId=${universityId}&offset=${offset}&pageSize=${PAGE_SIZE}&userId=${currentUserId}`, {
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
                                <UniNotificationTab
                                    postId={item.postId}
                                    actorId={item.actorId}
                                    userId={item.userId}
                                    createdAt={item.createdAt}
                                    notificationType={item.notificationType}
                                    actorUsername={item.actorUsername}
                                    receiverUsername={item.receiverUsername}
                                    receiverAvatar={item.receiverAvatar}
                                    actorAvatar={item.actorAvatar}
                                    role={item.role}
                                    isPremiumUser={item.isPremiumUser}
                                />

                            )}

                        />
                    </View>
                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: COLORS.tertiary, fontFamily: FONT.bold, fontSize: SIZES.xxLarge, textAlign: "center" }}>
                            Has everybody gone home? 🤔
                        </Text>
                        <Text style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.medium, textAlign: "center", marginTop: SIZES.small }}>No activity in your university.</Text>
                    </View>
            }
        </View>
    )
}

export default UniveristyNotifications

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: COLORS.primary
    }
})