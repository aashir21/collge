import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import AutoLinkTextComp from '../Posts/AutoLinkTextComp'
import { COLORS, FONT, SIZES } from '../../constants/theme'

const ScrollableCaptionBox = ({ caption, updatedCaption, postId, updatedPostId, propStyle, type, updateExpandState }) =>
{

    const [trimmedCaption, setTrimmedCaption] = useState(caption)
    const [isExpanded, setIsExpanded] = useState(false)

    const TRIMMED_LENGTH = 150;

    useEffect(() =>
    {

        if (caption.length > TRIMMED_LENGTH)
        {
            setTrimmedCaption(caption.slice(0, TRIMMED_LENGTH) + "...")
        }

    }, [])

    const handleExpandCaption = () =>
    {

        setIsExpanded(true)
        updateExpandState()
        setTrimmedCaption(caption)

    }

    const handleCollapseCaption = () =>
    {
        setIsExpanded(false)
        updateExpandState()
        setTrimmedCaption(caption.slice(0, TRIMMED_LENGTH) + "...")
    }

    return (
        <TouchableOpacity onPress={isExpanded ? handleCollapseCaption : handleExpandCaption} style={[propStyle, { marginTop: type === "comment" ? 0 : SIZES.medium, marginBottom: type === "comment" ? 0 : 2 }]}>

            <AutoLinkTextComp propStyle={propStyle} caption={trimmedCaption} updatedCaption={updatedCaption} postId={postId} updatedPostId={updatedPostId} />
            {
                caption.length < TRIMMED_LENGTH && type !== "comment" &&
                <View style={{ marginBottom: SIZES.medium - 2 }}></View>
            }
            {
                (caption.length > TRIMMED_LENGTH) &&
                <TouchableOpacity onPress={isExpanded ? handleCollapseCaption : handleExpandCaption} style={[styles.showMoreBtn, { marginVertical: type === "comment" ? 4 : 8 }]}>
                    <Text style={{ fontFamily: FONT.regular, color: COLORS.whiteAccent, fontSize: type === "comment" ? 10 : 12 }}>{isExpanded ? "Show less..." : "Show more..."}</Text>
                </TouchableOpacity>
            }
        </TouchableOpacity>
    )
}

export default ScrollableCaptionBox

const styles = StyleSheet.create({



    showMoreBtn: {
        padding: 0,
        flexDirection: "column",

    }

})