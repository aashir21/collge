import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    firstName: "",
    lastName: "",
    username: "",
    password: ""
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setFirstName: (state, action) =>
        {
            state.firstName = action.payload
        },
        setLastName: (state, action) =>
        {
            state.lastName = action.payload
        },
        setUsername: (state, action) =>
        {
            state.username = action.payload
        },
        setPassword: (state, action) =>
        {
            state.password = action.payload
        }
    }
})


export const { setFirstName, setLastName, setUsername, setPassword } = userSlice.actions
export default userSlice.reducer