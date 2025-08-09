import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'

const EmptyFeed = ({ title, subTitle }) =>
{
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>
    </View>
  )
}

export default EmptyFeed

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary
  },
  title: {
    color: COLORS.tertiary,
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    textAlign: "center"
  },
  subTitle: {
    color: COLORS.whiteAccent,
    fontFamily: FONT.regular,
    fontSize: SIZES.fontBodySize,
    textAlign: "center",
    marginVertical: 8
  }

})