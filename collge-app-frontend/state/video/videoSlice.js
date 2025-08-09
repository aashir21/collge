// videoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    videoRef: null,
};

export const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setVideoRef(state, action)
        {
            return { ...state, videoRef: action.payload };
        },
    },
});

export const { setVideoRef } = videoSlice.actions;
export default videoSlice.reducer;
