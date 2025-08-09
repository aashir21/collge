import { router } from "expo-router";


export async function navigateToReportPage(params)
{

    router.push({
        pathname: "/report",
        params: params
    })

}