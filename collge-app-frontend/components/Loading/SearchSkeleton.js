import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { COLORS, SIZES } from '../../constants/theme'
import { Entypo } from '@expo/vector-icons';
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import
{
    SkeletonContainer,
    GradientProps,
} from 'react-native-dynamic-skeletons';
import { FlashList } from '@shopify/flash-list';
import { FlatList } from 'react-native-gesture-handler';

const SearchSkeleton = () =>
{

    const { width } = useWindowDimensions()

    const Gradient = (props) => <LinearGradient {...props} />

    return (
        <FlatList
            data={[1, 1, 1, 1]}
            renderItem={() =>
            {
                return (

                    <View>
                        <View style={[styles.container, { width: width - SIZES.large, flexDirection: "row" }]}>
                            <View style={[styles.searchTabCon]}>
                                <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]} style={{ backgroundColor: "#30353d" }}>
                                    <View isLoading={true} Gradient={Gradient} style={styles.searchTabImg}></View>
                                </SkeletonContainer>

                                <View style={{ marginHorizontal: SIZES.medium }}>
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={{ height: 25, width: "50%" }}>
                                            <SkeletonContainer isLoading={true} Gradient={Gradient} colors={["#30353d", "#505761", "#3b3f45"]}
                                                style={{ backgroundColor: "#30353d", borderRadius: SIZES.large }}>
                                                <View style={styles.searchTabName}></View>
                                                <View style={styles.searchTabUsername}></View>
                                            </SkeletonContainer>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{ justifyContent: "center", alignItems: "flex-end" }}>
                                <Entypo name="chevron-right" size={16} color={"#30353d"} />
                            </View>
                        </View>
                    </ View>

                )
            }}
        />
    )
}

export default SearchSkeleton

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.textAccent,
        borderRadius: SIZES.large,
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.small,
        marginTop: SIZES.xSmall
    },

    searchTabCon: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "80%"
    },
    searchTabImg: {
        height: 48,
        width: 48,
        backgroundColor: "#30353d",
        borderRadius: 48 / 2,
        objectFit: "cover",
    },
    searchTabName: {
        backgroundColor: "#30353d",
        width: "200%",
        height: 10,
        marginBottom: 4
    },
    searchTabUsername: {
        backgroundColor: "#30353d",
        width: "100%",
        height: 10
    },
    verified: {
        height: 12,
        width: 12,
        objectFit: "contain",
        marginLeft: 4
    }
})