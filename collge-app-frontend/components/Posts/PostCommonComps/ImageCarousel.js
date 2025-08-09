import React, { useEffect, useState, useRef, useCallback } from 'react';
import
{
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    useWindowDimensions,
    ActivityIndicator
} from 'react-native';
import { COLORS, SIZES, FONT } from '../../../constants/theme';
import * as FileSystem from 'expo-file-system'
import PostVideoComp from './PostVideoComp';

const ImageCarousel = ({ source, shouldPlay, handleVideoLoadState }) =>
{
    const { width } = useWindowDimensions();
    const [imageLoadingStates, setImageLoadingStates] = useState(
        source.map(() => true)  // Initialize loading state for each image
    );

    const [aspectRatio, setAspectRatio] = useState(4 / 5)
    const [mediaInfo, setMediaInfo] = useState({});
    const [isFirstAssetVid, setIsFirstAssetVid] = useState(false)

    const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
    const onViewableItemsChanged = useCallback(({ viewableItems }) =>
    {
        if (viewableItems.length > 0)
        {
            setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
        }
    }, []);
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])


    async function getMediaTypesFromScratch(uris)
    {
        const mediaTypes = {};

        for (const uri of uris)
        {
            if (!uri)
            {
                console.warn("URI is undefined. Cannot determine media type.");
                mediaTypes[uri] = 'unknown';
                continue; // Skip to the next URI in the array
            }

            try
            {
                if (uri.startsWith('http') || uri.startsWith('https'))
                {
                    // Remote URI
                    const response = await fetch(uri, { method: 'HEAD' });
                    const contentType = response.headers.get('content-type');

                    const mimeToExtensionMap = {
                        'image/jpeg': 'jpg',
                        'image/png': 'png',
                        'video/mp4': 'mp4',
                        'video/quicktime': 'mov',
                        // ... (add other MIME types and extensions)
                    };

                    mediaTypes[uri] = mimeToExtensionMap[contentType] || 'unknown';
                } else
                {
                    // Local file URI
                    const info = await FileSystem.getInfoAsync(uri);
                    if (info.exists)
                    {
                        const extension = info.uri.split('.').pop().toLowerCase();
                        mediaTypes[uri] = extension;
                    } else
                    {
                        mediaTypes[uri] = 'unknown';
                    }
                }
            } catch (error)
            {
                console.error(`Error determining media type for ${uri}:`, error);
                mediaTypes[uri] = 'unknown';
            }
        }

        return mediaTypes;
    }

    const handleAspectRatio = (ratio) =>
    {
        setAspectRatio(ratio)
    }


    useEffect(() =>
    {
        async function fetchData()
        {
            if (source && source.length > 1 && source[0])
            {
                const fetchedMediaInfo = await getMediaTypesFromScratch(source);
                setMediaInfo(fetchedMediaInfo);

                // Determine aspect ratio for the first image
                const firstImageUri = Object.keys(fetchedMediaInfo)[0];

                if (fetchedMediaInfo[firstImageUri] === "png" || fetchedMediaInfo[firstImageUri] === "jpg")
                {
                    await Image.getSize(firstImageUri, (width, height) =>
                    {
                        setAspectRatio(width > height ? 5 / 4 : 4 / 5);
                    });
                }
                else
                {
                    setIsFirstAssetVid(true)
                }

            }
        }

        fetchData(); // Call the async function inside useEffect

    }, [source]);

    const renderItem = ({ item, index }) =>
    {
        return (
            <View style={{ alignSelf: "center", borderRadius: SIZES.large }}>
                <View style={styles.postCount}>
                    <Text style={{ color: COLORS.secondary, fontFamily: FONT.regular, fontSize: 10 }}>
                        {index + 1}/{source.length}
                    </Text>
                </View>
                <View style={{ backgroundColor: COLORS.red, justifyContent: "center" }}>
                    {
                        (mediaInfo[Object.keys(mediaInfo)[index]] === "png" || mediaInfo[Object.keys(mediaInfo)[index]] === "jpg") ?
                            <Image
                                style={[styles.postImg, { width: width - 72, aspectRatio: aspectRatio }]}
                                source={{ uri: Object.keys(mediaInfo)[index] }}
                                onLoadStart={() =>
                                {
                                    // Update loading state only for this image
                                    setImageLoadingStates(prevStates =>
                                    {
                                        const newStates = [...prevStates];
                                        newStates[index] = true;
                                        return newStates;
                                    });
                                }}
                                onLoadEnd={() =>
                                {
                                    // Update loading state only for this image
                                    setImageLoadingStates(prevStates =>
                                    {
                                        const newStates = [...prevStates];
                                        newStates[index] = false;
                                        return newStates;
                                    });
                                }}
                            /> : <PostVideoComp handleAspectRatio={handleAspectRatio} vidSource={item} shouldPlay={(index === currentViewableItemIndex) && shouldPlay} aspectRatio={aspectRatio} handleVideoLoadState={handleVideoLoadState} isFirstAssetVid={isFirstAssetVid} index={index} />
                    }
                    {/* Conditional rendering of the ActivityIndicator */}
                    {imageLoadingStates[index] && (mediaInfo[Object.keys(mediaInfo)[index]] === "png" || mediaInfo[Object.keys(mediaInfo)[index]] === "jpg") ? (
                        <View style={styles.imageLoader}>
                            <ActivityIndicator size={"small"} color={COLORS.whiteAccent} />
                        </View>
                    ) : null}
                </View>
            </View>
        );
    };

    return (
        <View style={{ borderRadius: SIZES.large, marginBottom: SIZES.small, backgroundColor: COLORS.primary }}>
            <FlatList
                data={source}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()} // Assuming your images have unique URLs
                renderItem={renderItem}
                scrollEventThrottle={16}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
            />
        </View>
    );
};

export default ImageCarousel

const styles = StyleSheet.create({

    postImgCon: {

        marginVertical: SIZES.small
    },
    postImg: {
        objectFit: "cover",
        borderRadius: SIZES.large,
        backgroundColor: COLORS.primary,
        position: "relative",
        zIndex: 1,

    },
    imageLoader: {
        position: "absolute",
        zIndex: 10,
        alignSelf: "center"
    },
    postCount: {
        position: "absolute",
        zIndex: 5,
        right: 0,
        height: 28,
        width: 28,
        borderRadius: 14,
        marginVertical: SIZES.small,
        marginHorizontal: SIZES.small,
        backgroundColor: COLORS.lightBlack,
        justifyContent: "center",
        alignItems: "center"

    },
})