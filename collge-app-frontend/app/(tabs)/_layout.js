import { Tabs } from "expo-router";
import { COLORS } from "../../constants/theme";
import { MaterialCommunityIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Platform, View, useWindowDimensions } from "react-native";
import { useRef } from "react";
import { useScrollToTop } from "@react-navigation/native";

export default function TabsLayout()
{

    const dimensions = useWindowDimensions();
    const ref = useRef(null);  // Ref for the scrollable component
    useScrollToTop(ref);

    return (
        <View style={{ height: dimensions.height, width: dimensions.width }}>
            <Tabs screenOptions={{
                headerShown: false
            }}
            >

                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarLabel: "Home",
                        title: "Home",
                        tabBarStyle: {
                            backgroundColor: "#171717", borderTopColor: "#010101", height: Platform.OS === "android" ? 60 : 84, borderTopWidth: 0, elevation: 0
                        },
                        tabBarActiveTintColor: COLORS.secondary,
                        tabBarInactiveTintColor: COLORS.whiteAccent,
                        tabBarIcon: () =>
                        {
                            return (
                                <FontAwesome5 name="university" size={24} color={COLORS.tertiary} />
                            )
                        },

                    }}
                    listeners={({ navigation, route }) => ({
                        tabPress: () =>
                        {
                            const isAtFirstScreenOfStack = !route.state || route.state?.index === 0;
                            if (navigation.isFocused() && isAtFirstScreenOfStack)
                            {
                                ref.current?.scrollTo({            // Scroll to top
                                    y: 0,
                                    animated: true,
                                });
                            }
                        },
                    })}
                />
                <Tabs.Screen
                    name="index"
                    options={{
                        href: null,
                        tabBarStyle: {
                            backgroundColor: "#171717", borderTopColor: "#010101", height: Platform.OS === "android" ? 60 : 84, borderTopWidth: 0, elevation: 0
                        },
                        tabBarActiveTintColor: COLORS.secondary,
                        tabBarInactiveTintColor: COLORS.whiteAccent,

                    }}
                />


                <Tabs.Screen
                    name="linkup"
                    options={{
                        tabBarLabel: "Link Up",
                        title: "Link Up",
                        tabBarStyle: {
                            backgroundColor: "#171717", borderTopColor: "#010101", height: Platform.OS === "android" ? 60 : 84, borderTopWidth: 0, elevation: 0
                        },
                        tabBarActiveTintColor: COLORS.secondary,
                        tabBarInactiveTintColor: COLORS.whiteAccent,
                        tabBarIcon: () =>
                        {
                            return (
                                <MaterialCommunityIcons name="hook" size={24} color={COLORS.tertiary} />
                            )
                        },

                    }}
                />

                <Tabs.Screen
                    name="post"
                    options={{
                        tabBarLabel: "Create",
                        tabBarStyle: {
                            backgroundColor: "#171717", borderTopColor: "#010101", height: Platform.OS === "android" ? 60 : 84, borderTopWidth: 0, elevation: 0
                        },
                        tabBarActiveTintColor: COLORS.secondary,
                        tabBarInactiveTintColor: COLORS.whiteAccent,
                        tabBarIcon: () =>
                        {
                            return (
                                <MaterialCommunityIcons name="lightbulb-on-outline" size={28} color={COLORS.tertiary} />
                            )
                        },


                    }}


                />

                <Tabs.Screen
                    name="reels"
                    options={{
                        tabBarLabel: "Tapes",
                        title: "Reels",
                        tabBarStyle: {
                            backgroundColor: "#171717", borderTopColor: "#010101", height: Platform.OS === "android" ? 60 : 84, borderTopWidth: 0, elevation: 0
                        },
                        tabBarActiveTintColor: COLORS.secondary,
                        tabBarInactiveTintColor: COLORS.whiteAccent,
                        tabBarIcon: () =>
                        {
                            return (
                                <FontAwesome5 name="tape" size={24} color={COLORS.tertiary} />
                            )
                        },

                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        tabBarLabel: "Profile",
                        title: "Profile",
                        tabBarStyle: {
                            backgroundColor: "#171717", borderTopColor: "#010101", height: Platform.OS === "android" ? 60 : 84, borderTopWidth: 0, elevation: 0
                        },
                        tabBarActiveTintColor: COLORS.secondary,
                        tabBarInactiveTintColor: COLORS.whiteAccent,
                        tabBarIcon: () =>
                        {
                            return (
                                <FontAwesome name="graduation-cap" size={24} color={COLORS.tertiary} />
                            )
                        },

                    }}
                    listeners={({ navigation, route }) => ({
                        tabPress: () =>
                        {
                            const isAtFirstScreenOfStack = !route.state || route.state?.index === 0;
                            if (navigation.isFocused() && isAtFirstScreenOfStack)
                            {
                                ref.current?.scrollTo({            // Scroll to top
                                    y: 0,
                                    animated: true,
                                });
                            }
                        },
                    })}
                />

                {/* route for camera  */}
                <Tabs.Screen
                    name="camera"

                    options={{
                        href: null,
                        tabBarStyle: { display: "none" },
                        tabBarActiveTintColor: COLORS.secondary,
                        tabBarInactiveTintColor: COLORS.whiteAccent,

                    }}

                />

            </Tabs>
        </View>

    );
}