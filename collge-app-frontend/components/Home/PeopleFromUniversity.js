import { ActivityIndicator, Platform, StyleSheet, Text, useWindowDimensions, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SIZES, FONT, COLORS, ENDPOINT } from '../../constants/theme'
import * as SecureStore from "expo-secure-store";
import { useToast } from 'react-native-toast-notifications';
import GeneralLoading from "../Loading/GeneralLoading"
import SearchResult from '../SearchComponents/SearchResult';
import UserFromUniversityCard from '../SearchComponents/UserFromUniversityCard';

const PeopleFromUniversity = () =>
{

    const { width } = useWindowDimensions()
    const [offset, setOffset] = useState(0);
    const [users, setUsers] = useState([])
    const PAGE_SIZE = 6;
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(true)

    const fetchUsersFromUniversity = async () =>
    {

        try
        {
            const userId = SecureStore.getItem("__universityId");

            const response = await fetch(`${ENDPOINT.BASE_URL}/api/v1/user/getAllUsersOfAUniversity?universityId=${userId}&offset=${offset}&pageSize=${PAGE_SIZE}`)

            if (response.ok)
            {
                const data = await response.json()
                setUsers([...users, ...data]);
                setOffset((prevOffset) => prevOffset + 1)
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

        fetchUsersFromUniversity()

    }, [])

    if (isLoading)
    {
        return <GeneralLoading title={"Lets see who's here 🔎"} size={"small"} color={COLORS.whiteAccent} />
    }

    return (
        <View>
            <View style={{ paddingBottom: SIZES.large, paddingTop: SIZES.medium }}>
                <Text style={[styles.recentHeading, { width: width, paddingLeft: SIZES.large }]}>People from your university</Text>
            </View>
            <FlatList
                data={users}
                keyExtractor={(item) => item.userId.toString()}
                style={{ paddingBottom: SIZES.large }}
                renderItem={({ item }) =>
                    <UserFromUniversityCard
                        userId={item.userId}
                        firstName={item.firstName}
                        lastName={item.lastName}
                        username={item.username}
                        avatar={item.avatar}
                        premiumUser={item.isPremiumUser}
                        role={item.role}
                    />
                }
                initialNumToRender={PAGE_SIZE}
                scrollEventThrottle={16}
                onEndReachedThreshold={0.5}
                bounces={true}
                onEndReached={() => fetchUsersFromUniversity()}
                numColumns={2}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    )
}

export default PeopleFromUniversity

const styles = StyleSheet.create({

    recentHeading: {

        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.tertiary,
        textDecorationLine: Platform.OS === "ios" ? "underline" : "none",
        textDecorationStyle: "dotted",
        textDecorationColor: COLORS.secondary,

    },
    recentContainer: {
        marginTop: SIZES.medium,
        alignItems: "center",
        flex: 1
    },


})