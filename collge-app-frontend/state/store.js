import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../state/user/userSlice"
import muteReducer from "../state/mute/muteSlice"
import postReducer from "../state/post/postSlice"
import videoReducer from "../state/video/videoSlice"
import cameraReducer from "../state/camera/cameraSlice"
import commentSlice from "../state/comment/commentSlice"
import tabReducer from "../state/tab/tabSlice"
import verificationReducer from "../state/verification/verificationSlice"
import linkupReducer from "../state/linkup/linkupSlice"
import uniDetailsReducer from "../state/unidetails/uniDetailsSlice"

const store = configureStore({
    reducer: {
        user: userReducer,
        mute: muteReducer,
        post: postReducer,
        video: videoReducer,
        camera: cameraReducer,
        comment: commentSlice,
        tab: tabReducer,
        verification: verificationReducer,
        linkup: linkupReducer,
        uniDetails: uniDetailsReducer
    },
})

export default store;