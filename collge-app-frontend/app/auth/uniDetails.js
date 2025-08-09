import React, { useEffect, useState } from 'react'
import UniDetails from "../../components/Auth/UniDetails"
import { router } from "expo-router"
import { Provider } from "react-redux"
import store from "../../state/store"


function uniDetails()
{



    return (
        <Provider store={store}>
            <UniDetails />
        </Provider>

    )
}

export default uniDetails 