import { Stack } from "expo-router";
import { ANIMATION } from "../../../constants/theme";

export default function HomeLayout()
{

    return (

        <Stack screenOptions={{ animation: "slide_from_right" }}>
            <Stack.Screen options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} name="index"></Stack.Screen>
            <Stack.Screen options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} name="postinfo"></Stack.Screen>
            <Stack.Screen options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} name="confession-create"></Stack.Screen>
            <Stack.Screen options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} name="linkupPost"></Stack.Screen>
            <Stack.Screen options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} name="reel-create"></Stack.Screen>
        </Stack>

    );
}