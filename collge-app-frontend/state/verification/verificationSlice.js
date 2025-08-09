import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selfie: "",
    cardFront: "",
    cardRear: "",
    isSubmitting: false,
    verificationType: "LINKUP",
    isRetrying: false
};

export const verificationSlice = createSlice({
    name: "verification",
    initialState,
    reducers: {
        setVerificationData: (state, action) =>
        {
            if (action.payload.key)
            {
                // Single attribute update
                state[action.payload.key] = action.payload.value;
            } else
            {
                // Multiple attributes update (original functionality)
                Object.assign(state, action.payload);
            }
        },
    },
});

export const { setVerificationData } = verificationSlice.actions;
export default verificationSlice.reducer;