import { Stack } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from "../../../constants/theme";
import { Platform } from "react-native";
import { ANIMATION } from "../../../constants/theme"

export default function HomeLayout()
{
    return <Stack initialRouteName="index" screenOptions={{
        headerShown: false, headerTitle: "",
        headerRight: () =>
        {
            return (
                <AntDesign name="setting" size={24} color={COLORS.tertiary} />
            )
        }
    }} >

        <Stack.Screen name="settings" options={{ animationDuration: ANIMATION.duration, animation: ANIMATION.style, headerShown: false }}></Stack.Screen>
        <Stack.Screen name="index"></Stack.Screen>
        <Stack.Screen name="reels/[id]" options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
        <Stack.Screen name="comments" options={{ animationDuration: ANIMATION.duration, animation: ANIMATION.style, headerShown: false }}></Stack.Screen>
        <Stack.Screen name="user/[id]" options={{ animationDuration: ANIMATION.duration, animation: ANIMATION.style, headerShown: false }}></Stack.Screen>
    </Stack>;
}