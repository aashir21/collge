import { StyleSheet, Animated, useWindowDimensions, View } from 'react-native'
import React from 'react'

const Paginator = ({ data, scrollX }) =>
{

    const { width } = useWindowDimensions();

    return (
        <View style={[styles.container, { width: width }]}>
            {
                data.map((_, i) =>
                {

                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width]

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [15, 40, 15],
                        extrapolate: 'clamp'
                    })

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    })


                    return <Animated.View style={[styles.dot, { width: dotWidth, opacity }]} key={i.toString()} />
                })
            }
        </View>
    )
}

export default Paginator

const styles = StyleSheet.create({

    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: "#FAFAFA",
        marginHorizontal: 8,

    },

    container: {
        flexDirection: "row",
        height: 64,
        marginBottom: 32,
        justifyContent: "center",
        position: "absolute",
        bottom: 0
    }

})