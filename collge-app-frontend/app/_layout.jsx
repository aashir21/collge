import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { ANIMATION, COLORS } from '../constants/theme';
import * as Notifications from "expo-notifications"
import { Image, StatusBar, View } from 'react-native';
import { Asset } from "expo-asset"
import { Provider } from "react-redux";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { ToastProvider } from 'react-native-toast-notifications'
import store from "../state/store";
import * as SystemUI from "expo-system-ui"
import { useThemeColor } from '../components/Themed';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function cacheImages(images)
{
  return images.map(image =>
  {
    if (typeof image === 'string')
    {
      return Image.prefetch(image);
    } else
    {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default function RootLayout()
{
  const [fontsLoaded, fontsError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    ...FontAwesome.font,
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() =>
  {
    async function loadResourcesAndDataAsync()
    {
      try
      {
        const imageAssets = cacheImages([
          require("../assets/images/Choose-Op-img.png"),
          require("../assets/images/cloud_security.png"),
          require("../assets/images/code.png"),
          require("../assets/images/collge-full-logo.png"),
          require("../assets/images/collge.png"),
          require("../assets/images/ghost.png"),
          require("../assets/images/logo.png"),
          require("../assets/images/question-svgrepo-com.png"),
          require("../assets/images/screen-1.png"),
          require("../assets/images/screen-2.png"),
          require("../assets/images/screen-3.png"),
          require("../assets/images/screen-4.png"),
          require("../assets/images/screen-5.png"),
          require("../assets/images/secure-shield.png"),
          require("../assets/images/Splash-thumbnail.png"),
          require("../assets/images/verified.png"),
          require("../assets/images/Verify.png"),
          require("../assets/images/search.png"),
        ]);

        await Promise.all([...imageAssets]);

      } catch (e)
      {
        console.warn('Failed to load resources', e);
      } finally
      {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }


    if (fontsLoaded)
    {
      loadResourcesAndDataAsync();
    }

    // Handle font loading error
    if (fontsError)
    {
      console.error('Font loading error:', fontsError);
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded || !appIsReady)
  {
    return null;  // Optionally, return a loading screen or error screen here
  }

  return <RootLayoutNav />;
}

const RootLayoutNav = () =>
{

  useEffect(() =>
  {
    const subscription = Notifications.addNotificationResponseReceivedListener(response =>
    {
      const data = response.notification.request.content.data;

      if (data.route)
      {
        // Navigate to the specific route with any additional parameters
        router.push({
          pathname: data.route,
          params: data.params,
        });
      }
    });

    return () =>
    {
      subscription.remove();
    };
  }, []);

  return (
    <ToastProvider>
      <Provider store={store}>
        <GestureHandlerRootView style={{ backgroundColor: COLORS.primary, flex: 1 }}>
          <StatusBar></StatusBar>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.primary } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
            <Stack.Screen name="auth" options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
            <Stack.Screen name="chat" options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
            <Stack.Screen name="profile" options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
            <Stack.Screen name="report" options={{ headerShown: false, animation: `${ANIMATION.style}`, animationDuration: ANIMATION.duration }} />
          </Stack>
        </GestureHandlerRootView>
      </Provider>
    </ToastProvider>
  );
}

