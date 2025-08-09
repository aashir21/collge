import { Stack } from "expo-router";
import { ANIMATION, COLORS } from "../../../constants/theme"

export default function HomeLayout()
{
    return <Stack screenOptions={{ headerShown: false, headerTitle: "Reels", animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }}>
        <Stack.Screen name="index" options={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary } }} />
        <Stack.Screen name="comments" options={{ headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, animation: "slide_from_bottom", animationDuration: ANIMATION.duration, presentation: "modal" }} />
    </Stack>;
}