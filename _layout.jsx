import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import GlobalProvider from '../context/GlobalProvider';
import CustomSplashScreen from './CustomSplashScreen';

const RootLayout = () => {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
      "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
      "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
      "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
      "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
      "K2D-Thin": require("../assets/fonts/K2D-Thin.ttf"),
  "K2D-ThinItalic": require("../assets/fonts/K2D-ThinItalic.ttf"),
  "K2D-ExtraLight": require("../assets/fonts/K2D-ExtraLight.ttf"),
  "K2D-ExtraLightItalic": require("../assets/fonts/K2D-ExtraLightItalic.ttf"),
  "K2D-Light": require("../assets/fonts/K2D-Light.ttf"),
  "K2D-LightItalic": require("../assets/fonts/K2D-LightItalic.ttf"),
  "K2D-Regular": require("../assets/fonts/K2D-Regular.ttf"),
  "K2D-Italic": require("../assets/fonts/K2D-Italic.ttf"),
  "K2D-Medium": require("../assets/fonts/K2D-Medium.ttf"),
  "K2D-MediumItalic": require("../assets/fonts/K2D-MediumItalic.ttf"),
  "K2D-SemiBold": require("../assets/fonts/K2D-SemiBold.ttf"),
  "K2D-SemiBoldItalic": require("../assets/fonts/K2D-SemiBoldItalic.ttf"),
  "K2D-Bold": require("../assets/fonts/K2D-Bold.ttf"),
  "K2D-BoldItalic": require("../assets/fonts/K2D-BoldItalic.ttf"),
  "K2D-ExtraBold": require("../assets/fonts/K2D-ExtraBold.ttf"),
  "K2D-ExtraBoldItalic": require("../assets/fonts/K2D-ExtraBoldItalic.ttf"),

  });

  useEffect(() => {
    if (error) {
      console.error("Error loading fonts:", error);
    }

    const hideNativeSplashScreen = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
        setTimeout(() => {
          setIsReady(true);  // Control when to hide the custom splash screen
        }, 2000);  // Adjust the delay as needed
      }
    };

    hideNativeSplashScreen();
  }, [fontsLoaded, error]);

  if (!isReady) {
    return <CustomSplashScreen />;
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
