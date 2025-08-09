import { StyleSheet, Text, View, SafeAreaView, Platform, useWindowDimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { SIZES, COLORS, FONT } from '../../constants/theme'
import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'

const ChatHomeHeader = ({ onNewChatPress }) =>
{
  const { width } = useWindowDimensions()

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.primary }}>

      <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", backgroundColor: COLORS.primary, width: width, alignSelf: "center", paddingVertical: SIZES.large }}>
        <View style={{ alignItems: "center", flexDirection: "row", marginLeft: SIZES.small }}>

          {
            router.canGoBack() ?
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign style={{ marginHorizontal: 4 }} name="left" size={24} color={COLORS.whiteAccent} />
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => router.replace("/(tabs)/home/feeds")}>
                <AntDesign style={{ marginHorizontal: 4 }} name="close" size={24} color={COLORS.whiteAccent} />
              </TouchableOpacity>
          }


          <Text style={{ fontSize: SIZES.xxLarge, color: COLORS.tertiary, fontFamily: FONT.bold }}>Chats</Text>
        </View>
        <View style={{ justifyContent: "flex-end", alignItems: "center", flexDirection: "row", marginRight: SIZES.small }}>
          <TouchableOpacity onPress={onNewChatPress}>
            <AntDesign name="adduser" size={24} color={COLORS.tertiary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ChatHomeHeader

const styles = StyleSheet.create({})