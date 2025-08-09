import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import GeneralLoading from "../Loading/GeneralLoading"
import { useToast } from 'react-native-toast-notifications'
import * as SecureStore from "expo-secure-store"
import BlockedUserTab from '../Common-Tabs/BlockedUserTab'

const BlockedUsers = () =>
{

    const [isLoading, setIsLoading] = useState(true)
    const [offset, setOffset] = useState(0);
    const [users, setUsers] = useState([])
    const toast = useToast()

    const fecthBlockedUsers = async () =>
    {
        try
        {
            const currentUserId = SecureStore.getItem("__userId")
            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/user/block/getAllBlockedUsers?userId=${currentUserId}&offset=${offset}&pageSize=5`)

            if (response.ok)
            {
                const data = await response.json()
                setUsers([...data, ...users])
                setOffset((prevOffset) => prevOffset + 1);
            }

        } catch (err)
        {
            toast.show("Something went wrong...", {
                placement: "top",
                duration: 3500,
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

        fecthBlockedUsers()

    }, [])


    if (isLoading)
    {
        return <GeneralLoading />
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Blocked Users</Text>

            {
                users.length > 0 ?
                    <FlatList
                        data={users}
                        scrollEnabled={true}
                        keyExtractor={(item) => item.userId.toString()}
                        renderItem={({ item }) =>
                            <BlockedUserTab
                                userId={item.userId}
                                firstName={item.firstName}
                                lastName={item.lastName}
                                username={item.username}
                                avatar={item.avatar}
                                premiumUser={item.isPremiumUser}
                                role={item.role}
                            />
                        }
                        estimatedItemSize={5}
                        keyboardShouldPersistTaps="always"
                    />
                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: COLORS.tertiary, fontFamily: FONT.bold, fontSize: SIZES.xLarge + 2 }}>No users blocked! 🥳</Text>
                    </View>
            }

        </SafeAreaView>
    )
}

export default BlockedUsers

const styles = StyleSheet.create({

    container: {
        backgroundColor: COLORS.primary,
        flex: 1
    },
    title: {
        padding: SIZES.large,
        color: COLORS.tertiary,
        fontFamily: FONT.bold,
        fontSize: SIZES.xLarge + 2
    }

})