import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback } from 'react'
import { Octicons } from '@expo/vector-icons';
import { SIZES, COLORS } from '../../constants/theme';
import { useDispatch, useSelector } from "react-redux"
import { toggleMute } from "../../state/mute/muteSlice"

const VideoMuteBtn = React.memo(() =>
{
    const dispatch = useDispatch();
    const muteStatus = useSelector((state) => state.mute.isMuted)

    const handleMuteToggle = () =>
    {
        dispatch(toggleMute());
    };

    return (
        <View style={{ justifyContent: "center", alignItems: "center", flexGrow: 1, pointerEvents: "box-none" }}>
            <TouchableOpacity onPress={handleMuteToggle} style={styles.muteStatusWrapper}>
                {
                    muteStatus ?
                        <Octicons name="mute" size={22} color={COLORS.tertiary} /> :
                        <Octicons name="unmute" size={22} color={COLORS.tertiary} />
                }
            </TouchableOpacity>
        </View>
    );
});

export default VideoMuteBtn;

const styles = StyleSheet.create({
    muteStatusWrapper: {
        height: 48,
        width: 56,
        justifyContent: "center",
        alignItems: "center",
    }
})