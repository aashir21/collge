import { StyleSheet, Text, useWindowDimensions, View, Image, TouchableOpacity, StatusBar, Platform } from 'react-native'
import React from 'react'
import { COLORS, FONT, SIZES } from '../../constants/theme'
import { LinearGradient } from 'expo-linear-gradient';
import
{
    SkeletonContainer,
} from 'react-native-dynamic-skeletons';

const GlobalFeedSkeleton = () =>
{

    const { width } = useWindowDimensions()
    const Gradient = (props) => <LinearGradient {...props} />

    return (
        <View style={styles.container}>
            <View style={{ width: width - 32, backgroundColor: COLORS.textAccent, borderRadius: SIZES.large, padding: SIZES.large, marginBottom: SIZES.medium, alignSelf: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.textAccent }}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={[styles.imgCon, { backgroundColor: COLORS.skeletonBG }]}>
                            <Image style={{ objectFit: "cover", height: 48, width: 48, borderRadius: 48 / 2 }} />
                        </SkeletonContainer>
                        <View style={{ justifyContent: "flex-start", alignItems: "flex-start", marginHorizontal: SIZES.small, flexDirection: "column", width: "58%" }}>
                            <View style={{ flexDirection: "column" }}>
                                <View style={{ flexDirection: "column" }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={{ backgroundColor: COLORS.skeletonBG, borderRadius: SIZES.large }}>
                                            <View style={[styles.postAuthorName, { height: 7, width: "40%" }]}></View>
                                        </SkeletonContainer>

                                        <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={{ backgroundColor: COLORS.skeletonBG, borderRadius: SIZES.large }}>
                                            <View style={[styles.postAuthorName, { height: 7, width: "10%", marginLeft: SIZES.xSmall }]}></View>
                                        </SkeletonContainer>

                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: SIZES.small }}>
                                        <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={{ backgroundColor: COLORS.skeletonBG, borderRadius: SIZES.large }}>
                                            <View style={[styles.postAuthorName, { height: 7, width: "20%" }]}></View>
                                        </SkeletonContainer>
                                    </View>
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


            <View style={{ width: width - 32, backgroundColor: COLORS.textAccent, borderRadius: SIZES.large, padding: SIZES.large, marginBottom: SIZES.medium, alignSelf: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: COLORS.textAccent }}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={[styles.imgCon, { backgroundColor: COLORS.skeletonBG }]}>
                            <Image style={{ objectFit: "cover", height: 48, width: 48, borderRadius: 48 / 2 }} />
                        </SkeletonContainer>
                        <View style={{ justifyContent: "flex-start", alignItems: "flex-start", marginHorizontal: SIZES.small, flexDirection: "column", width: "58%" }}>
                            <View style={{ flexDirection: "column" }}>
                                <View style={{ flexDirection: "column" }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={{ backgroundColor: COLORS.skeletonBG, borderRadius: SIZES.large }}>
                                            <View style={[styles.postAuthorName, { height: 7, width: "40%" }]}></View>
                                        </SkeletonContainer>

                                        <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={{ backgroundColor: COLORS.skeletonBG, borderRadius: SIZES.large }}>
                                            <View style={[styles.postAuthorName, { height: 7, width: "10%", marginLeft: SIZES.xSmall }]}></View>
                                        </SkeletonContainer>

                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: SIZES.small }}>
                                        <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={{ backgroundColor: COLORS.skeletonBG, borderRadius: SIZES.large }}>
                                            <View style={[styles.postAuthorName, { height: 7, width: "20%" }]}></View>
                                        </SkeletonContainer>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: SIZES.small }}>
                                        <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={{ backgroundColor: COLORS.skeletonBG, borderRadius: SIZES.large }}>
                                            <View style={[styles.postAuthorName, { height: 7, width: "20%" }]}></View>
                                        </SkeletonContainer>
                                    </View>
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
                        <View style={{ height: 350, width: "100%", marginTop: SIZES.medium }}></View>
                    </SkeletonContainer>
                    <View>
                        <Image style={styles.postImg} ></Image>
                    </View>
                </View>


            </View>



        </View >
    )
}

export default GlobalFeedSkeleton

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight + 84 : StatusBar.currentHeight + 32,
    }
    ,
    storiesContainer: {
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center"
    },
    storyImg: {
        height: 78,
        width: 78,
        resizeMode: "cover",
        objectFit: "cover",
        borderRadius: 78 / 2,

    },
    storyCon: {
        height: 78,
        width: 78,
        borderRadius: 78 / 2,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    imgCon: {
        height: 48,
        width: 48,
        borderRadius: 48 / 2,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",

    },
    timeStamp: {
        fontSize: SIZES.small,
        color: COLORS.whiteAccent,
        fontFamily: FONT.regular,
        marginHorizontal: SIZES.xSmall
    },
    postAuthorName: {
        fontFamily: FONT.regular,
        color: COLORS.tertiary,
        fontSize: SIZES.medium,
    },
})