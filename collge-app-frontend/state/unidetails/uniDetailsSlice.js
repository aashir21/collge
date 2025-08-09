import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    universityName: "",
    email: "",
    yearOfGraduation: "",
    location: ""
}

export const uniDetailsSlice = createSlice({
    name: "uniDetails",
    initialState,
    reducers: {
        setUniDetails: (state, action) =>
        {
            return {
                ...state, // Keep existing state
                ...action.payload, // Merge new data
            };
        },
        resetUniDetails: () => initialState
    }
})


export const { setUniDetails, resetUniDetails } = uniDetailsSlice.actions
export default uniDetailsSlice.reducer