import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, FlatList, Image, useWindowDimensions, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, ENDPOINT, SIZES, FONT } from "../../constants/theme"
import { customFetch } from "../../utility/tokenInterceptor"
import { useToast } from 'react-native-toast-notifications'
import { AntDesign, FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { ImageBackground } from 'expo-image'

const LinkUpProfile = ({ userId }) =>
{

    const [userLinkUpData, setUserLinkUpData] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const toast = useToast()
    const { width } = useWindowDimensions()

    const fetchUserLinkUpProfileData = async () =>
    {

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/linkup/getLinkUpProfileData?userId=${userId}`, {
                method: "GET"
            })

            if (response.ok)
            {
                const data = await response.json()
                setUserLinkUpData(data)
            }
        } catch (err)
        {
            toast.show("Failed fetch profile data", {
                placement: "top",
                duration: 3000,
                type: "normal"
            })
        }
        finally
        {
            setIsLoading(false)
        }

    }

    useEffect(() =>
    {

        fetchUserLinkUpProfileData();

    }, [])

    if (isLoading)
    {
        return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
            <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
        </View>
    }

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView>
                <View style={styles.imageContainer}>
                    <FlatList
                        data={userLinkUpData.images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(index) => index.toString()} // Assuming your images have unique URLs
                        scrollEventThrottle={16}
                        bounces={false}
                        scrollEnabled={userLinkUpData.images.length >= 1 ? false : true}

                        renderItem={({ item, index }) => (

                            <View>
                                <ImageBackground source={{ uri: item }} blurRadius={25}>
                                    <Image source={{ uri: item }} style={[styles.userImg, { width: width }]} />
                                </ImageBackground>
                                <View style={styles.profileInfo}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.name}>{userLinkUpData.firstName} {userLinkUpData.lastName}</Text>
                                        {
                                            userLinkUpData.premiumUser == true && <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image>
                                        }
                                        {
                                            userLinkUpData.role === "ADMIN" && <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image>
                                        }

                                    </View>
                                    <Text style={styles.username}>{userLinkUpData.uniName.length > 25 ? userLinkUpData.uniName.substring(0, 25) + "..." : userLinkUpData.uniName} ' {userLinkUpData.yearOfGraduation}</Text>
                                </View>
                            </View>


                        )}
                    />
                </View>

                <View style={[styles.userStats, { width: width - 32, alignSelf: "center" }]}>

                    <View style={{ flexDirection: "row", alignItems: "center", width: width - 32, alignSelf: "center", marginBottom: SIZES.medium }}>
                        {
                            userLinkUpData.linkUpVerified == true ?
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    {
                                        userLinkUpData.linkUpVerified == true && <Image style={styles.verified} source={require("../../assets/images/linkup-verified.png")}></Image>
                                    }
                                    <Text style={styles.identityText}>   This user's identity has been verified by Collge</Text>
                                </View>
                                :
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <AntDesign name="warning" size={14} color={COLORS.warning} />
                                    <Text style={[styles.disclaimerTitle]}>   This user has not verified their identity with Collge.</Text>
                                </View>
                        }

                    </View>

                    <View>
                        <View style={styles.linkUpUserUniDetails}>
                            <FontAwesome5 name="map-pin" size={16} color={COLORS.secondary} />
                            <Text style={styles.uniPropTitle}>{userLinkUpData.campus}</Text>
                        </View>

                        {/* <View style={styles.linkUpUserUniDetails}>
                            <FontAwesome name="graduation-cap" size={16} color={COLORS.secondary} />
                            <Text style={styles.uniPropTitle}>Computer Science</Text>
                        </View> */}
                    </View>

                    <View style={[styles.infoBar, { width: width - SIZES.xxLarge }]}>
                        <View>
                            <Text style={styles.infoVal}>{userLinkUpData.reputation}</Text>
                            <Text style={styles.infoLabel}>Reputation</Text>
                        </View>
                        <View>
                            <Text style={styles.infoVal}>{userLinkUpData.fire}</Text>
                            <Text style={styles.infoLabel}>Fire</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.userBio, { width: width - 32 }]}>
                    <Text style={styles.bioTitle}>Who I Am</Text>
                    <Text style={styles.bioText}>{userLinkUpData.bio}</Text>
                </View>

                {/* 
                <View style={[styles.userBio, { width: width - 32, marginVertical: SIZES.small }]}>
                    <Text style={styles.bioTitle}>Interests</Text>
                </View> */}

            </ScrollView>

        </SafeAreaView>
    )
}

export default LinkUpProfile

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    },

    userImg: {
        height: 300,
        width: 425,
        objectFit: "contain",
        alignSelf: "center"
    },
    profileInfo: {
        position: "absolute",
        bottom: 0,
        marginHorizontal: SIZES.medium,
        marginVertical: SIZES.medium,

    },
    name: {
        fontFamily: FONT.bold,
        fontSize: SIZES.large + 2,
        color: COLORS.tertiary,
        marginRight: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,
    },
    username: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small + 2,
        color: COLORS.secondary,
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,

    },
    verified: {
        height: 14,
        width: 14,
        objectFit: "contain",
        marginLeft: SIZES.xSmall - 8
    },
    linkUpUserUniDetails: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8
    },
    uniPropTitle: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.fontBodySize,
        marginLeft: 8,
    },
    userStats: {
        paddingVertical: SIZES.medium
    },
    identityText: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.small
    },
    infoBar: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.large,
        padding: SIZES.large,
        marginVertical: SIZES.medium
    },
    infoLabel: {
        textAlign: "center",
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.tertiary
    },
    infoVal: {
        textAlign: "center",
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.tertiary
    },
    userBio: {
        alignSelf: "center"
    },
    bioTitle: {
        fontSize: SIZES.large,
        color: COLORS.secondary,
        fontFamily: FONT.bold
    },
    bioText: {
        fontSize: SIZES.fontBodySize,
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        marginVertical: SIZES.xSmall
    },
    disclaimerTitle: {
        fontFamily: FONT.regular,
        color: COLORS.warning,
        fontSize: SIZES.small
    }

})