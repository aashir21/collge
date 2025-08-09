import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, SIZES, FONT, ENDPOINT } from '../../constants/theme'
import { customFetch } from '../../utility/tokenInterceptor'
import { fetchUserIdFromStorage } from "../../utility/general"
import { useToast } from 'react-native-toast-notifications'
import LinkUpInterestCard from '../LinkUp/LinkUpInterestCard'
import LinkUpInterestHeaderComponent from '../LinkUp/LinkUpInterestHeaderComponent'

const LinkUpRequestsList = () =>
{

    const [linkUpRequests, setLinkUpRequests] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [offset, setOffset] = useState(0)
    const toast = useToast()

    const PAGE_SIZE = 15;

    const fetchLinkUpRequests = async () =>
    {

        try
        {
            const userId = await fetchUserIdFromStorage()

            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/linkup/getAllLinkUpRequestsByAuthorId?authorId=${userId}&offset=${offset}&pageSize=${PAGE_SIZE}`, {
                method: "GET"
            })

            if (response.ok)
            {

                const data = await response.json()

                setLinkUpRequests([...linkUpRequests, ...data])
                setOffset((prevOffset) => prevOffset + 1)

            }
        } catch (e)
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

        fetchLinkUpRequests()

    }, [])

    return (
        <View style={styles.container}>

            {
                isLoading ? <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                    :
                    <FlatList
                        data={linkUpRequests}
                        ListHeaderComponent={<LinkUpInterestHeaderComponent />}
                        keyExtractor={(item) => item.interestId.toString()}
                        style={{ marginVertical: SIZES.large }}
                        renderItem={({ item }) =>
                        (
                            <LinkUpInterestCard
                                postId={item.postId}
                                userId={item.userId}
                                firstName={item.firstName}
                                lastName={item.lastName}
                                role={item.role}
                                username={item.username}
                                uniName={item.uniName}
                                campus={item.campus}
                                yearOfGraduation={item.yearOfGraduation}
                                images={item.images}
                                interests={item.interests}
                                premiumUser={item.premiumUser}
                                linkUpVerified={item.linkUpVerified}
                            />
                        )}
                        bounces={true}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={16}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => fetchLinkUpRequests(offset)}
                        ListEmptyComponent={<View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 200 }}>
                            <Text style={{ color: COLORS.tertiary, fontFamily: FONT.bold, fontSize: SIZES.xxLarge, textAlign: "center" }}>
                                Really dry in here 😣
                            </Text>
                            <Text style={{ color: COLORS.whiteAccent, fontFamily: FONT.regular, fontSize: SIZES.medium, textAlign: "center", marginTop: SIZES.small }}>No pending LinkUp requests</Text>
                        </View>}
                    />
            }

        </View>
    )
}

export default LinkUpRequestsList

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary,

        paddingHorizontal: SIZES.medium

    }


})