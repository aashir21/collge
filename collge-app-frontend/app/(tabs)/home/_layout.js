import { Link, Stack, router } from "expo-router";
import { Image, Button, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Platform } from "react-native";
import { COLORS, SIZES, ANIMATION } from "../../../constants/theme";
import { Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';



export default function HomeLayout()
{
    return (
        <Stack>

            <Stack.Screen name="feeds" options={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, animation: "slide_from_right", animationDuration: ANIMATION.duration }} />
            <Stack.Screen name="search/search"
                options={{
                    headerShown: false,
                    animation: `${ANIMATION.style}`,
                    animationDuration: ANIMATION.duration

                }}

            />

            <Stack.Screen name="user/[id]" options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }}></Stack.Screen>
            <Stack.Screen name="reels/[id]" options={{ headerShown: false, animation: "slide_from_right", animationDuration: 150 }}></Stack.Screen>
            <Stack.Screen name="likes" options={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, animation: "slide_from_right", animationDuration: ANIMATION.duration }}></Stack.Screen>
            <Stack.Screen name="notifications" options={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, animation: "slide_from_right", animationDuration: ANIMATION.duration }} />
            <Stack.Screen name="post" options={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, animation: "slide_from_right", animationDuration: ANIMATION.duration }} />
            <Stack.Screen name="comments" options={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, animation: "slide_from_right", animationDuration: ANIMATION.duration }} />
            <Stack.Screen name="requests" options={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, animation: "slide_from_right", animationDuration: ANIMATION.duration }} />
            <Stack.Screen name="friends/[id]" options={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, animation: "slide_from_right", animationDuration: ANIMATION.duration }} />
            <Stack.Screen name="friends/user/[id]" options={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, animation: "slide_from_right", animationDuration: ANIMATION.duration }} />
            <Stack.Screen name="nearby" options={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, animation: "slide_from_right", animationDuration: ANIMATION.duration }} />

        </Stack >
    )
}