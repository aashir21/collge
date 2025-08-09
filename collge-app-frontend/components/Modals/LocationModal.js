import React, { useState, useRef, useEffect } from 'react';
import { Animated, Keyboard, Modal, Image, StyleSheet, TextInput, TouchableOpacity, View, Text, Easing, ActivityIndicator, useWindowDimensions, FlatList, Platform, Dimensions, PanResponder, Pressable } from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import { Octicons } from '@expo/vector-icons';
import GeoTab from "../LocationBtnComp/GeoTab"
import POITab from "../LocationBtnComp/POITab"
import StreetTab from "../LocationBtnComp/StreetTab"
import DefaultTab from '../LocationBtnComp/DefaultTab';

const LocationModal = ({ isVisible, onClose, handleLocation }) =>
{
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const translateY = useRef(new Animated.Value(0)).current;
    const windowHeight = Dimensions.get('window').height;
    const [isLoading, setIsLoading] = useState(false)
    const [locations, setLocations] = useState([])
    const [input, setInput] = useState("")
    const textInputRef = useRef(null);
    const { width } = useWindowDimensions()
    const locationName = useRef(null)

    useEffect(() =>
    {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) =>
        {
            setKeyboardHeight(event.endCoordinates.height);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (event) =>
        {
            setKeyboardHeight(0);
        });

        return () =>
        {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() =>
    {
        {
            Platform.OS === "ios" ?
                Animated.timing(translateY, {
                    toValue: isVisible ? -keyboardHeight : 0,
                    duration: 150,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }).start()
                : Animated.timing(translateY, {
                    toValue: 0,
                    duration: 150,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }).start();

        }
    }, [isVisible, keyboardHeight]);


    const animatedStyles = {
        transform: [{ translateY }],
    };

    const handleFormSubmit = async () =>
    {
        try
        {
            locationName.current = input
            setIsLoading(true)
            const response = await fetch(`https://api.tomtom.com/search/2/search/${input}.json?limit=20&minFuzzyLevel=1&maxFuzzyLevel=2&idxSet=Geo%2CPOI&view=Unified&relatedPois=off&key=ggfpdouSBl4GUNvXruYDGeBKcCGHHt6t`)
            if (response.ok)
            {
                const data = await response.json()
                setLocations(data.results)
            }
        } catch (err)
        {
            console.log(err);
        }
        finally
        {
            setIsLoading(false)
        }


    }

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
                <Animated.View
                    style={[styles.modalContent, animatedStyles]}>
                    <View style={styles.locationContainer}>

                        {
                            isLoading ? <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                                :
                                locations.length > 0 ?
                                    <FlatList

                                        data={locations}
                                        scrollEnabled={true}
                                        keyExtractor={(item) => item.id.toString()}
                                        keyboardShouldPersistTaps="always"
                                        renderItem={({ item, index }) =>
                                        (
                                            <View>
                                                {
                                                    item.type === "Street" ? <StreetTab />
                                                        :
                                                        item.type === "Geography" ? <GeoTab onClose={onClose} handleLocation={handleLocation} name={item.address.freeformAddress} />
                                                            :
                                                            item.type === "POI" ? <POITab onClose={onClose} handleLocation={handleLocation} name={item.poi.name} localName={item.address.localName} /> : null
                                                }
                                            </View>
                                        )}
                                        ListFooterComponent={<DefaultTab name={locationName.current} handleLocation={handleLocation} onClose={onClose}></DefaultTab>}
                                        ListEmptyComponent={<Text style={{ fontFamily: FONT.regular, color: COLORS.tertiary, fontSize: SIZES.medium }}>No results found...</Text>}
                                    />
                                    : <View>
                                        <Image style={styles.modalImg} source={require("../../assets/images/location-pin.webp")} />
                                        <Text style={styles.locationText}>Search a location to get started...</Text>
                                    </View>
                        }

                    </View>

                    <View style={[styles.inputContainer, { width: width - 32, alignSelf: "center" }]}>
                        <TextInput
                            ref={textInputRef}
                            style={styles.textInput}
                            blurOnSubmit={false}
                            autoFocus={true}
                            placeholder="Search location"
                            placeholderTextColor={COLORS.whiteAccent}
                            onChangeText={newText => setInput(newText)}
                            defaultValue={input}
                        />
                        <TouchableOpacity style={styles.searchBtn} onPress={handleFormSubmit} >
                            <Octicons name="search" size={22} color={COLORS.tertiary} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.textAccent,
        height: 350,
        paddingTop: 30,
        alignItems: "center",
        borderTopLeftRadius: SIZES.large,
        borderTopRightRadius: SIZES.large,
        justifyContent: "flex-end",

    },
    modalImg: {
        height: 124,
        width: 124,
        alignSelf: "center"
    },
    textInput: {
        width: "85%",
        height: 56,
        borderRadius: SIZES.large,
        backgroundColor: COLORS.lightBlack,
        paddingHorizontal: SIZES.small,
        alignSelf: "flex-start",
        fontFamily: FONT.regular,
        color: COLORS.tertiary
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10
    },
    locationContainer: {
        height: "80%",
        justifyContent: "center",
        alignItems: "center"
    },
    locationText: {
        fontSize: SIZES.medium,
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        textAlign: "center"
    },
    searchBtn: {
        marginLeft: SIZES.xSmall,
        backgroundColor: COLORS.secondary,
        height: 44,
        width: 44,
        borderRadius: 27,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default LocationModal;
