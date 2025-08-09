import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SIZES, COLORS, FONT } from '../../../constants/theme'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import LocationModal from "../../Modals/LocationModal"
import SetTagModal from '../../Modals/SetTagModal'

const TagBtn = ({ handleTaggedUsers, listOfTaggedUsers, widthSize }) =>
{
    const [isTagModalOpen, setisTagModalOpen] = useState(false)
    const openTagModal = () => setisTagModalOpen(true)
    const closeLocationModal = () => setisTagModalOpen(false)

    return (
        <View style={[styles.actionBtn, { width: widthSize }]}>
            <TouchableOpacity onPress={openTagModal} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <MaterialCommunityIcons name="tag-plus-outline" size={16} color={COLORS.secondary} style={{ marginRight: 6 }} />
                <Text style={styles.btnTitle}>Tag</Text>
            </TouchableOpacity>

            {
                isTagModalOpen && <SetTagModal listOfTaggedUsers={listOfTaggedUsers} handleTaggedUsers={handleTaggedUsers} isVisible={isTagModalOpen} onClose={closeLocationModal} />
            }

        </View>
    )
}

export default TagBtn

const styles = StyleSheet.create({

    actionBtn: {
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.xLarge,
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