import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    media: null,
    mediaType: "",
    thumbnail: ""
}

export const cameraSlice = createSlice({
    name: "camera",
    initialState,
    reducers: {
        setMedia: (state, action) =>
        {
            return {
                ...state, // Keep existing state
                ...action.payload, // Merge new data
            };
        },
        resetMedia: () => initialState
    }
})


export const { setMedia, resetMedia } = cameraSlice.actions
export default cameraSlice.reducer