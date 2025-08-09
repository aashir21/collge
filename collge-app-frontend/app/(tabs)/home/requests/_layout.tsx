import type { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import type {
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap,
} from '@react-navigation/material-top-tabs';
import { Stack, withLayoutContext } from 'expo-router';
import { Platform, SafeAreaView, StatusBar } from 'react-native';
import { COLORS, FONT, SIZES } from '../../../../constants/theme';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

const Layout = () => {

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.textAccent, paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight }}>
            <MaterialTopTabs screenOptions=
                {
                    {
                        tabBarIndicatorStyle: {
                            backgroundColor: COLORS.secondary,
                        },
                        tabBarLabelStyle: {
                            fontFamily: FONT.regular,
                            textTransform: "capitalize",
                            fontSize: SIZES.fontBodySize,
                            color: COLORS.tertiary
                        },
                        tabBarStyle: {
                            backgroundColor: COLORS.textAccent,
                        }
                    }

                }

            >
                <MaterialTopTabs.Screen name='friendRequests' options={{ title: "Friend Requests" }}></MaterialTopTabs.Screen>
                <MaterialTopTabs.Screen name='linkupRequests' options={{ title: "LinkUp Requests" }}></MaterialTopTabs.Screen>
            </MaterialTopTabs>

        </SafeAreaView>
    )

}

export default Layout;