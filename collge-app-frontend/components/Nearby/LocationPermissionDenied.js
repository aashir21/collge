import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { COLORS, FONT, SIZES } from '../../constants/theme';
import SpanText from "../General Component/SpanText"
import { FontAwesome5 } from '@expo/vector-icons';

const LocationPermissionDenied = ({ discoveryStatus, permission }) =>
{
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {
                permission === "DENIED" &&
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <FontAwesome name="location-arrow" size={28} color={COLORS.secondary} />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.title}>We need your permission accessing your <SpanText subtext={"location"} /> </Text>
                    </View>
                    <Text style={styles.subTitle}>Before you find people with Nearby. We need to access your location so that we can return you the right results.</Text>

                    <Text style={styles.warning}>Please enable location from phone's app settings.</Text>
                </View>
            }

            {
                discoveryStatus == "false" &&
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <FontAwesome5 name="map-marked-alt" size={28} color={COLORS.secondary} />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.title}>Finding people <SpanText subtext={"Nearby"} />?</Text>
                    </View>
                    <Text style={styles.subTitle}>You can only use Nearby if you have enabled the Nearby feature.</Text>

                    <Text style={styles.warning}>Please enable Nearby from app settings.</Text>
                </View>
            }
        </View>
    )
}

export default LocationPermissionDenied

const styles = StyleSheet.create({

    title: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.xLarge,
        marginRight: 8,
        textAlign: "center"
    },
    subTitle: {
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        fontSize: SIZES.small,
        textAlign: "center",
        marginVertical: 8
    },
    warning: {
        fontFamily: FONT.regular,
        color: COLORS.warning,
        fontSize: SIZES.small,
        textAlign: "center",
        marginVertical: 8
    }

})