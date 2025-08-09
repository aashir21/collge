import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SIZES, COLORS, FONT } from '../../../constants/theme'
import { FontAwesome5 } from '@expo/vector-icons'
import LocationModal from "../../Modals/LocationModal"

const LocationBtn = ({ handleLocation, widthSize }) =>
{
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
    const openLocationModal = () => setIsLocationModalOpen(true)
    const closeLocationModal = () => setIsLocationModalOpen(false)

    return (
        <View style={[styles.actionBtn, { width: widthSize }]}>
            <TouchableOpacity onPress={openLocationModal} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <FontAwesome5 name="map-pin" size={16} color={COLORS.secondary} style={{ marginRight: 6 }} />
                <Text style={styles.btnTitle}>Location</Text>
            </TouchableOpacity>

            {
                isLocationModalOpen && <LocationModal handleLocation={handleLocation} isVisible={isLocationModalOpen} onClose={closeLocationModal} />
            }

        </View>
    )
}

export default LocationBtn

const styles = StyleSheet.create({

    actionBtn: {
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.xLarge,
        width: "30%",
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SIZES.medium
    },
    btnTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.tertiary
    },
})