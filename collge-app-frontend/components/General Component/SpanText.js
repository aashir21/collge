import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../constants/theme'

const SpanText = ({ subtext }) =>
{
    return (
        <Text style={{ color: COLORS.secondary }}>{subtext}</Text>
    )
}

export default SpanText

const styles = StyleSheet.create({})