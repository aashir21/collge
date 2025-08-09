import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    postId: null,
    userId: null,
    isPosting: false,
    author: null,
    caption: "",
    posted: false,
    isPremiumUser: false,
    date: "",
    time: "",
    role: "",
    postId: null,
    location: "",
    invitedUser: null,
    isLocationHidden: false,
    responseStatus: null,
    collaborativeRequestStatus: null,
    shouldShow: true
}

export const linkupSlice = createSlice({
    name: "linkup",
    initialState,
    reducers: {
        setLinkUpPost: (state, action) =>
        {
            return {
                ...state, // Keep existing state
                ...action.payload, // Merge new data
            };
        },
        resetLinkUpPost: () => initialState,
    },
});

export const { setLinkUpPost, resetLinkUpPost } = linkupSlice.actions;
export default linkupSlice.reducer;