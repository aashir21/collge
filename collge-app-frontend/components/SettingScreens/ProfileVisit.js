import { Platform, StatusBar, StyleSheet, Text, useWindowDimensions, View, Switch, SafeAreaView, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, FONT, NOTIFICATION_TYPES, SIZES, ENDPOINT } from "../../constants/theme"
import { useToast } from 'react-native-toast-notifications'
import { customFetch } from '../../utility/tokenInterceptor'
import NotificationTab from "../NotificationComponents/NotificationTab"
import * as SecureStore from "expo-secure-store"
import GetBlaze from '../BlazeComponents/GetBlaze'
import SpanText from '../General Component/SpanText'

const ProfileVisit = () =>
{

    const { width } = useWindowDimensions()
    const toast = useToast()

    const [isLoading, setIsLoading] = useState(false)
    const [storageUserId, setStorageUserId] = useState()
    const [isPremiumUser, setIsPremiumUser] = useState();
    const [visits, setVisits] = useState([])

    const offset = useRef(0);

    const handleFetchProfileVisitNotifications = async () =>
    {

        try
        {
            setIsLoading(true)

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/notification/getNotificationsByTypeForUser?userId=${storageUserId}&notificationType=${NOTIFICATION_TYPES.PROFILE_VISIT}&offset=${offset.current}&pageSize=10`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (response.ok)
            {

                const data = await response.json()
                setVisits([...visits, ...data])
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

    const handleGetPremiumStatusFromStorage = async () =>
    {

        const premiumStatus = await SecureStore.getItemAsync("__isPremiumUser");

        if (premiumStatus)
        {
            setIsPremiumUser(premiumStatus);
        }

    }

    useEffect(() =>
    {


        Promise.all([handleUserIdFromStorage(), handleGetPremiumStatusFromStorage()])

        if (storageUserId)
        {
            handleFetchProfileVisitNotifications()
        }

    }, [storageUserId]);

    if (isPremiumUser === "false")
    {

        return <GetBlaze subTitle={"...and discover who's checking you out."} />

    }


    return (
        <SafeAreaView style={[styles.container]}>
            <View style={{ width: width - 32, alignSelf: "center" }}>
                {
                    isLoading ? <View style={{ height: "80%", justifyContent: "center", alignContent: "center" }}><ActivityIndicator size={"small"} color={COLORS.whiteAccent} /></View> :
                        (visits.length > 0 || visits === null) ?
                            <FlatList
                                data={visits}
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
                                            <Text style={[styles.winkTitle, { marginBottom: SIZES.medium }]}>People
                                                <SpanText subtext={" who visited "} />
                                                your profile.
                                            </Text>
                                        }
                                        <NotificationTab commentId={item.commentId} postId={item.postId} actorId={item.actorId} createdAt={item.createdAt} message={item.message} notificationType={item.notificationType} username={item.username} avatar={item.avatar} role={item.role} isPremiumUser={item.isPremiumUser} />
                                    </View>
                                )}
                            />
                            :
                            <View style={{ marginVertical: SIZES.medium }}>
                                <View style={{ marginBottom: SIZES.small }}>
                                    <Text style={[styles.winkTitle, { marginBottom: SIZES.medium }]}>People
                                        <SpanText subtext={" who visited "} />
                                        your profile.
                                    </Text>
                                </View>
                                <View style={{ height: "75%", justifyContent: "center" }}>
                                    <Text style={styles.emptyStateTitle}>No visitors yet &#128517;</Text>
                                </View>
                            </View>
                }
            </View>
        </SafeAreaView>
    )
}

export default ProfileVisit

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 16 : 0,
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