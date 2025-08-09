import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  avatar: "",
  authorId: null,
  isPosting: false,
  username: "",
  commentDescription: "",
  posted: false,
  isPremiumUser: false,
  role: "",
  commentId: null,
  createdAt: undefined
}

export const commentSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setComment: (state, action) =>
    {
      return {
        ...state, // Keep existing state
        ...action.payload, // Merge new data
      };
    },
  },
});

export const { setComment } = commentSlice.actions;
export default commentSlice.reducer;