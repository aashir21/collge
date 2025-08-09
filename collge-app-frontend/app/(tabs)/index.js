
import React from 'react'
import { Provider } from "react-redux"
import store from "../../state/store.js"
import App from "../../App.js"

const Index = () =>
{
    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
}

export default Index

