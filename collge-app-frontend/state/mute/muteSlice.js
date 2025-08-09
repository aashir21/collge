import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isMuted: true
}

export const muteSlice = createSlice({
    name: "mute",
    initialState,
    reducers: {
        toggleMute: (state) =>
        {
            state.isMuted = !state.isMuted
        },

        // Allows explicitly setting the mute state if needed
        setIsMuted: (state, action) =>
        {
            state.isMuted = action.payload;
        }
    }
})


export const { toggleMute } = muteSlice.actions
export default muteSlice.reducer