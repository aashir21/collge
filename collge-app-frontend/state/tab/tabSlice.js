import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isHidden: false,
    postId: null,
}

export const tabSlice = createSlice({
    name: "tab",
    initialState,
    reducers: {
        toggleHidden: (state, action) =>
        {
            return {
                ...state, // Keep existing state
                ...action.payload, // Merge new data
            }
        }
    }
})


export const { toggleHidden } = tabSlice.actions
export default tabSlice.reducer