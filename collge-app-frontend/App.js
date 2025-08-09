import React, { useEffect, useState } from 'react'
import { Platform, SafeAreaView, View } from 'react-native'
import GeneralLoading from "./components/Loading/GeneralLoading";
import * as SecureStore from 'expo-secure-store';
import { COLORS, ENDPOINT } from './constants/theme';
import { Redirect, router } from 'expo-router';
import { Provider } from "react-redux"
import 'react-native-reanimated';
import store from './state/store';
import { ToastProvider } from 'react-native-toast-notifications';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as SystemUI from "expo-system-ui"
import * as Updates from 'expo-updates';
import SWentWrong from './components/General Component/SWentWrong';

function App()
{

    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isComponentReady, setIsComponentReady] = useState(false)

    const [tokens, setTokens] = useState({
        accessToken: "",
        refreshToken: ""
    })

    async function onFetchUpdateAsync()
    {
        try
        {
            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable)
            {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
            }
        } catch (error)
        {
            // You can also add an alert() to see the error message in case of an error when fetching updates.
            alert(`Error fetching latest Expo update: ${error}`);
        }
    }

    if (true)
    {
        return <SWentWrong />
    }

    const checkOnBoarding = async () =>
    {
        try
        {
            const value = await SecureStore.getItem("__viewedOnboarding");
            const loggedInStatus = await SecureStore.getItem("__isLoggedIn")
            if (value !== "true" && loggedInStatus !== "true")
            {
                router.replace("/auth/onboarding")
            }

        } catch (err)
        {
            console.log("Error __checkOnboarding: ", err);
        }
    };

    const checkLogin = async () =>
    {
        try
        {
            const loginStatus = await SecureStore.getItem("__isLoggedIn");

            if (loginStatus === "true")
            {
                setIsLoggedIn(true);
            } else
            {
                setIsLoggedIn(false);
            }
        } catch (err)
        {
            console.log("Error __checkLogin: ", err);
        } finally
        {
            setLoading(false);
            setIsComponentReady(true);
        }
    };

    const updateLastLoginTime = async () =>
    {

        const currentUserId = SecureStore.getItem("__userId");

        await fetch(`${ENDPOINT.BASE_URL}/api/v1/auth/updateLastLogin?userId=${currentUserId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            }
        })

    }


    const checkRefreshTokenExpiry = async () =>
    {
        try
        {
            const url = `${ENDPOINT.BASE_URL}/api/v1/auth/refresh-token`

            const rToken = await SecureStore.getItem("__refreshToken");  //fetching refresh token from storage

            if (rToken !== null)
            {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${rToken}`
                    }
                });

                if (response.ok)
                {
                    const data = await response.json()
                    setTokens(
                        {
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken
                        }
                    )

                }
                else if (response.status === 401)
                {
                    router.replace("/auth/login")
                }
            }

        } catch (err)
        {
            console.log("Error __refreshToken: ", err);
        } finally
        {
            setLoading(false);
            setIsComponentReady(true)

        }
    }

    const setRootBackgroundColor = async () =>
    {
        await SystemUI.setBackgroundColorAsync("black")
    }

    useEffect(() =>
    {
        Promise.all([onFetchUpdateAsync(), checkOnBoarding(), checkLogin(),
        checkRefreshTokenExpiry(),
        setRootBackgroundColor(),
        updateLastLoginTime()
        ])

    }, []);

    if (!isComponentReady)
    {
        return <GeneralLoading />
    }


    if (!isLoggedIn)
    {
        return <Redirect href="/auth/login" />; // Redirect to login only if onboarding is done    
    }

    return (

        <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <BottomSheetModalProvider>
                <ToastProvider>
                    <Provider store={store}>
                        <Redirect href="/(tabs)/home/feeds" />
                    </Provider>
                </ToastProvider>
            </BottomSheetModalProvider>
        </View>

    );
};


export default App
