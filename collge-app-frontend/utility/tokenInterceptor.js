import * as SecureStore from "expo-secure-store"
import { ENDPOINT } from '../constants/theme';

const apiUrl = ENDPOINT.BASE_URL


let isRefreshing = false;
let refreshTokenPromise = null;


export async function refreshToken()
{
    const refreshToken = await SecureStore.getItem('__refreshToken');
    if (!refreshToken)
    {
        return;
    }

    const response = await fetch(`${apiUrl}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`
        },

    });

    const data = await response.json();
    if (!response.ok)
    {
        throw new Error(data.message || 'Could not refresh token');
    }

    await SecureStore.setItem('__jwtToken', data.jwtToken);
    await SecureStore.setItem('__refreshToken', data.refreshToken);

    return data.jwtToken;

}

export async function customFetch(url, options = {})
{
    const accessToken = await SecureStore.getItem('__refreshToken');
    const isUserVerified = await SecureStore.getItem("__isVerified");

    if (isUserVerified == "false")
    {
        return;
    }

    const authOptions = {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        },
    };

    let response = await fetch(url, authOptions);
    if (response.status === 401)
    {
        if (!isRefreshing)
        {
            isRefreshing = true;
            refreshTokenPromise = refreshToken().finally(() =>
            {
                isRefreshing = false;
                refreshTokenPromise = null;
            });
        }
        await refreshTokenPromise;

        const newAccessToken = await SecureStore.getItem('__refreshToken');
        authOptions.headers['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, authOptions);  // Retry the original request with the new access token
    }

    return response;
}
