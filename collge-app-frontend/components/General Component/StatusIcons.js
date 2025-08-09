import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const StatusIcons = () =>
{
    return (
        <View>
            {
                premiumUser == "true" ? <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image> : null
            }
            {
                role === "ADMIN" ? <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image> : null
            }
        </View>
    )
}

export default StatusIcons

const styles = StyleSheet.create({

    verified: {
        height: 12,
        width: 12,
        objectFit: "contain",
        marginLeft: 4
    }
})