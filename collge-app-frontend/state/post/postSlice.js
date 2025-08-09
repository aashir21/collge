import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    avatar: "",
    type: "",
    userId: null,
    isPosting: false,
    authorName: "",
    username: "",
    caption: "",
    source: [],
    posted: false,
    isPremiumUser: false,
    role: "",
    postId: null,
    location: "",
    taggedUsers: [],
    isGlobal: true
}

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setPost: (state, action) =>
        {
            return {
                ...state, // Keep existing state
                ...action.payload, // Merge new data
            };
        },
        resetPost: () => initialState
    },
});

export const { setPost, resetPost } = postSlice.actions;
export default postSlice.reducer;