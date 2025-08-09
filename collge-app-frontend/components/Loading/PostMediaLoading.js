import { StyleSheet, Image, View, FlatList } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT, SIZES } from '../../constants/theme'
import
{
    SkeletonContainer,
    GradientProps,
} from 'react-native-dynamic-skeletons';

const PostMediaLoading = () =>
{

    const Gradient = (props) => <LinearGradient {...props} />

    return (
        <FlatList
            data={[1, 1, 1, 1, 1]}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
                <SkeletonContainer
                    isLoading={true} // Condition for showing SkeletonContainer
                    Gradient={Gradient}
                    colors={["#30353d", "#505761", "#3b3f45"]}
                    style={[styles.selectedImageStyle, { backgroundColor: COLORS.skeletonBG }]}
                >
                    <Image
                        source={{ uri: item.type === "video" ? placeholderVideoUri : item.uri }}
                        style={styles.selectedImageStyle}
                    />
                </SkeletonContainer>
            )}
        />
    )
}

export default PostMediaLoading

const styles = StyleSheet.create({

    selectedImageStyle: {
        height: 92,
        width: 92,
        borderRadius: SIZES.medium,
        marginRight: SIZES.small,
        position: "relative",
        backgroundColor: COLORS.primary
    },
})