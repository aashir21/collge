import { Platform, StatusBar, StyleSheet, Text, useWindowDimensions, View, Switch, SafeAreaView, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, FONT, NOTIFICATION_TYPES, SIZES, ENDPOINT } from "../../constants/theme"
import { useToast } from 'react-native-toast-notifications'
import { customFetch } from '../../utility/tokenInterceptor'
import NotificationTab from "../NotificationComponents/NotificationTab"
import * as SecureStore from "expo-secure-store"
import { debounce } from "lodash"
import SpanText from '../General Component/SpanText'

const Wink = () =>
{

    const { width } = useWindowDimensions()
    const toast = useToast()

    const [winkToggle, setWinkToggle] = useState({
        isAllowed: true,
        message: "Other students can wink at you"
    });
    const [isLoading, setIsLoading] = useState(false)
    const [storageUserId, setStorageUserId] = useState()
    const [winks, setWinks] = useState([])

    const offset = useRef(0);

    const handleToggleSwitch = () =>
    {

        setWinkToggle({
            isAllowed: !winkToggle.isAllowed,
            message: winkToggle.isAllowed != true ? "Other students can wink at you" : "Nobody can wink at you."
        });

        debouncedUpdateWinkStatus()

    }

    const debouncedUpdateWinkStatus = debounce(async () =>
    {
        try
        {
            const response = await fetch(
                `${ENDPOINT.BASE_URL}/api/v1/user/updateWinkableStatus?userId=${storageUserId}&status=${!winkToggle.isAllowed}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok)
            {
                throw new Error('Failed to update wink status');
            }

        } catch (error)
        {
            toast.show('Could not update wink status', {
                type: 'normal',
                duration: 3000,
                swipeEnabled: true,
                placement: 'top',
            });
        }
    }, 500);

    const handleGetWinkStatus = async () =>
    {

        try
        {
            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/user/getWinkableStatus?userId=${storageUserId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (response.ok)
            {
                const data = await response.json()

                setWinkToggle({
                    isAllowed: Boolean(data),
                    message: data == true ? "Other students can wink at you" : "Nobody can wink at you."
                });

            }
        } catch
        {
            toast.show("Could not get wink status", {
                type: "normal",
                duration: 3000,
                swipeEnabled: true,
                placement: "top"
            })
        }

    }

    const handleFetchWinkNotifications = async () =>
    {

        try
        {
            setIsLoading(true)

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/notification/getNotificationsByTypeForUser?userId=${storageUserId}&notificationType=${NOTIFICATION_TYPES.WINK}&offset=${offset.current}&pageSize=10`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (response.ok)
            {

                const data = await response.json()
                setWinks([...winks, ...data])
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

        handleUserIdFromStorage()

        if (storageUserId)
        {
            handleFetchWinkNotifications()
            handleGetWinkStatus()
        }

    }, [storageUserId]);

    return (
        <SafeAreaView style={[styles.container]}>
            <View style={{ width: width - 32, alignSelf: "center" }}>

                {
                    isLoading ? <View style={{ height: "100%", justifyContent: "center", alignContent: "center" }}><ActivityIndicator size={"small"} color={COLORS.whiteAccent} /></View> :
                        (winks.length > 0 || winks === null) ?
                            <FlatList
                                style={{ marginTop: SIZES.medium }}
                                data={winks}
                                scrollEnabled={true}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode="on-drag"
                                bounces={true}
                                keyExtractor={(item) => item.notificationId}
                                renderItem={({ item, index }) =>
                                (

                                    <View>
                                        {
                                            index === 0 &&
                                            <View style={{ marginBottom: SIZES.small }}>
                                                <Text style={styles.winkTitle}>People who have
                                                    <SpanText subtext={" winked "} />
                                                    at you.
                                                </Text>

                                                <View style={styles.toggleContainer}>
                                                    <Text style={{ color: COLORS.whiteAccent }}>{winkToggle.message}</Text>
                                                    <Switch onValueChange={handleToggleSwitch} value={winkToggle.isAllowed} thumbColor={COLORS.tertiary} trackColor={{ false: '#767577', true: COLORS.secondary }} />
                                                </View>
                                            </View>
                                        }
                                        <NotificationTab commentId={item.commentId} postId={item.postId} actorId={item.actorId} createdAt={item.createdAt} message={item.message} notificationType={item.notificationType} username={item.username} avatar={item.avatar} role={item.role} isPremiumUser={item.isPremiumUser} />
                                    </View>
                                )}
                            />
                            :
                            <View style={{ marginVertical: SIZES.medium }}>
                                <View style={{ marginBottom: SIZES.small }}>
                                    <Text style={styles.winkTitle}>People who have
                                        <SpanText subtext={" winked "} />
                                        at you.
                                    </Text>

                                    <View style={styles.toggleContainer}>
                                        <Text style={{ color: COLORS.whiteAccent }}>{winkToggle.message}</Text>
                                        <Switch onValueChange={handleToggleSwitch} value={winkToggle.isAllowed} thumbColor={COLORS.tertiary} trackColor={{ false: '#767577', true: COLORS.secondary }} />
                                    </View>
                                </View>
                                <View style={{ height: "75%", justifyContent: "center" }}>
                                    <Text style={styles.emptyStateTitle}>No one has winkted at you....yet 😐</Text>
                                </View>
                            </View>
                }



            </View>
        </SafeAreaView>
    )
}

export default Wink

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 0,
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