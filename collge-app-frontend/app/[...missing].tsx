import { Link, Stack } from 'expo-router';
import { Image, StyleSheet, View, Text } from 'react-native';
import { ANIMATION, COLORS, FONT, SIZES } from "../constants/theme"
import React from 'react';


export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', animationDuration: ANIMATION.duration }} />
      <View style={styles.container}>

        <Image source={require("../assets/images/code.png")} style={{ height: 84, width: 84, marginVertical: SIZES.medium }}></Image>
        <Text style={styles.title}>404, You're not suposed to be here!</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.bold,
    color: COLORS.tertiary,
    textAlign: "center"
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
