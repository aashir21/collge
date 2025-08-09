import { Image } from 'react-native';
import { Asset } from 'expo-asset';
import * as SecureStore from "expo-secure-store"
import { customFetch } from "./tokenInterceptor"
import { ENDPOINT } from '../constants/theme';
import { useToast } from 'react-native-toast-notifications';
import { router } from 'expo-router';


const clearOnboarding = async () =>
{
    try
    {
        await AsyncStorage.removeItem("@viewedOnboarding")
        await AsyncStorage.removeItem("__isLoggedIn")

    } catch (err)
    {
        console.log("Error @clearOnboarding: ", err);
    }
}



export const handleLogout = async () =>
{
    try
    {
        await AsyncStorage.removeItem("__isLoggedIn")
        await AsyncStorage.removeItem("__refreshToken")
        await AsyncStorage.removeItem("__jwtToken")

    } catch (err)
    {
        console.log("Error @handleLogout: ", err);
    }
}

export async function cacheImages(images)
{
    const imageAssets = images.map(async (image) =>
    {
        const asset = Asset.fromModule(image);
        await asset.downloadAsync();
        return asset;
    });

    await Promise.all(imageAssets);
}

export async function handleLinkPress(url, match)
{
    switch (match.getType())
    {
        case 'mention':
            Alert.alert('Mention pressed!');
            return;
        default:
            Alert.alert('Link pressed!');
    }
}

export function fetchUserIdFromStorage()
{
    const storedUserId = SecureStore.getItem("__userId")
    return storedUserId;
}

export async function convertMillisToReadbleTime(time)
{
    const date = new Date(time);
    const hours = date.getHours();
    const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    const amPm = hours >= 12 ? 'pm' : 'am';
    const timeString = `${formattedHours} ${amPm}`;

    return timeString;
}

export async function formatDate(newDate)
{
    const date = new Date(newDate);
    const day = date.getDate();
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[date.getMonth()]; // Get month name
    const dateString = `${day} ${month}`;

    return dateString
}

export async function reportContent(userId, postId, commentId, reportType, reportReason)
{

    const currentUserId = await SecureStore.getItem("__userId")

    const reportBody = {
        actorId: currentUserId,
        userId: userId,
        postId: postId,
        commentId: commentId,
        reportType: reportType,
        reportReason: reportReason
    }

    try
    {
        const reponse = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/admin/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify(reportBody))
        })

        if (reponse.ok)
        {
            return true;
        }
        else
        {
            return false;
        }
    } catch (err)
    {
        console.log("Something went wrong: ", err);

    }

}

export async function isMediaSizeAllowedMultiple(mediaSize, selectedImages)
{

    let calculatedSize = 0

    for (let i = 0; i < selectedImages.length; i++)
    {
        const currentAsset = selectedImages[i];
        calculatedSize += currentAsset.fileSize;
    }

    const sizeInMB = calculatedSize / (1024 * 1024)
    return sizeInMB <= mediaSize;

}

export async function isVideoDurationLessThanThirtySeconds(selectedImages)
{

    let isLessThanThirtySeconds = true

    for (let i = 0; i < selectedImages.length; i++)
    {
        const currentAsset = selectedImages[i];

        if (currentAsset.type === "video")
        {
            const durationOfAssetInSeconds = await currentAsset.duration / 1000;

            if (durationOfAssetInSeconds > 30)
            {
                isLessThanThirtySeconds = false;
            }

        }
    }

    return isLessThanThirtySeconds;

}

export async function isMediaSizeAllowedSingle(mediaSize, selectedImage)
{
    const sizeInMB = selectedImage.fileSize / (1024 * 1024)
    return mediaSize >= sizeInMB;

}