import { ENDPOINT } from '../constants/theme';
import { customFetch } from "./tokenInterceptor";
import * as SecureStore from "expo-secure-store"

export async function sendNotification(actorId, userIds, universityIds, postId, commentId, message, notificationType)
{

    //actorId should be of type number
    //Elements in userIds should be string

    try
    {

        const currentUserId = await SecureStore.getItem("__userId")
        const isUserVerified = SecureStore.getItem("__isVerified");

        if (isUserVerified == "false")
        {
            return;
        }

        //this is to prevent sending notifications to yourself
        if (userIds.includes(currentUserId))
        {
            return;
        }

        const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/notification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actorId, userIds, universityIds, postId, commentId, message, notificationType }),
        });

        return response.status;

    } catch (er)
    {
        console.error(er)
    }
}    