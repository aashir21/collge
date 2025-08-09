import { ActivityIndicator, StyleSheet, Text, TextInput, useWindowDimensions, View, FlatList } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { COLORS, SIZES, ENDPOINT } from '../../../constants/theme'
import MentionUserTab from "../../TagComps/MentionUserTab"
import * as SecureStore from "expo-secure-store"

const MentionScreen = ({ username, onClose, initialMentionUsers, handleSetMentionedUser, openMentionModal }) =>
{

    const { width } = useWindowDimensions()
    const [mention, setMention] = useState(username)
    const [results, setResults] = useState(initialMentionUsers)
    const [isLoading, setIsLoading] = useState(false)
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

        const currentUserId = SecureStore.getItem("__userId")

        searchDebounce = setTimeout(async () =>
        {
            if (searchQuery.length > 0)
            {
                try
                {
                    const response = await fetch(`${ENDPOINT.BASE_URL}/api/v2/search/getUsers?query=${searchQuery}&offset=0&pageSize=5&userId=${currentUserId}`);
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

    const handleMentionChange = (text) =>
    {
        if (text.length === 0)
        {
            onClose()
            return;
        }

        if (text[text.length - 1] === " ")
        {
            onClose()
            return;
        }

        setMention(text)
        handleSearch(text.substring(1))

    }


    return (
        <View style={{ width: width - 32, flex: 1 }}>
            <View style={{ flex: 0.8, justifyContent: "center", alignItems: "center" }}>
                {
                    isLoading ? <ActivityIndicator size={"small"} color={COLORS.whiteAccent} /> :
                        <FlatList
                            data={results}
                            scrollEnabled={true}
                            keyExtractor={(item) => item.userId.toString()}
                            renderItem={({ item }) => <MentionUserTab
                                userId={item.userId}
                                firstName={item.firstName}
                                lastName={item.lastName}
                                username={item.username}
                                avatar={item.avatar}
                                premiumUser={item.premiumUser}
                                role={item.role}
                                bgColor={COLORS.lightBlack}
                                handleSetMentionedUser={handleSetMentionedUser}
                                onClose={onClose}
                            />
                            }
                            keyboardShouldPersistTaps="always"
                        />
                }
            </View>
            <TextInput blurOnSubmit={true} onChangeText={handleMentionChange} placeholderTextColor={COLORS.whiteAccent} defaultValue={username} autoFocus placeholder='Search @' style={[styles.mentionInput, { width: width - 64 }]} />
        </View>
    )
}

export default MentionScreen

const styles = StyleSheet.create({

    mentionInput: {
        height: 56,
        backgroundColor: COLORS.lightBlack,
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
        borderRadius: SIZES.large,
        paddingHorizontal: SIZES.small,
        color: COLORS.tertiary

    }
})