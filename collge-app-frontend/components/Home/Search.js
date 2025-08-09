import { SafeAreaView, StyleSheet, Text, View, useWindowDimensions, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Platform, KeyboardAvoidingView, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, SIZES, FONT, UNDERLINE, ENDPOINT } from '../../constants/theme'
import { Link, router } from "expo-router"
import { Ionicons } from '@expo/vector-icons';
import SearchResult from '../SearchComponents/SearchResult';
import EmptyState from "../../components/General Component/EmptyState"
import SearchSkeleton from '../Loading/SearchSkeleton';
import * as SecureStore from 'expo-secure-store';
import { FlashList } from '@shopify/flash-list';
import PeopleFromUniversity from './PeopleFromUniversity';


const Search = () =>
{
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [offset, setOffset] = useState(0)
    const { width } = useWindowDimensions();
    let searchDebounce = null;

    const handleSearch = (searchQuery) =>
    {
        clearTimeout(searchDebounce); // Clear the current debounce timer on each keystroke
        setIsLoading(true)
        if (!searchQuery.trim().length)
        {
            setResults([]); // Clear results if the query is invalid
            return; // Exit the function early
        }

        const currentUserId = SecureStore.getItem("__userId");

        searchDebounce = setTimeout(async () =>
        {
            if (searchQuery.length > 0)
            {
                try
                {
                    const response = await fetch(`${ENDPOINT.BASE_URL}/api/v2/search/getUsers?query=${searchQuery}&offset=${offset}&pageSize=5&userId=${currentUserId}`);
                    const data = await response.json();
                    setResults(data)

                } catch (error)
                {
                    console.error('Error fetching data:', error);
                    setResults([]);
                }
                finally
                {
                    setIsLoading(false)
                }
            }
            else
            {
                setResults([]);
            }
        }, 750); // Wait 500ms after the last keystroke to make the request
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "android" ? null : null}>
                <TouchableWithoutFeedback onPress={() =>
                {
                    Keyboard.dismiss()
                }
                }
                >
                    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", width: width }}>
                        <View style={[styles.inputContainter, { width: width }]}>
                            <TouchableOpacity style={{ marginLeft: SIZES.small }} onPress={() => router.back()}>
                                <Ionicons name="chevron-back-sharp" size={36} color={COLORS.tertiary} />
                            </TouchableOpacity>
                            <TextInput value={query}
                                onChangeText={(text) =>
                                {
                                    setQuery(text);
                                    handleSearch(text);
                                }} placeholderTextColor={COLORS.tertiary} autoCapitalize='none' placeholder='Search Collge...' style={[styles.input, { width: width - 72 }]}></TextInput>
                        </View>
                        <View>
                            {
                                query.length === 0 ?
                                    <PeopleFromUniversity />
                                    :
                                    <View style={{ flex: 1 }}>
                                        {
                                            isLoading ? <View style={{ flex: 1, marginVertical: SIZES.medium }}>
                                                <SearchSkeleton />
                                            </View>
                                                :
                                                <View style={{ marginVertical: SIZES.medium }}>
                                                    {
                                                        results.length > 0 ? <FlatList
                                                            data={results}
                                                            scrollEnabled={true}
                                                            keyExtractor={(item) => item.userId.toString()}
                                                            renderItem={({ item }) => <SearchResult
                                                                userId={item.userId}
                                                                firstName={item.firstName}
                                                                lastName={item.lastName}
                                                                username={item.username}
                                                                avatar={item.avatar}
                                                                premiumUser={item.premiumUser}
                                                                role={item.role}
                                                                bgColor={COLORS.textAccent}
                                                                cardOnPress={null}
                                                            />
                                                            }
                                                            initialNumToRender={5}
                                                            scrollEventThrottle={16}
                                                        /> : <EmptyState />
                                                    }
                                                </View>
                                        }
                                    </View>
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

export default Search

const styles = StyleSheet.create({

    inputContainter: {
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: Platform.OS === "android" ? 56 : 12
    },

    input: {
        height: 52,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: SIZES.small,
        borderColor: COLORS.tertiary,
        color: COLORS.tertiary,
        fontFamily: FONT.regular
    },
    recentHeading: {

        fontFamily: FONT.bold,
        fontSize: SIZES.medium,
        color: COLORS.tertiary,
        textDecorationLine: Platform.OS === "ios" ? "underline" : "none",
        textDecorationStyle: "dotted",
        textDecorationColor: COLORS.secondary,

    },
    recentContainer: {
        marginVertical: SIZES.medium,
        alignItems: "center",
        textAlign: "left",
    },
    notFound: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.whiteAccent
    }
})