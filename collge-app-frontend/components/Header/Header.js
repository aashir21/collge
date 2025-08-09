import { Image, View, TouchableOpacity, useWindowDimensions, StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";
import { Feather, Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { router } from "expo-router";
import React from 'react'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Header = () =>
{

    const { width } = useWindowDimensions();


    return (
        <View testID="header-container" style={{ backgroundColor: COLORS.textAccent, position: "absolute", bottom: 0, width: width, alignSelf: "center" }}>

            <View style={[styles.container, { width: width - 32, alignSelf: "center", justifyContent: "space-between" }]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image testID="header-image" source={require("../../assets/images/collge.png")}
                        style={{ width: 100, height: 60, resizeMode: "contain", objectFit: "contain", marginRight: 8 }}
                    />
                    <FontAwesome5 name="university" size={20} color={COLORS.tertiary} />
                </View>
                <View style={{ justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                    <TouchableOpacity testID="search-button" onPress={() => router.push("/(tabs)/home/search/search")}>
                        <AntDesign name="search1" size={22} color={COLORS.tertiary} />
                    </TouchableOpacity>
                    <TouchableOpacity testID="notifications-button" style={{ marginHorizontal: SIZES.large }} onPress={() => router.push("/(tabs)/home/notifications")}>
                        <Feather name="bell" size={22} color={COLORS.tertiary} />
                    </TouchableOpacity>
                    <TouchableOpacity testID="chat-button" onPress={() => router.push("/chat")}>
                        <Ionicons name="paper-plane-outline" size={22} color={COLORS.tertiary} />
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    }
})