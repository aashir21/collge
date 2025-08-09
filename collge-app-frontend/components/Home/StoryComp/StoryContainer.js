import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from "expo-secure-store"
import StoryBlock from './StoryBlock'
import { COLORS, SIZES } from '../../../constants/theme'
import { AntDesign } from '@expo/vector-icons';

const StoryContainer = () =>
{

  const { width } = useWindowDimensions()
  const [userPhoto, setUserPhoto] = useState()

  const handleGetUserAvatar = () =>
  {
    const avatar = SecureStore.getItem("__avatar")

    setUserPhoto(avatar);
  }

  useEffect(() =>
  {

    handleGetUserAvatar()


  }, [])

  return (
    <View style={[styles.container, { width: width - 32 }]}>
      <View style={styles.userStory}>
        <StoryBlock name={"You"} userUri={userPhoto} />
        <View style={styles.storyPlus}>
          <View style={{ backgroundColor: COLORS.tertiary, borderColor: COLORS.secondary, justifyContent: "center", alignItems: "center", width: 18, height: 18, borderRadius: 9 }}>
            <AntDesign name="plus" size={14} color={COLORS.primary} />
          </View>
        </View>
      </View>
      <View style={styles.friendsStory}>


      </View>
    </View>
  )
}

export default StoryContainer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: SIZES.medium,

  },
  storyPlus: {
    position: "absolute",
    alignSelf: "center",
    bottom: 35,
    right: 15,
  }
})