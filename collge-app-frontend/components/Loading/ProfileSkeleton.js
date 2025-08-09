import
{
    StyleSheet, RefreshControl,
    Text, View, Image, useWindowDimensions, SafeAreaView, TouchableOpacity, ScrollView, FlatList,
    Platform
} from 'react-native'
import React from 'react'
import { COLORS, ENDPOINT, FONT, SIZES } from '../../constants/theme'
import { MaterialIcons, AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from "expo-router"
import { LinearGradient } from 'expo-linear-gradient';
import
{
    SkeletonContainer,
    GradientProps,
} from 'react-native-dynamic-skeletons';


const ProfileSkeleton = () =>
{

    const { width } = useWindowDimensions()
    const Gradient = (props) => <LinearGradient {...props} />

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary }}>
            <View style={styles.container}>
                <View style={{ backgroundColor: "#30353d", flex: Platform.OS === "android" ? 0.6 : 0.5 }}>
                    <View style={{ flex: 1, width: width, resizeMode: "cover", position: "relative", objectFit: "cover" }}></View>
                    <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={{ backgroundColor: "#30353d" }}>
                        <View style={{ alignItems: "center", flexDirection: "row", backgroundColor: "#30353d" }}>

                        </View>
                        <View style={styles.username}>

                        </View>
                    </SkeletonContainer >
                </View >
                <View style={[styles.bioContainer, { width: width - SIZES.xxLarge }]}>
                    <View style={{ flex: 0.6, flexWrap: "no-wrap" }}>
                        <SkeletonContainer isLoading={true} Gradient={Gradient} style={{ backgroundColor: "#30353d" }} colors={["#30353d", "#505761", "#3b3f45"]}>
                            <View style={{ height: 10, width: "35%", borderRadius: SIZES.large }}>

                            </View>
                        </SkeletonContainer>
                        <SkeletonContainer isLoading={true} Gradient={Gradient} style={{ backgroundColor: "#30353d" }} colors={["#30353d", "#505761", "#3b3f45"]}>
                            <View style={{ height: 10, width: "75%", marginTop: 5, borderRadius: SIZES.large }}>
                            </View>
                        </SkeletonContainer>
                    </View>
                    <View style={{ flex: 0.4, flexWrap: "no-wrap", alignItems: "flex-end" }}>
                        <TouchableOpacity style={[styles.editBtn]}>
                            <SkeletonContainer isLoading={true} Gradient={Gradient} style={{
                                backgroundColor: "#30353d", paddingVertical: SIZES.small,
                                paddingHorizontal: SIZES.medium,
                                width: "75%",
                                borderRadius: SIZES.large
                            }} colors={["#30353d", "#505761", "#3b3f45"]}>
                                <View style={{ color: COLORS.tertiary, fontSize: SIZES.small }}></View>
                            </SkeletonContainer>

                        </TouchableOpacity>
                    </View>
                </View>

                <View View style={[styles.infoContainer, { width: width }]} >

                    <View style={[styles.infoBar, { width: width - SIZES.xxLarge }]}>
                        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <SkeletonContainer isLoading={true} Gradient={Gradient} style={{ backgroundColor: "#30353d" }} colors={["#30353d", "#505761", "#3b3f45"]}>
                                <View style={{ height: 25, width: 25, borderRadius: SIZES.large, marginBottom: 4 }}></View>
                            </SkeletonContainer>
                            <Text style={styles.infoLabel}>Posts</Text>
                        </View>
                        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <SkeletonContainer isLoading={true} Gradient={Gradient} style={{ backgroundColor: "#30353d" }} colors={["#30353d", "#505761", "#3b3f45"]}>
                                <View style={{ height: 25, width: 25, borderRadius: SIZES.large, marginBottom: 4 }}></View>
                            </SkeletonContainer>
                            <Text style={styles.infoLabel}>Reputation</Text>
                        </View>
                        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <SkeletonContainer isLoading={true} Gradient={Gradient} style={{ backgroundColor: "#30353d" }} colors={["#30353d", "#505761", "#3b3f45"]}>
                                <View style={{ height: 25, width: 25, borderRadius: SIZES.large, marginBottom: 4 }}></View>
                            </SkeletonContainer>
                            <Text style={styles.infoLabel}>Fire</Text>
                        </View>
                    </View>

                </View >

                <View style={[styles.profileBtnContainer, { width: width - 32 }]}>

                    <TouchableOpacity style={[styles.editBtn, { marginRight: SIZES.small }]}>
                        <Text style={{ color: COLORS.tertiary, fontSize: SIZES.small }}>Friends</Text>
                        <FontAwesome5 style={{ marginLeft: SIZES.small }} name="user-friends" size={18} color={COLORS.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.editBtn}>
                        <Text style={{ color: COLORS.tertiary, fontSize: SIZES.small }}>Posts</Text>
                        <Ionicons style={{ marginLeft: SIZES.small }} name="images-outline" size={18} color={COLORS.tertiary} />
                    </TouchableOpacity>

                </View>

                <View style={{ width: width - 32, backgroundColor: COLORS.textAccent, borderRadius: SIZES.large, padding: SIZES.large, marginBottom: SIZES.medium, alignSelf: "center", flex: 0.3 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.textAccent }}>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={[styles.imgCon, { backgroundColor: COLORS.skeletonBG }]}>
                                <Image style={{ objectFit: "cover", height: 48, width: 48, borderRadius: 48 / 2 }} />
                            </SkeletonContainer>
                            <View style={{ justifyContent: "flex-start", alignItems: "flex-start", marginHorizontal: SIZES.small, flexDirection: "column", width: "58%" }}>
                                <View style={{ flexDirection: "column" }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={{ backgroundColor: COLORS.skeletonBG, borderRadius: SIZES.large }}>
                                            <View style={[styles.postAuthorName, { height: 7, width: "40%" }]}></View>
                                        </SkeletonContainer>

                                        <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={{ backgroundColor: COLORS.skeletonBG, borderRadius: SIZES.large }}>
                                            <View style={[styles.postAuthorName, { height: 7, width: "10%", marginLeft: SIZES.xSmall }]}></View>
                                        </SkeletonContainer>
                                    </View>
                                    <Text numberOfLines={1} style={[styles.postAuthorName, { fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.secondary, width: width - (width / 2) }]}></Text>
                                </View>
                                {/* numberOfLines={1} style={[styles.userUni, { width: width - (width / 2) }]} */}
                            </View>

                            <View style={{ alignItems: "flex-start", width: "20%", justifyContent: "flex-end", flexDirection: "row", height: 40 }}>
                                <TouchableOpacity>

                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                    <View>

                        <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={{ backgroundColor: COLORS.skeletonBG, borderRadius: SIZES.large }}>
                            <View style={{ height: 7, width: "95%", marginTop: SIZES.medium }}></View>
                            <View style={{ height: 7, width: "80%", marginTop: SIZES.xSmall }}></View>
                            <View style={{ height: 7, width: "97%", marginTop: SIZES.xSmall }}></View>
                            <View style={{ height: 7, width: "50%", marginTop: SIZES.xSmall }}></View>
                        </SkeletonContainer>
                        <View>
                            <Image style={styles.postImg} ></Image>
                        </View>
                    </View>


                </View>

            </View >

        </View>
    )
}

