import { StyleSheet, Animated, TouchableOpacity, View, useWindowDimensions, Text } from 'react-native'
import { useEffect, useRef } from 'react'
import React from 'react'
import Svg, { G, Circle } from "react-native-svg"
import { AntDesign } from "@expo/vector-icons"

const NextButton = ({ percentage, scrollTo }) =>
{
    const size = 128;
    const strokeWidth = 2;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2
    const circumference = 2 * Math.PI * radius

    const progressAnimation = useRef(new Animated.Value(0)).current
    const progressRef = useRef(null)

    const { screenWidth } = useWindowDimensions()

    const animation = (toValue) =>
    {
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    useEffect(() =>
    {
        animation(percentage)
    }, [percentage])

    useEffect(() =>
    {
        progressAnimation.addListener((value) =>
        {
            const strokeDashoffset = circumference - (circumference * value.value) / 100

            if (progressRef?.current)
            {
                progressRef.current.setNativeProps({
                    strokeDashoffset
                })
            }

        }, [percentage])

        return () =>
        {
            progressAnimation.removeAllListeners()
        }
    }, [])

    return (
        <View style={[styles.container, { width: screenWidth }]}>

            <Svg width={size} height={size}>

                <G rotation="-90" origin={center}>

                    {/* <Circle stroke="#171717" cx={center} cy={center} strokeWidth={strokeWidth} />

                    <Circle stroke="#FAFAFA" ref={progressRef} cx={center} cy={center} r={radius} strokeWidth={strokeWidth}

                        strokeDasharray={circumference}></Circle> */}
                </G>

            </Svg>

            <TouchableOpacity onPress={scrollTo} style={[styles.button]} activeOpacity={0.6}>
                <AntDesign name="arrowright" size={42} color="#fff"></AntDesign>

            </TouchableOpacity>

        </View>
    )
}

export default NextButton

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        right: 0,
        marginBottom: 200,
        marginRight: 32,


    },
    button: {
        position: "absolute",
        backgroundColor: "#171717",
        borderRadius: 100,
        padding: 20
    }
})