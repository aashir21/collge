import { StyleSheet, Text, View, Image, useWindowDimensions, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'

import { useFonts } from "expo-font"

const OnboardingItem = ({ item }) =>
{

    const { width } = useWindowDimensions()
    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf")
    })

    return (
        <ImageBackground source={item.image}>

            <View style={[styles.container, width, { flex: 0.7, justifyContent: "center", alignItems: "center" }]}>

                <View style={{ flex: 0.3, justifyContent: "center", alignItems: "center" }}>

                    <Text style={[styles.title, { width: width }]}>{item.title}</Text>
                    <Text style={[styles.description, { width }]}>{item.description}</Text>

                </View>

            </View>
        </ImageBackground>
    )
}

export default OnboardingItem

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {

        flex: 0.7,
        justifyContent: "center",

    },
    title: {

        fontSize: 42,
        marginBottom: 16,
        color: "#FAFAFA",
        textAlign: "left",
        paddingHorizontal: 32,
        flexWrap: "wrap",
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,
        fontFamily: "Poppins-Bold"

    },
    description: {

        color: "#FAFAFA",
        fontSize: 18,
        textAlign: "left",
        marginVertical: 8,
        paddingHorizontal: 32,
        lineHeight: 32,
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,
        fontFamily: "Poppins-Regular"
    },
    animation: {
        flex: 0.6,
        height: 500,
        width: 500
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover"

    }

})