export default ProfileSkeleton

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
    },
    nameContainer: {
        flex: 1,
        position: "absolute",
        bottom: 0,
        paddingVertical: SIZES.medium
    },
    name: {
        fontFamily: FONT.bold,
        color: COLORS.tertiary,
        fontSize: SIZES.xxLarge,
        textAlign: "left",
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,

    },
    vBadge: {
        height: 18,
        width: 18,
        resizeMode: "cover",
        objectFit: "contain",
        marginLeft: SIZES.xSmall,
    },
    cBadge: {
        height: 18,
        width: 18,
        resizeMode: "cover",
        objectFit: "contain",
        marginLeft: 4,
    },
    username: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        textAlign: "left",
        textShadowColor: 'rgba(0, 0, 0, 0.65)', // Shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 5,

    },
    avatarContainer: {
        flex: 0.4,
        // backgroundColor: "red"
    },
    bioContainer: {
        flex: 0.15,
        // backgroundColor: "green",
        flexDirection: "row",
        alignItems: "center"

    },
    title: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.secondary,
        paddingHorizontal: 2,
        textAlign: "left",


    },
    uniName: {
        fontFamily: FONT.regular,
        fontSize: SIZES.medium,
        color: COLORS.tertiary,
        marginTop: 2,
        textAlign: "left",
        paddingHorizontal: 2,
    },
    editBtn: {
        backgroundColor: COLORS.textAccent,
        paddingVertical: SIZES.small,
        paddingHorizontal: SIZES.medium,
        borderRadius: SIZES.small,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

    },

    infoContainer: {
        flex: 0.15,
        justifyContent: "flex-start",
        alignItems: "center",
        // backgroundColor: "green"
    },
    infoBar: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.large,
        // borderTopRightRadius: SIZES.large,
        // borderBottomLeftRadius: SIZES.large,
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
    profileBtnContainer: {
        flex: 0.1,
        marginTop: SIZES.medium,
        marginBottom: SIZES.xxLarge,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
        // backgroundColor: "yellow",
    },
    profileContainer: {
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center"
    }
})