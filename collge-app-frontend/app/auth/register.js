import React from 'react'
import Register from "../../components/Auth/Register"
import { Provider } from "react-redux"
import store from "../../state/store"

function register()
{
    return (
        <Provider store={store}>
            <Register></Register>
        </Provider>
    )
}

export default register