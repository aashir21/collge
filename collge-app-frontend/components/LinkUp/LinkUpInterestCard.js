import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS, ENDPOINT, FONT, NOTIFICATION_TYPES, SIZES } from '../../constants/theme'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { customFetch } from '../../utility/tokenInterceptor';
import { useToast } from 'react-native-toast-notifications';
import { sendNotification } from '../../utility/notification';
import { fetchUserIdFromStorage } from '../../utility/general';
import { router } from 'expo-router';
import { debounce } from 'lodash';

const LinkUpInterestCard = ({ images, interests, firstName, lastName, username, premiumUser, role, linkUpVerified, uniName, yearOfGraduation, campus, userId, postId }) =>
{

    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const acceptLinkUpRequest = debounce(async () =>
    {

        setIsLoading(true)
        const currentUserId = await fetchUserIdFromStorage()

        try
        {
            const response = await customFetch(`${ENDPOINT.BASE_URL}/api/v1/linkup/acceptLinkUpRequest?userId=${userId}&postId=${postId}`, {
                method: "POST"
            })

            if (response.ok)
            {

                const actorId = parseInt(currentUserId);
                sendNotification(actorId, [userId], [null], null, "null", "", NOTIFICATION_TYPES.LINKUP_ACCEPTED)

                router.back()

                toast.show("LinkUp accepted", {
                    placement: "top",
                    duration: 3000,
                    type: "normal"
                })

            }
        } catch (err)
        {
            toast.show("Could not accept request", {
                placement: "top",
                duration: 3000,
                type: "normal"
            })
        }
        finally
        {
            setIsLoading(false)
        }

    }, 350)

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <FlatList
                    data={images}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(index) => index.toString()} // Assuming your images have unique URLs
                    scrollEventThrottle={16}
                    bounces={false}

                    renderItem={({ item, index }) => (

                        <View style={{ flex: 1 }}>
                            <Image source={{ uri: item }} style={styles.userImg} />
                            <View style={styles.profileInfo}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={styles.name}>{firstName} {lastName}</Text>
                                    {
                                        premiumUser == true && <Image style={styles.verified} source={require("../../assets/images/verified.png")}></Image>
                                    }
                                    {
                                        role === "ADMIN" && <Image style={styles.verified} source={require("../../assets/images/C.png")}></Image>
                                    }

                                </View>
                                <Text style={styles.username}>{username}</Text>
                            </View>
                        </View>

                    )}
                />
            </View>
            <View style={styles.textContainer}>

                {
                    linkUpVerified === true ? <View style={styles.identityView}>
                        {
                            linkUpVerified == true && <Image style={styles.verified} source={require("../../assets/images/linkup-verified.png")}></Image>
                        }
                        <Text style={styles.disclaimerTitle}>This user's identity has been verified by Collge.</Text>
                    </View>
                        :
                        <View style={styles.identityView}>
                            <AntDesign name="warning" size={14} color={COLORS.warning} />
                            <Text style={[styles.disclaimerTitle]}>This user has not verified their identity with Collge.</Text>
                        </View>
                }

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <FontAwesome5 name="university" size={20} color={COLORS.tertiary} />
                        <Text style={styles.cardDetailText}>{uniName}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <FontAwesome5 name="map-pin" size={14} color={COLORS.tertiary} />
                        <Text style={styles.cardDetailText}>{campus}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: SIZES.small }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <FontAwesome name="graduation-cap" size={20} color={COLORS.tertiary} />
                        <Text style={styles.cardDetailText}>{yearOfGraduation}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.interestContainer}>
                <FlatList
                    data={interests}
                    horizontal
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(index) => index.toString()} // Assuming your images have unique URLs
                    scrollEventThrottle={16}
                    bounces={false}

                    renderItem={({ item, index }) => (

                        <Pressable>
                            <Text style={styles.interestTitle}>{item}</Text>
                        </Pressable>

                    )}
                />
            </View>

            <TouchableOpacity onPress={acceptLinkUpRequest} style={styles.acceptBtn}>
                <Text style={styles.btnTitle}>Accept Request</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LinkUpInterestCard

const styles = StyleSheet.create({

    container: {

        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.large,
        marginTop: SIZES.large,
    },

    imageContainer: {
    },
    textContainer: {
        marginVertical: SIZES.medium,
        paddingHorizontal: SIZES.medium
    },
    userImg: {
        height: 200,
        width: 362,
        objectFit: "cover",
        borderTopLeftRadius: SIZES.large,
        borderTopRightRadius: SIZES.large
    },
    profileInfo: {
        position: "absolute",
        bottom: 0,
        marginHorizontal: SIZES.medium,
        marginVertical: SIZES.medium
    },
    name: {
        fontFamily: FONT.bold,
        fontSize: SIZES.large,
        color: COLORS.tertiary,
        marginRight: 4
    },
    username: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.secondary,
    },
    identityView: {
        flexDirection: "row",
        marginBottom: SIZES.small,
        alignItems: "center"
    },
    verified: {
        height: 14,
        width: 14,
        objectFit: "contain",
        marginLeft: SIZES.xSmall - 8
    },
    disclaimerTitle: {
        fontSize: SIZES.small,
        fontFamily: FONT.regular,
        color: COLORS.whiteAccent,
        marginLeft: 8
    },
    cardDetailText: {
        fontFamily: FONT.regular,
        fontSize: SIZES.small,
        color: COLORS.tertiary,
        marginLeft: 8
    },
    interestContainer: {

        marginBottom: SIZES.small,
        marginHorizontal: SIZES.medium
    },
    interestTitle: {
        fontFamily: FONT.regular,
        fontSize: SIZES.xSmall,
        color: COLORS.tertiary,
        borderWidth: 1,
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.large,
        borderRadius: SIZES.large,
        marginRight: 4,
        borderColor: COLORS.secondary
    },
    acceptBtn: {
        paddingHorizontal: SIZES.large,
        paddingVertical: SIZES.small,
        backgroundColor: COLORS.primary,
        marginHorizontal: SIZES.medium,
        marginBottom: SIZES.small,
        width: "50%",
        borderRadius: SIZES.large
    },
    btnTitle: {
        color: COLORS.tertiary,
        fontFamily: FONT.regular,
        textAlign: "center",
        fontSize: SIZES.small
    }

})